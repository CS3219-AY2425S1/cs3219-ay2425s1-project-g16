import { eq, getTableColumns, or } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { db, users } from '@/lib/db';
import { generatePasswordHash } from '@/lib/passwords';

import type { IRegisterPayload } from './types';

const _getSchema = () => {
  const { id, email, username, firstName, lastName } = getTableColumns(users);
  return {
    id,
    email,
    username,
    firstName,
    lastName,
  };
};

export const registerService = async (payload: IRegisterPayload) => {
  const { email, username, firstName, lastName, password } = payload;

  //check if user already exists (by username or email)
  const existingUsers = await db
    .select(_getSchema())
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (existingUsers.length > 0) {
    return {
      code: StatusCodes.CONFLICT,
      error: {
        message: 'User with this username or email already exists',
      },
    };
  }

  //hash the password
  const hashedPassword = generatePasswordHash(password);

  //insert new user into the database
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword, //store the hashed password
    })
    .returning(_getSchema());

  // return success response with the JWT token
  return {
    code: StatusCodes.CREATED,
    data: {
      user: newUser,
    },
  };
};
