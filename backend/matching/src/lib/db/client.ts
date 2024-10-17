import { createClient } from 'redis';

import { DB_URL } from '@/config';
import { logger } from '@/lib/utils';

class RedisClient {
  client: ReturnType<typeof createClient>;
  constructor() {
    this.client = createClient({
      url: DB_URL,
    }).on('error', (err) => {
      logger.error(`Redis Client error: ${err}`);
    });
  }
}

export const client = new RedisClient().client;
