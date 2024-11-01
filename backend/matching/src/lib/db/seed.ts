import { SchemaFieldTypes } from 'redis';

import { client } from './client';
import {
  MATCH_PREFIX,
  POOL_INDEX,
  SEED_KEY,
  STREAM_CLEANER,
  STREAM_GROUP,
  STREAM_NAME,
  STREAM_WORKER,
} from './constants';

const logger = {
  info: (message: string) => {
    console.log(`[MatchDB]: ${message}`);
  },
};

const main = async () => {
  const redisClient = await client.connect();

  if (!redisClient) {
    return;
  }

  const isSeeded = await redisClient.hGetAll(SEED_KEY);

  if (Object.keys(isSeeded).length > 0) {
    const { timeStamp, value } = isSeeded;

    if (value === 'true') {
      logger.info('Seeded at: ' + new Date(Number.parseInt(timeStamp)).toLocaleString());
      return;
    }
  }

  // Set Search Index
  await redisClient.ft.create(
    POOL_INDEX,
    {
      userId: {
        type: SchemaFieldTypes.TEXT,
      },
      topic: {
        type: SchemaFieldTypes.TAG,
      },
      difficulty: {
        type: SchemaFieldTypes.TAG,
      },
      pending: {
        type: SchemaFieldTypes.TEXT,
      },
      timestamp: {
        type: SchemaFieldTypes.NUMERIC,
        SORTABLE: true,
      },
    },
    {
      ON: 'HASH',
      PREFIX: MATCH_PREFIX,
    }
  );

  // Create Stream
  await redisClient.xGroupCreate(STREAM_NAME, STREAM_GROUP, '$', { MKSTREAM: true });
  await redisClient.xGroupCreateConsumer(STREAM_NAME, STREAM_GROUP, STREAM_WORKER);
  await redisClient.xGroupCreateConsumer(STREAM_NAME, STREAM_GROUP, STREAM_CLEANER);

  // Set seeded
  await redisClient.hSet(SEED_KEY, {
    value: 'true',
    timeStamp: Date.now(),
  });
  logger.info('Seeded!');
};

void main().then(() => {
  process.exit(0);
});
