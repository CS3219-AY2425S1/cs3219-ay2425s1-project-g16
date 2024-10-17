import { StatusCodes } from 'http-status-codes';

import { COOKIE_NAME, decodeCookie, isCookieValid } from '@/lib/cookies';
import { IRouteHandler } from '@/types';
import { logger } from '@/lib/utils';

export const checkIsAuthed: IRouteHandler = async (req, res) => {
  const cookie: string | undefined = req.cookies[COOKIE_NAME];
  if (cookie && isCookieValid(cookie)) {
    const decoded = decodeCookie(cookie);
    const expireTimeInMillis = decoded.exp * 1000;
    logger.info(
      '[/auth-check/check-is-authed]: Expires At ' + new Date(expireTimeInMillis).toLocaleString()
    );
    return res.status(StatusCodes.OK).json({
      message: 'OK',
      expiresAt: expireTimeInMillis,
    });
  }
  return res.status(StatusCodes.UNAUTHORIZED).json('Unauthorised');
};
