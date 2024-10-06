import { eq, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { db, users } from '@/lib/db';
import {
  IUsernameValidResponse,
  IUsernameValidPayload,
  IEmailValidPayload,
  IEmailValidResponse,
} from './types';

export const checkUsernameValidService = async (
  payload: IUsernameValidPayload
): Promise<IUsernameValidResponse> => {
  const { username } = payload;

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.username, username));

    const isValid = result[0].count === 0;

    return {
      code: StatusCodes.OK,
      data: {
        valid: isValid,
      },
    };
  } catch (error) {
    console.error('Error checking username availability:', error);
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: {
        message: 'An error occurred while checking username availability',
      },
    };
  }
};

export const checkEmailValidService = async (
  payload: IEmailValidPayload
): Promise<IEmailValidResponse> => {
  const { email } = payload;

  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.email, email));

    const isValid = result[0].count === 0;

    return {
      code: StatusCodes.OK,
      data: {
        valid: isValid,
      },
    };
  } catch (error) {
    console.error('Error checking email availability:', error);
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: {
        message: 'An error occurred while checking email availability',
      },
    };
  }
};
