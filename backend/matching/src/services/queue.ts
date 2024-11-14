import { STREAM_NAME } from '@/lib/db/constants';
import { getPoolKey, getRedisPayload } from '@/lib/utils';
import type { IQueueRequest, IRedisClient } from '@/types';

export const queueingService = async (client: IRedisClient, payload: IQueueRequest) => {
  const formattedPayload = getRedisPayload(payload);
  // Add to queue
  await client.xAdd(STREAM_NAME, formattedPayload.timestamp, formattedPayload);
  // Add to matching pool
  await client.hSet(getPoolKey(payload.userId), formattedPayload);
};
