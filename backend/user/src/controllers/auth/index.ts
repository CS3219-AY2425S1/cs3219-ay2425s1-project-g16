import { StatusCodes } from 'http-status-codes';

import { COOKIE_NAME } from '@/lib/cookies';
import {
  loginService,
  registerService,
  checkEmailValidService,
  checkUsernameValidService,
  type IEmailValidPayload,
  type IUsernameValidPayload,
  type ILoginPayload,
  type IRegisterPayload,
} from '@/services/auth';
import type { IRouteHandler } from '@/types';

export const login: IRouteHandler = async (req, res) => {
  const { username, password }: Partial<ILoginPayload> = req.body;
  if (!username || !password) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }
  const { code, data, error } = await loginService({ username, password });
  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }
  return res
    .status(StatusCodes.OK)
    .cookie(COOKIE_NAME, data.cookie, {
      httpOnly: true,
      secure: false, // For HTTPS: Set true
      sameSite: 'lax',
      path: '/',
    })
    .json(data.user);
};

export const logout: IRouteHandler = async (_req, res) => {
  return res
    .clearCookie(COOKIE_NAME, {
      secure: true,
      sameSite: 'none',
    })
    .status(StatusCodes.OK)
    .json('User has been logged out.');
};

export const register: IRouteHandler = async (req, res) => {
  //Extract the registration data from the request body
  const { email, username, password, firstName, lastName }: Partial<IRegisterPayload> = req.body;

  //Validate input
  if (!username || !password || !email || !firstName || !lastName) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  //Call the registration service
  const { code, data, error } = await registerService({
    email,
    username,
    firstName,
    lastName,
    password,
  });

  //Handle errors
  if (error || code !== StatusCodes.CREATED || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred during registration.';
    return res.status(code).json(sanitizedErr);
  }

  return res.status(StatusCodes.CREATED).json({
    message: 'User registered successfully',
    user: data.user, // Return user data if needed
  });
};

export const checkUsernameValid: IRouteHandler = async (req, res) => {
  const { username }: IUsernameValidPayload = req.body;
  if (!username) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }
  const { code, data, error } = await checkUsernameValidService({ username });
  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }
  return res.status(StatusCodes.OK).json(data);
};

export const checkEmailValid: IRouteHandler = async (req, res) => {
  const { email }: IEmailValidPayload = req.body;
  if (!email) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }
  const { code, data, error } = await checkEmailValidService({ email });
  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }
  return res.status(StatusCodes.OK).json(data);
};
