import { and, arrayOverlaps, eq, ilike, inArray, not, sql } from 'drizzle-orm';

import { db } from '@/lib/db/index';
import { questions } from '@/lib/db/schema';

import type {
  IGetQuestionsPayload,
  IGetQuestionsResponse,
  IGetQuestionPayload,
  IGetQuestionResponse,
  IGetRandomQuestionPayload,
  IGetRandomQuestionResponse,
} from './types';
import { StatusCodes } from 'http-status-codes';

export const getQuestionsService = async (
  payload: IGetQuestionsPayload
): Promise<IGetQuestionsResponse> => {
  const { questionName, difficulty, topic, pageNum = 0, recordsPerPage = 20 } = payload;
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
    .select()
    .from(questions)
    .where(and(...whereClause))
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

export const getRandomQuestionService = async (
  payload: IGetRandomQuestionPayload
): Promise<IGetRandomQuestionResponse> => {
  const { difficulty, topic, attemptedQuestions } = payload;
  const whereClause = [];

  console.log('Starting query construction');

  if (difficulty) {
    console.log(`Adding difficulty filter: ${difficulty}`);
    whereClause.push(eq(questions.difficulty, difficulty));
  }

  const topicArray = (Array.isArray(topic) ? topic : [topic]).filter(
    (t): t is string => t !== undefined
  );
  if (topicArray.length > 0) {
    whereClause.push(arrayOverlaps(questions.topic, topicArray));
  }

  if (attemptedQuestions && attemptedQuestions.length > 0) {
    console.log(`Excluding attempted questions: ${attemptedQuestions.join(', ')}`);
    whereClause.push(not(inArray(questions.id, attemptedQuestions)));
  }

  console.log(`Where clause conditions: ${whereClause.length}`);

  let query = db.select().from(questions);

  if (whereClause.length > 0) {
    query = query.where(and(...whereClause)) as typeof query;
  }

  query = (query as any).orderBy(sql`RANDOM()`).limit(1);

  console.log('Executing query');
  console.log(query.toSQL()); // This will log the SQL query

  const result = await query;

  console.log(`Query result: ${JSON.stringify(result)}`);

  if (result.length === 0) {
    return {
      code: StatusCodes.NOT_FOUND,
      data: { question: null },
      error: {
        message: 'No matching questions found',
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
