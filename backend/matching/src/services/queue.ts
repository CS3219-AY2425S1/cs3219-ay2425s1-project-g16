import { STREAM_NAME } from '@/lib/db/constants';
import { getPoolKey, getRedisPayload } from '@/lib/utils';
import type { IQueueRequest, IRedisClient } from '@/types';

export const queueingService = async (client: IRedisClient, payload: IQueueRequest) => {
  const formattedPayload = getRedisPayload(payload);
  const { userId, socketPort, topic, difficulty } = formattedPayload;
  const args = ['userId', userId, 'socketPort', socketPort];

  if (topic) {
    args.push('topic', topic);
  }

  if (difficulty) {
    args.push('difficulty', difficulty);
  }

  // Add to queue
  await client.xadd(STREAM_NAME, formattedPayload.timestamp, ...args);
  // Add to matching pool
  await client.hset(getPoolKey(payload.userId), formattedPayload);
};
