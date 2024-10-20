import { client as redisClient, logQueueStatus } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
import { decodePoolTicket, decodeStreamTicket, getPoolKey, getStreamId } from '@/lib/utils';
import { getMatchItems } from '@/services';
import type { IMatchType, IRedisClient } from '@/types';
import { MATCHING_EVENT } from '@/ws/events';

import { sendNotif } from './common';

const logger = {
  info: (message: unknown) => process.send && process.send(message),
  error: (message: unknown) => process.send && process.send(message),
};

const sleepTime = 500;
let stopSignal = false;
let timeout: ReturnType<typeof setTimeout>;

const cancel = () => {
  stopSignal = true;
  clearTimeout(timeout);
};

const shutdown = () => {
  cancel();
  redisClient.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', shutdown);

type RequestorParams = {
  requestorUserId: string;
  requestorStreamId: string;
  requestorSocketPort: string;
};

async function processMatch(
  redisClient: IRedisClient,
  { requestorUserId, requestorStreamId, requestorSocketPort }: RequestorParams,
  matches: unknown, // [nResult, id, [doc], ...]
  searchIdentifier?: IMatchType,
  topic?: string,
  difficulty?: string
) {
  if (!matches || !Array.isArray(matches) || matches.length === 0) {
    logger.error(`Received invalid shape for matches: ${JSON.stringify(matches)}`);
    return false;
  }

  const [nMatches, ...rest] = matches;

  if (nMatches > 0) {
    for (let i = 1; i < rest.length; i = i + 1) {
      const matched = rest[i]; // [key, value, ...]
      const {
        userId: matchedUserId,
        timestamp, // We use timestamp as the Stream ID
        socketPort: matchedSocketPort,
      } = decodePoolTicket(matched);

      if (matchedUserId === requestorUserId) {
        continue;
      }

      // To block cancellation
      sendNotif([matchedSocketPort], MATCHING_EVENT.MATCHING);

      const matchedStreamId = getStreamId(timestamp);

      logger.info(`Found match: ${JSON.stringify(matched)}`);

      await Promise.all([
        // Remove other from pool
        redisClient.del([getPoolKey(requestorUserId), getPoolKey(matchedUserId)]),
        // Remove other from queue
        redisClient.xdel(STREAM_NAME, requestorStreamId, matchedStreamId),
      ]);

      // Notify both sockets
      const { ...matchItems } = await getMatchItems(
        searchIdentifier,
        topic,
        difficulty,
        requestorUserId,
        matchedUserId
      );
      logger.info(`Generated Match - ${JSON.stringify(matchItems)}`);

      sendNotif([requestorSocketPort, matchedSocketPort], MATCHING_EVENT.SUCCESS, matchItems);
      sendNotif([requestorSocketPort, matchedSocketPort], MATCHING_EVENT.DISCONNECT);

      await logQueueStatus(logger, redisClient, `Queue Status After Matching: <PLACEHOLDER>`);
      return true;
    }
  }

  logger.info(`Found no matches` + (searchIdentifier ? ` for ${searchIdentifier}` : ''));
  return false;
}

async function match() {
  const stream = await redisClient.xreadgroup(
    'GROUP',
    STREAM_GROUP,
    STREAM_WORKER,
    'STREAMS',
    STREAM_NAME,
    '>'
  );

  if (!stream || stream.length === 0) {
    await new Promise((resolve, _reject) => {
      timeout = setTimeout(() => resolve('Next Loop'), sleepTime);
    });
    return;
  }

  for (const group of stream) {
    // [GROUP_NAME, [[id, [...document]]] ]
    if (!group || !Array.isArray(group) || group.length < 2) {
      continue;
    }

    const [_groupName, messages] = group;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      continue;
    }

    const matchRequests = messages as Array<[id: string, items: Array<string>]>;

    // Perform matching
    for (const matchRequest of matchRequests) {
      logger.info(`Received request: ${JSON.stringify(matchRequest)}`);
      const {
        id: requestorStreamId,
        userId: requestorUserId,
        socketPort: requestorSocketPort,
        difficulty,
        topic,
      } = decodeStreamTicket(...matchRequest);

      // To Block Cancellation
      sendNotif([requestorSocketPort], MATCHING_EVENT.MATCHING);

      // Build query to query the pool
      const clause = [`-@userId:(${requestorUserId})`];

      if (difficulty) {
        clause.push(`@difficulty:{${difficulty}}`);
      }

      if (topic) {
        clause.push(`@topic:{${topic}}`);
      }

      const searchParams = [
        ['LIMIT', '0', '1'],
        ['SORTBY', 'timestamp', 'ASC'],
      ].flatMap((v) => v);
      const requestorParams = { requestorUserId, requestorStreamId, requestorSocketPort };

      const exactMatches = await redisClient.call(
        'FT.SEARCH',
        POOL_INDEX,
        clause.join(' '),
        ...searchParams
      );
      const exactMatchFound = await processMatch(
        redisClient,
        requestorParams,
        exactMatches,
        'exact match',
        topic,
        difficulty
      );

      if (exactMatchFound || !topic || !difficulty) {
        // Match found, or Partial search completed
        continue;
      }

      // Match on Topic
      const topicMatches = await redisClient.call(
        'FT.SEARCH',
        POOL_INDEX,
        `@topic:{${topic}} -@userId:(${requestorUserId})`,
        ...searchParams
      );
      const topicMatchFound = await processMatch(
        redisClient,
        requestorParams,
        topicMatches,
        'topic',
        topic,
        difficulty
      );

      if (topicMatchFound) {
        continue;
      }

      // Match on Difficulty
      const difficultyMatches = await redisClient.call(
        'FT.SEARCH',
        POOL_INDEX,
        `@difficulty:${difficulty} -@userId:(${requestorUserId})`,
        ...searchParams
      );
      const hasDifficultyMatch = await processMatch(
        redisClient,
        requestorParams,
        difficultyMatches,
        'difficulty',
        topic,
        difficulty
      );

      if (!hasDifficultyMatch) {
        // To allow cancellation
        sendNotif([requestorSocketPort], MATCHING_EVENT.PENDING);
      }
    }
  }
}

logger.info('Process Healthy');

(function loop() {
  if (stopSignal) {
    return;
  }

  Promise.resolve()
    .then(async () => await match())
    .catch((error) => {
      if (error !== null) {
        const { message, name, cause } = error as Error;
        logger.error(JSON.stringify({ message, name, cause }));
      }
    })
    .then(() => process.nextTick(loop));
})();
