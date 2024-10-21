import { createClient } from 'redis';

import { DB_HOSTNAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from '@/config';
import { logger } from '@/lib/utils';

class RedisClient {
  client: ReturnType<typeof createClient>;
  constructor() {
    this.client = createClient({
      username: DB_USERNAME,
      password: DB_PASSWORD,
      socket: {
        host: DB_HOSTNAME,
        port: DB_PORT,
      },
    }).on('error', (err) => {
      logger.error(`Redis Client error: ${err}`);
    });
  }
}

export const client = new RedisClient().client;
