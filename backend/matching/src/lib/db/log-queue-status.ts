import { IS_MILESTONE_D4 } from '@/config';

import { client } from './client';
import { STREAM_NAME } from './constants';

export const getQueueStatusLog = async (redisClient: typeof client) => {
  const queueStatus = await redisClient.xrange(STREAM_NAME, '-', '+');
  const messages = queueStatus.map(([id, fields]) => {
    const record: Record<string, unknown> = { id };

    for (let i = 0; i < fields.length; i = i + 2) {
      record[fields[i]] = fields[i + 1];
    }

    return record;
  });
  return JSON.stringify(messages);
};

export const logQueueStatus = async (
  // eslint-disable-next-line
  logger: { info: (...m: any[]) => void },
  redisClient: typeof client,
  message: string
) => {
  if (!IS_MILESTONE_D4) {
    return;
  }

  const queueStatusLog = await getQueueStatusLog(redisClient);
  logger.info(message.replace('<PLACEHOLDER>', queueStatusLog));
};
