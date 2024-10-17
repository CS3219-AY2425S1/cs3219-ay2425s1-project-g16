import { eq, getTableColumns, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { db, users } from '@/lib/db';
import type { ILoginPayload, ILoginResponse } from './types';
import { CookiePayload, generateCookie } from '@/lib/cookies';
import { getIsPasswordValid } from '@/lib/passwords';

const _FAILED_ATTEMPTS_ALLOWED = 3;
const _getSchema = () => {
  const { id, username, password, email, failedAttempts, unlockTime } = getTableColumns(users);
  return {
    id,
    username,
    password,
    email,
    failedAttempts,
    unlockTime,
  };
};
export const loginService = async (payload: ILoginPayload): Promise<ILoginResponse> => {
  const rows = await db
    .select(_getSchema())
    .from(users)
    .where(eq(users.username, payload.username))
    .limit(1);

  // 1. Cannot find
  if (rows.length === 0) {
    return {
      code: StatusCodes.NOT_FOUND,
      error: {
        message: 'Not Found',
      },
    };
  }
  const { unlockTime, password, failedAttempts, ...user } = rows[0];

  // 2. Locked out
  if (unlockTime !== null) {
    const currentTime = new Date();
    if (unlockTime > currentTime) {
      return {
        code: StatusCodes.CONFLICT,
        error: {
          message: 'Too many failed attempts - try again later',
        },
      };
    }
  }

  // 3. Wrong Password
  const isPasswordValid = getIsPasswordValid(payload.password, password);
  if (!isPasswordValid) {
    const newFailedAttempts = (failedAttempts ?? 0) + 1;
    const updateValues = {
      failedAttempts: newFailedAttempts,
      unlockTime:
        newFailedAttempts >= _FAILED_ATTEMPTS_ALLOWED ? sql`NOW() + INTERVAL '1 hour'` : undefined,
    };
    await db.update(users).set(updateValues).where(eq(users.username, payload.username));
    return {
      code: StatusCodes.UNAUTHORIZED,
      error: {
        message: 'Incorrect Password',
      },
    };
  }

  // 4. Correct Password
  if ((failedAttempts !== null && failedAttempts > 0) || unlockTime !== null) {
    await db.update(users).set({
      failedAttempts: null,
      unlockTime: null,
    });
  }
  const jwtToken = generateCookie<CookiePayload>({ id: user.id });
  return {
    code: StatusCodes.OK,
    data: {
      cookie: jwtToken,
      user,
    },
  };
};
