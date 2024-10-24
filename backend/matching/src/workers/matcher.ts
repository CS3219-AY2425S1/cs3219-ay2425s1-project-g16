import { WORKER_SLEEP_TIME_IN_MILLIS } from '@/config';
import { client, logQueueStatus } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
import { decodePoolTicket, getPoolKey, getStreamId } from '@/lib/utils';
import { getMatchItems } from '@/services';
import { IMatchType } from '@/types';
import { MATCHING_EVENT } from '@/ws/events';

import { connectClient, sendNotif } from './common';

const logger = {
  info: (message: unknown) => process.send && process.send(message),
  error: (message: unknown) => process.send && process.send(message),
};

let stopSignal = false;
let timeout: ReturnType<typeof setTimeout>;

const cancel = () => {
  stopSignal = true;
  clearTimeout(timeout);
};

const shutdown = () => {
  cancel();
  client.disconnect().then(() => {
    process.exit(0);
  });
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
  redisClient: typeof client,
  { requestorUserId, requestorStreamId, requestorSocketPort }: RequestorParams,
  matches: Awaited<ReturnType<(typeof client)['ft']['search']>>,
  searchIdentifier?: IMatchType,
  topic?: string,
  difficulty?: string
) {
  if (matches.total > 0) {
    for (const matched of matches.documents) {
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
      await redisClient.hSet(getPoolKey(matchedUserId), 'pending', 'false');

      const matchedStreamId = getStreamId(timestamp);
      logger.info(`Found match: ${JSON.stringify(matched)}`);

      await Promise.all([
        // Remove other from pool
        redisClient.del([getPoolKey(requestorUserId), getPoolKey(matchedUserId)]),
        // Remove other from queue
        redisClient.xDel(STREAM_NAME, [requestorStreamId, matchedStreamId]),
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
  const redisClient = await connectClient(client);

  const stream = await redisClient.xReadGroup(
    STREAM_GROUP,
    STREAM_WORKER,
    {
      key: STREAM_NAME,
      id: '>',
    },
    {
      COUNT: 1,
      BLOCK: 2000,
    }
  );

  if (!stream || stream.length === 0) {
    await new Promise((resolve, _reject) => {
      timeout = setTimeout(() => resolve('Next Loop'), WORKER_SLEEP_TIME_IN_MILLIS);
    });
    return;
  }

  for (const group of stream) {
    // Perform matching
    for (const matchRequest of group.messages) {
      logger.info(`Received request: ${JSON.stringify(matchRequest)}`);
      // Query the pool
      const {
        id: requestorStreamId,
        userId: requestorUserId,
        socketPort: requestorSocketPort,
        difficulty,
        topic,
      } = decodePoolTicket(matchRequest);

      // To Block Cancellation
      sendNotif([requestorSocketPort], MATCHING_EVENT.MATCHING);
      await redisClient.hSet(getPoolKey(requestorUserId), 'pending', 'false');

      const clause = [`-@userId:(${requestorUserId}) @pending:(true)`];

      if (difficulty) {
        clause.push(`@difficulty:{${difficulty}}`);
      }

      if (topic) {
        clause.push(`@topic:{${topic}}`);
      }

      const searchParams = {
        LIMIT: { from: 0, size: 1 },
        SORTBY: { BY: 'timestamp', DIRECTION: 'ASC' },
      } as const;
      const requestorParams = { requestorUserId, requestorStreamId, requestorSocketPort };

      const exactMatches = await redisClient.ft.search(POOL_INDEX, clause.join(' '), searchParams);
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
      const topicMatches = await redisClient.ft.search(
        POOL_INDEX,
        clause.filter((v) => !v.startsWith('@difficulty')).join(' '),
        searchParams
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
      const difficultyMatches = await redisClient.ft.search(
        POOL_INDEX,
        clause.filter((v) => !v.startsWith('@topic')).join(' '),
        searchParams
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
        await redisClient.hSet(getPoolKey(requestorUserId), 'pending', 'true');
        sendNotif([requestorSocketPort], MATCHING_EVENT.PENDING);
        logger.info(`${requestorUserId} is now in mode ${MATCHING_EVENT.PENDING}`);
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
