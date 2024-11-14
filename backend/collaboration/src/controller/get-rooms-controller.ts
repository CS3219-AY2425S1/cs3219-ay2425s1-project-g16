import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getRoomsService } from '@/service/get/rooms-get-service';

type QueryParams = {
  userId: string;
  offset?: number;
  limit?: number;
};

export async function getRoomsController(
  req: Request<unknown, unknown, unknown, Partial<QueryParams>>,
  res: Response
) {
  const { userId, ...rest } = req.query;

  if (!userId) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  const response = await getRoomsService({ userId, ...rest });

  if (response.data) {
    return res.status(response.code).json(response.data);
  }

  return res
    .status(response.code)
    .json({ error: response.error || { message: 'An error occurred' } });
}
