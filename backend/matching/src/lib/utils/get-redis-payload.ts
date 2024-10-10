import type { IPoolTicket } from '@/types';

export const getRedisPayload = (payload: Omit<IPoolTicket, 'timestamp'>) => {
  const { topic, difficulty, ...rest } = payload;
  // eslint-disable-next-line  @typescript-eslint/no-empty-object-type
  const difficultyField: { difficulty: string } | {} = difficulty ? { difficulty } : {};
  // eslint-disable-next-line  @typescript-eslint/no-empty-object-type
  const topicField: { topic: string } | {} = payload.topic
    ? Array.isArray(topic)
      ? { topic: topic.join(',') }
      : { topic }
    : {};
  const timestamp = `${Date.now()}`;
  return { ...rest, ...topicField, ...difficultyField, timestamp };
};
