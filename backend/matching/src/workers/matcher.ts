import { client, logQueueStatus } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
import { decodePoolTicket, getPoolKey, getStreamId } from '@/lib/utils';
import { getMatchItems } from '@/services';
import { MATCH_SVC_EVENT } from '@/ws';

import { connectClient, sendNotif } from './common';

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
  searchIdentifier?: string
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
      sendNotif([matchedSocketPort], MATCH_SVC_EVENT.MATCHING);

      const matchedStreamId = getStreamId(timestamp);

      logger.info(`Found match: ${JSON.stringify(matched)}`);

      await Promise.all([
        // Remove other from pool
        redisClient.del([getPoolKey(requestorUserId), getPoolKey(matchedUserId)]),
        // Remove other from queue
        redisClient.xDel(STREAM_NAME, [requestorStreamId, matchedStreamId]),
      ]);

      // Notify both sockets
      const { ...matchItems } = getMatchItems({ userId1: requestorUserId, userId2: matchedUserId });

      const sendMatchLogic = (socketPort: string) => {
        sendNotif([socketPort], MATCH_SVC_EVENT.SUCCESS, matchItems);
        sendNotif([socketPort], MATCH_SVC_EVENT.DISCONNECT);
      };

      // TODO: If client disconnected, stop sending to requestor
      sendMatchLogic(matchedSocketPort);
      setTimeout(() => {
        sendMatchLogic(requestorSocketPort);
      }, 1000);
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
      timeout = setTimeout(() => resolve('Next Loop'), sleepTime);
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
      sendNotif([requestorSocketPort], MATCH_SVC_EVENT.MATCHING);

      const clause = [`-@userId:(${requestorUserId})`];

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
        'exact match'
      );

      if (exactMatchFound || !topic || !difficulty) {
        // Match found, or Partial search completed
        continue;
      }

      // Match on Topic
      const topicMatches = await redisClient.ft.search(
        POOL_INDEX,
        `@topic:{${topic}} -@userId:(${requestorUserId})`,
        searchParams
      );
      const topicMatchFound = await processMatch(
        redisClient,
        requestorParams,
        topicMatches,
        'topic'
      );

      if (topicMatchFound) {
        continue;
      }

      // Match on Difficulty
      const difficultyMatches = await redisClient.ft.search(
        POOL_INDEX,
        `@difficulty:${difficulty} -@userId:(${requestorUserId})`,
        searchParams
      );
      const hasDifficultyMatch = await processMatch(
        redisClient,
        requestorParams,
        difficultyMatches,
        'difficulty'
      );

      if (!hasDifficultyMatch) {
        // To allow cancellation
        sendNotif([requestorSocketPort], MATCH_SVC_EVENT.PENDING);
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
