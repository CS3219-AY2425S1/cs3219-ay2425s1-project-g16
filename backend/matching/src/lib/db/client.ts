// import { createClient } from 'redis';
import Redis from 'ioredis';

import { DB_HOSTNAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from '@/config';
import { logger } from '@/lib/utils';

class RedisClient {
  client: Redis;
  constructor() {
    this.client = new Redis({
      host: DB_HOSTNAME,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
    })
      .on('connect', () => {
        logger.info('Redis Client Connected');
      })
      .on('error', ({ name, message, stack, cause }) => {
        logger.error(`Redis Client error: ${JSON.stringify({ name, message, stack, cause })}`);
      });
  }
}

export const client = new RedisClient().client;
