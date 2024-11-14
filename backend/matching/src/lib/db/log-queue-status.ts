import { IS_MILESTONE_D4 } from '@/config';

import { client } from './client';
import { STREAM_NAME } from './constants';

export const getQueueStatusLog = async (redisClient: typeof client) => {
  const queueStatus = await redisClient.xRange(STREAM_NAME, '-', '+');
  const messages = queueStatus
    .map((v) => v.message)
    .map(({ userId, topic, difficulty }) => ({ userId, topic, difficulty }));
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
