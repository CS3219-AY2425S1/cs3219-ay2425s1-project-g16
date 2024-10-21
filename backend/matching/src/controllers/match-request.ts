import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { createNotifSocket } from '@/services';
import type { IRequestMatchRESTPayload } from '@/types';

export const matchRequestController = async (req: Request, res: Response) => {
  const payload: Partial<IRequestMatchRESTPayload> = req.body;
  const { userId } = payload;

  if (!userId) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  const socketRoom = createNotifSocket(userId);

  // Send socket to user for subscription
  return res
    .status(StatusCodes.OK)
    .json({
      socketPort: socketRoom,
    })
    .end();
};
