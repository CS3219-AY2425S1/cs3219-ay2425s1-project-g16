import { client as redisClient } from './client';
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
  error: (message: string) => {
    console.error(`[MatchDB]: Seed Error: ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[MatchDB]: ${message}`);
  },
};

const fmtError = (error: unknown) => {
  const { name, message, stack, cause } = error as Error;
  return JSON.stringify({ name, message, stack, cause });
};

const main = async () => {
  try {
    const isSeeded = await redisClient.hgetall(SEED_KEY);

    if (Object.keys(isSeeded).length > 0) {
      const { timeStamp, value } = isSeeded;

      if (value === 'true') {
        logger.info('Seeded at: ' + new Date(Number.parseInt(timeStamp)).toLocaleString());
        return;
      }
    }
  } catch (error) {
    logger.error('Error occurred checking for seed: ' + fmtError(error));
    return;
  }

  // Set Search Index
  try {
    const options = [
      ['ON', 'HASH'],
      ['PREFIX', '1', MATCH_PREFIX],
    ];
    const schema = [
      ['userId', 'TEXT'],
      ['topic', 'TAG'],
      ['difficulty', 'TAG'],
      ['timestamp', 'NUMERIC', 'SORTABLE'],
    ];
    const res = (await redisClient.call(
      'FT.CREATE',
      POOL_INDEX,
      ...options.flatMap((v) => v),
      'SCHEMA',
      ...schema.flatMap((v) => v)
    )) as string;

    if (res !== 'OK') {
      throw new Error(res);
    }

    logger.info('FT Index created');
  } catch (error) {
    const { message } = error as Error;

    if (message !== 'Index already exists') {
      logger.error('Error occurred creating search index: ' + fmtError(error));
      return;
    }

    logger.warn(`FT Search Index already exists`);
  }

  // Create Stream
  try {
    const res = (await redisClient.xgroup(
      'CREATE',
      STREAM_NAME,
      STREAM_GROUP,
      '$',
      'MKSTREAM'
    )) as string;

    if (res !== 'OK') {
      throw new Error(res);
    }

    logger.info(`Stream '${STREAM_NAME}' created`);
  } catch (error) {
    const { message } = error as Error;

    if (!message.startsWith('BUSYGROUP')) {
      logger.error('Error occurred creating stream: ' + fmtError(error));
      return;
    }

    logger.warn(`Stream ${STREAM_NAME} already exists`);
  }

  // Create Stream Consumer
  try {
    const res = await redisClient.xgroup(
      'CREATECONSUMER',
      STREAM_NAME,
      STREAM_GROUP,
      STREAM_WORKER
    );

    if (res !== 1) {
      throw new Error(res as string);
    }

    logger.info(`Stream Consumer '${STREAM_WORKER}' created`);
  } catch (error) {
    const { message } = error as Error;

    if (message !== '0') {
      logger.error(
        'Error occurred creating stream consumer: Unexpected result from xgroup CREATECONSUMER ' +
          fmtError(error)
      );
      return;
    }

    logger.warn(`Stream Consumer ${STREAM_WORKER} already exists`);
  }

  // Create Stream Cleaner
  try {
    const res = await redisClient.xgroup(
      'CREATECONSUMER',
      STREAM_NAME,
      STREAM_GROUP,
      STREAM_CLEANER
    );

    if (res !== 1) {
      throw new Error(res as string);
    }

    logger.info(`Stream Consumer '${STREAM_CLEANER}' created`);
  } catch (error) {
    const { message } = error as Error;

    if (message !== '0') {
      logger.error(
        'Error occurred creating stream consumer: Unexpected result from xgroup CREATECONSUMER ' +
          fmtError(error)
      );
      return;
    }

    logger.warn(`Stream Consumer ${STREAM_CLEANER} already exists`);
  }

  // Set Seed Flag
  try {
    const res = await redisClient.hset(SEED_KEY, { value: 'true', timeStamp: Date.now() });

    if (res !== 2) {
      throw new Error(`${res}`);
    }
  } catch (error) {
    const { message } = error as Error;

    if (message !== '0') {
      logger.error('Error: Unexpected result setting seed flag from hset: ' + fmtError(error));
      return;
    }

    logger.warn(`Seed key already exists`);
  }

  logger.info('Seeded!');
};

void main().then(() => {
  process.exit(0);
});
