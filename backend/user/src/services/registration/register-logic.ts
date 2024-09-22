import { or, eq, getTableColumns } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db, users } from '@/lib/db';
import type { IRegisterPayload } from './register-inputs';

const _JWT_SECRET_KEY = 'secret';

const _getSchema = () => {
  const { id, email, username, firstName, lastName, password } = getTableColumns(users);
  return {
    id,
    email,
    username,
    firstName,
    lastName,
    password,
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
  const hashedPassword = bcrypt.hashSync(password, 10); // Use bcrypt to hash the password

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

  // generate JWT token for the new user
  const jwtToken = jwt.sign({ id: newUser.id }, _JWT_SECRET_KEY);

  // return success response with the JWT token
  return {
    code: StatusCodes.CREATED,
    data: {
      cookie: jwtToken,
      user: newUser,
    },
  };
};