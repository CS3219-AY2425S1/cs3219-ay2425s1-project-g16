import { client as redisClient, logQueueStatus } from '@/lib/db';
import { STREAM_CLEANER, STREAM_GROUP, STREAM_NAME } from '@/lib/db/constants';
import { decodeStreamTicket, getPoolKey } from '@/lib/utils';
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

async function clean() {
  const response = await redisClient.xautoclaim(
    STREAM_NAME,
    STREAM_GROUP,
    STREAM_CLEANER,
    30000,
    '0-0'
  );

  // [startId, [id, [...items]][], []]
  if (
    !response || // Invalid shape
    !Array.isArray(response) || // Invalid shape
    response.length < 3 || // Invalid shape
    !Array.isArray(response[1]) || // Invalid shape
    response[1].length === 0 // No messages to autoclaim
  ) {
    await new Promise((resolve, _reject) => {
      timeout = setTimeout(() => resolve('Next Loop'), sleepTime);
    });
    return;
  }

  const [_startId, messages, ..._rest] = response;

  // ACK, Delete
  // [ID, [..doc]]
  for (const message of messages) {
    if (
      !message ||
      !Array.isArray(message) ||
      message.length < 2 ||
      !message[1] ||
      !Array.isArray(message[1])
    ) {
      continue;
    }

    const [id, ...doc] = message;
    logger.info(`Expiring ${JSON.stringify(message)}`);
    const { userId, socketPort: socketRoom } = decodeStreamTicket(id, doc);
    const POOL_KEY = getPoolKey(userId);
    await Promise.all([
      // Delete from pool
      redisClient.del(POOL_KEY),
      // ACK
      redisClient.xdel(STREAM_NAME, id),
    ]);

    if (socketRoom) {
      // Notify client
      sendNotif([socketRoom], MATCHING_EVENT.FAILED);
      sendNotif([socketRoom], MATCHING_EVENT.DISCONNECT);
    }

    await logQueueStatus(logger, redisClient, `Queue Status after Expiring Request: <PLACEHOLDER>`);
  }
}

logger.info('Process Healthy');

(function loop() {
  if (stopSignal) {
    return;
  }

  Promise.resolve()
    .then(async () => await clean())
    .catch((err) => {
      if (err !== null) {
        const { message, name, cause, stack } = err as Error;
        logger.error(JSON.stringify({ message, name, cause, stack }));
      }
    })
    .then(() => process.nextTick(loop));
})();
