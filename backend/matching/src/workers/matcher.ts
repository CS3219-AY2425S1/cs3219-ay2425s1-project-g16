import { client } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
import { decodePoolTicket, getPoolKey, getStreamId } from '@/lib/utils';
import { io } from '@/server';
import { getMatchItems } from '@/services';

const logger = {
  info: (message: unknown) => process.send && process.send(message),
  error: (message: unknown) => process.send && process.send(message),
};

const sleepTime = 5000;
let stopSignal = false;
let timeout: ReturnType<typeof setTimeout>;
const cancel = () => {
  stopSignal = true;
  clearTimeout(timeout);
};
const shutdown = () => {
  cancel();
  client
    .disconnect()
    .then(() => client.quit())
    .then(process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

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
    const matched = matches.documents[0];
    const {
      userId: matchedUserId,
      timestamp, // We use timestamp as the Stream ID
      socketPort: matchedSocketPort,
    } = decodePoolTicket(matched);

    // To block cancellation
    io.sockets.in([matchedSocketPort]).emit('Matching');

    const matchedStreamId = getStreamId(timestamp);

    logger.info(`Found match: ${JSON.stringify(matched)}`);

    await Promise.all([
      // Remove other from pool
      redisClient.del([getPoolKey(requestorUserId), getPoolKey(matchedUserId)]),
      // Remove other from queue
      redisClient.xDel(STREAM_NAME, [requestorStreamId, matchedStreamId]),
    ]);

    // Notify both sockets
    const { ...matchItems } = getMatchItems();
    io.sockets.in([requestorSocketPort, matchedSocketPort]).emit(JSON.stringify(matchItems));
    return true;
  }

  logger.info(`Found no matches` + (searchIdentifier ? ` for ${searchIdentifier}` : ''));
  return false;
}

async function match() {
  const redisClient = client.isReady || client.isOpen ? client : await client.connect();
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
      io.sockets.in([requestorSocketPort]).emit('Matching');

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
        io.sockets.in(requestorSocketPort).emit('Waiting');
      }
    }
  }
}

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
