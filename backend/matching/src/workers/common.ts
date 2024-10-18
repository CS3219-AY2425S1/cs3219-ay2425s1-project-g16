// CHILD PROCESS UTIL LIB

import { client } from '@/lib/db';
import { logger } from '@/lib/utils';
import type { IChildProcessMessage, IMatchEvent } from '@/ws';

export const sendNotif = (roomIds: Array<string>, event: IMatchEvent, message?: unknown) => {
  if (process.send) {
    const payload: IChildProcessMessage = {
      rooms: roomIds,
      event,
      message,
    };
    process.send(payload);
  }
};

export const connectClient = async (importedClient: typeof client) => {
  let redisClient: typeof client;

  try {
    redisClient =
      importedClient.isOpen || importedClient.isReady
        ? importedClient
        : await importedClient.connect();
  } catch (error) {
    const { name, message, cause, stack } = error as Error;
    logger.error(
      `An error occurred in connecting: ${JSON.stringify({ name, message, cause, stack })}`
    );
    process.exit(1);
  }

  return redisClient;
};
