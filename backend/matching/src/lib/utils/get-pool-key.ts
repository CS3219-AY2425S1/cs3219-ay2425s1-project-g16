import { MATCH_PREFIX } from '@/lib/db/constants';

export const getPoolKey = (userId: string) => {
  return `${MATCH_PREFIX}${userId}`;
};
