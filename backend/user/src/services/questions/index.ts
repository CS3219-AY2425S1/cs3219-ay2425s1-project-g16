import { eq, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

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
  userIds: string[],
  questionId: number
): Promise<IAddAttemptedQuestionResponse> => {
  try {
    // Check if the users exist
    const userRecords = await db
      .select({ id: users.id, attemptedQuestions: users.attemptedQuestions })
      .from(users)
      .where(sql`${users.id} = ANY(${userIds})`);

    if (userRecords.length === 0) {
      return {
        code: StatusCodes.NOT_FOUND,
        error: new Error('No users found'),
      };
    }

    // Update attemptedQuestions for each user
    const updatePromises = userRecords.map((user) => {
      const attemptedQuestions = user.attemptedQuestions || [];

      if (!attemptedQuestions.includes(questionId)) {
        return db
          .update(users)
          .set({
            attemptedQuestions: sql`array_append(${users.attemptedQuestions}, ${questionId})`,
          })
          .where(eq(users.id, user.id));
      }

      return Promise.resolve(); // No update needed if question already attempted
    });

    await Promise.all(updatePromises);

    return {
      code: StatusCodes.OK,
      data: { message: 'Question added to attempted questions for applicable users' },
    };
  } catch (error) {
    console.error('Error adding attempted question:', error);
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: new Error('An error occurred while adding the attempted question'),
    };
  }
};

export const getAttemptedQuestionsService = async (
  userId: string
): Promise<IGetAttemptedQuestionsResponse> => {
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
