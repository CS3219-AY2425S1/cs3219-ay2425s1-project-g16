import { and, desc, eq, or } from 'drizzle-orm';

import { db, questionAttempts as QUESTION_ATTEMPTS_TABLE } from '@/lib/db';

type Params = {
  questionId: number;
  userId: string;
  limit?: number;
  offset?: number;
};

export const getQuestionAttempts = async ({ questionId, userId, limit = 10, offset }: Params) => {
  if (limit < 1) {
    limit = 1;
  }

  const userIdFilters = [
    eq(QUESTION_ATTEMPTS_TABLE.userId1, userId),
    eq(QUESTION_ATTEMPTS_TABLE.userId2, userId),
  ];
  const filterClauses = [eq(QUESTION_ATTEMPTS_TABLE.questionId, questionId), or(...userIdFilters)];
  return await db
    .select()
    .from(QUESTION_ATTEMPTS_TABLE)
    .where(and(...filterClauses))
    .orderBy(desc(QUESTION_ATTEMPTS_TABLE.timestamp))
    .offset(offset ?? 0)
    .limit(limit);
};
