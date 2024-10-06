import { JWT_SECRET_KEY } from '@/config';
import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'peerprep-user-session';

export const generateCookie = <T extends object>(payload: T) => {
  return jwt.sign(payload, JWT_SECRET_KEY, {
    expiresIn: '30m',
  });
};

export const isCookieValid = (cookie: string) => {
  try {
    return jwt.verify(cookie, JWT_SECRET_KEY, {
      ignoreExpiration: false,
    });
  } catch (error) {
    return false;
  }
};

export type CookiePayload = {
  id: string;
};

type CookieType<T> = T & {
  iat: number;
  exp: number;
};

export const decodeCookie = (cookie: string) => {
  const decoded = jwt.decode(cookie) as CookieType<CookiePayload>;

  return decoded;
};

// TODO: Insert proper cookie validity logic and middleware
export const isAuthed = <T extends object>(cookie: string, payload: T) => {
  if (!isCookieValid(cookie) || decodeCookie(cookie) !== payload) {
    return false;
  }
  return true;
};
