import { client } from '@/lib/db';
import { STREAM_CLEANER, STREAM_GROUP, STREAM_NAME } from '@/lib/db/constants';
import { decodePoolTicket, getPoolKey } from '@/lib/utils';
import { io } from '@/server';

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

async function clean() {
  const redisClient = client.isReady || client.isOpen ? client : await client.connect();
  const response = await redisClient.xAutoClaim(
    STREAM_NAME,
    STREAM_GROUP,
    STREAM_CLEANER,
    30000,
    '0-0'
  );

  if (!response || response.messages.length === 0) {
    await new Promise((resolve, _reject) => {
      timeout = setTimeout(() => resolve('Next Loop'), sleepTime);
    });
    return;
  }
  // ACK, Delete
  for (const message of response.messages) {
    if (!message) {
      continue;
    }
    logger.info(`Expiring ${JSON.stringify(message)}`);
    const { userId, socketPort: socketRoom } = decodePoolTicket(message);
    const POOL_KEY = getPoolKey(userId);
    await Promise.all([
      // Delete from pool
      redisClient.del(POOL_KEY),
      // ACK
      redisClient.xDel(STREAM_NAME, message.id),
    ]);

    if (socketRoom) {
      // Notify client
      io.sockets.in(socketRoom).emit('FAILED');
      io.sockets.in(socketRoom).disconnectSockets();
    }
  }
}

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
