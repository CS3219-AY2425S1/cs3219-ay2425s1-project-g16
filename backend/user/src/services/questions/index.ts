import { StatusCodes } from 'http-status-codes';
import { users } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';

interface IGetAttemptedQuestionsResponse {
  code: StatusCodes;
  data?: number[];
  error?: Error;
}

interface IAddAttemptedQuestionResponse {
    code: StatusCodes;
    data?: { message: string };
    error?: Error;
  }
  
  export const addAttemptedQuestionService = async (
    userId: string, 
    questionId: number
  ): Promise<IAddAttemptedQuestionResponse> => {
    try {
      // First, check if the question is already in the attemptedQuestions array
      const user = await db
        .select({ attemptedQuestions: users.attemptedQuestions })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
  
      if (user.length === 0) {
        return {
          code: StatusCodes.NOT_FOUND,
          error: new Error('User not found'),
        };
      }
  
      const attemptedQuestions = user[0].attemptedQuestions || [];
  
      if (attemptedQuestions.includes(questionId)) {
        return {
          code: StatusCodes.OK,
          data: { message: 'Question already marked as attempted' },
        };
      }
  
      // If the question is not in the array, add it
      const result = await db
        .update(users)
        .set({
          attemptedQuestions: sql`array_append(${users.attemptedQuestions}, ${questionId})`,
        })
        .where(eq(users.id, userId));
  
      if (result.length === 0) {
        return {
          code: StatusCodes.NOT_FOUND,
          error: new Error('Failed to update user'),
        };
      }
  
      return {
        code: StatusCodes.OK,
        data: { message: 'Question added to attempted questions' },
      };
    } catch (error) {
      console.error('Error adding attempted question:', error);
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        error: new Error('An error occurred while adding the attempted question'),
      };
    }
  };

export const getAttemptedQuestionsService = async (userId: string): Promise<IGetAttemptedQuestionsResponse> => {
  try {
    const result = await db
      .select({ attemptedQuestions: users.attemptedQuestions })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (result.length === 0) {
      return {
        code: StatusCodes.NOT_FOUND,
        error: new Error('User not found'),
      };
    }

    return {
      code: StatusCodes.OK,
      data: result[0].attemptedQuestions || [],
    };
  } catch (error) {
    console.error('Error fetching attempted questions:', error);
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: new Error('An error occurred while fetching attempted questions'),
    };
  }
};