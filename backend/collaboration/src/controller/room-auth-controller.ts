import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '@/lib/utils';
import { roomAuthService } from '@/service/get/room-auth-service';

type QueryParams = {
  roomId: string;
  userId: string;
};

// Returns the questionId if valid.
export async function authCheck(
  req: Request<unknown, unknown, unknown, Partial<QueryParams>>,
  res: Response
) {
  const { roomId, userId } = req.query;

  if (!roomId || !userId) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed request');
  }

  try {
    const response = await roomAuthService({
      roomId,
      userId,
    });

    if (response.data) {
      return res.status(response.code).json(response.data);
    }

    return res
      .status(response.code)
      .json({ error: response.error || { message: 'An error occurred.' } });
  } catch (error) {
    const { name, stack, cause, message } = error as Error;
    logger.error('Error authenticating room: ' + JSON.stringify({ name, stack, message, cause }));
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: 'An error occurred while authenticating the room' },
    });
  }
}
