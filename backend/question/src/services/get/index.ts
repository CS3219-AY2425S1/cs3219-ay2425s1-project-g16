import { and, arrayOverlaps, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { db } from '@/lib/db/index';
import { questionAttempts, questions } from '@/lib/db/schema';

import type {
  IGetDifficultiesResponse,
  IGetQuestionPayload,
  IGetQuestionResponse,
  IGetQuestionsPayload,
  IGetQuestionsResponse,
  IGetTopicsResponse,
} from './types';

export const getQuestionsService = async (
  payload: IGetQuestionsPayload
): Promise<IGetQuestionsResponse> => {
  const { questionName, difficulty, topic, pageNum = 0, recordsPerPage = 20, userId } = payload;
  const offset = pageNum * recordsPerPage;

  const whereClause = [];

  if (questionName) {
    whereClause.push(ilike(questions.title, `%${questionName}%`));
  }

  if (difficulty) {
    whereClause.push(eq(questions.difficulty, difficulty));
  }

  if (topic && topic.length > 0) {
    whereClause.push(arrayOverlaps(questions.topic, topic));
  }

  const query = db
    .select({
      ...getTableColumns(questions),
      attempted: sql`COALESCE(COUNT(${questionAttempts.attemptId}), 0)`.as('attempted'),
    })
    .from(questions)
    .leftJoin(
      questionAttempts,
      and(
        eq(questionAttempts.questionId, questions.id),
        or(eq(questionAttempts.userId1, userId), eq(questionAttempts.userId2, userId))
      )
    )
    .where(and(...whereClause))
    .groupBy(questions.id)
    .limit(recordsPerPage)
    .offset(offset)
    .orderBy(questions.id);

  const [results, totalCount] = await Promise.all([
    query,
    db
      .select({ count: questions.id })
      .from(questions)
      .where(and(...whereClause))
      .then((res) => res.length),
  ]);

  return {
    code: StatusCodes.OK,
    data: {
      questions: results.map((q) => ({
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        topic: q.topic,
        attempted: (q.attempted as number) > 0,
      })),
      totalQuestions: totalCount,
    },
  };
};

export const getQuestionDetailsService = async (
  payload: IGetQuestionPayload
): Promise<IGetQuestionResponse> => {
  const { questionId } = payload;

  const result = await db
    .select()
    .from(questions)
    .where(sql`${questions.id} = ${questionId}`)
    .limit(1);

  if (result.length === 0) {
    return {
      code: StatusCodes.NOT_FOUND,
      data: { question: null },
      error: {
        message: 'Question not found',
      },
    };
  }

  return {
    code: StatusCodes.OK,
    data: { question: result[0] },
  };
};

export const searchQuestionsByTitleService = async (
  title: string,
  page: number,
  limit: number
): Promise<IGetQuestionsResponse> => {
  const searchPattern = `%${title}%`;
  const effectivePage = page ?? 1;
  const effectiveLimit = limit ?? 10;
  const offset = (effectivePage - 1) * effectiveLimit;

  // Query the database for questions matching the title
  const results = await db
    .select({
      id: questions.id,
      title: questions.title,
      difficulty: questions.difficulty,
      topic: questions.topic,
    })
    .from(questions)
    .where(sql`${questions.title} ILIKE ${searchPattern}`) // Use ILIKE for case-insensitive matching
    .limit(effectiveLimit)
    .offset(offset);

  // Return the results as per IGetQuestionsResponse format
  return {
    code: StatusCodes.OK,
    data: {
      questions: results, // Directly returning the query results
      totalQuestions: results.length, // Count of questions returned
    },
  };
};

export const getTopicsService = async (): Promise<IGetTopicsResponse> => {
  const results = await db
    .select({
      topic: questions.topic,
    })
    .from(questions);

  // If no questions are found, return a NOT_FOUND response
  if (results.length === 0) {
    return {
      code: StatusCodes.NOT_FOUND,
      data: { topics: [] },
      error: {
        message: 'No topics found',
      },
    };
  }

  const allTopics = results.flatMap((result) => result.topic);
  const uniqueTopics = Array.from(new Set(allTopics));

  return {
    code: StatusCodes.OK,
    data: {
      topics: uniqueTopics,
    },
  };
};

export const getDifficultiesService = async (): Promise<IGetDifficultiesResponse> => {
  const results = await db.selectDistinct({ difficulty: questions.difficulty }).from(questions);

  // If no difficulties are found, return a NOT_FOUND response
  if (results.length === 0) {
    return {
      code: StatusCodes.NOT_FOUND,
      data: { difficulties: [] },
      error: {
        message: 'No difficulties found',
      },
    };
  }

  const uniqueDifficulties = results
    .map((result) => result.difficulty)
    .sort((a, b) => {
      if (a === 'Hard' || b === 'Easy') return 1;
      if (b === 'Hard' || a === 'Easy') return -1;
      return 0;
    });
  return {
    code: StatusCodes.OK,
    data: {
      difficulties: uniqueDifficulties,
    },
  };
};
