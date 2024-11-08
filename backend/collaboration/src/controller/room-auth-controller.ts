import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { db, rooms } from '@/lib/db';

export async function authCheck(req: Request, res: Response) {
  const roomId = req.query.roomId as string | undefined;
  const userId = req.query.userId as string | undefined;

  if (!roomId || !userId) {
    return {
      code: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        message: 'Malformed',
      },
    };
  }

  try {
    const room = await db.select().from(rooms).where(eq(rooms.roomId, roomId)).limit(1);

    if (room.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: {
          message: 'Room not found',
        },
      });
    }

    const { userId1, userId2 } = room[0];

    if (userId !== userId1 && userId !== userId2) {
      return res.status(StatusCodes.FORBIDDEN).json({
        code: StatusCodes.FORBIDDEN,
        error: { message: 'User is not authorized to access this room' },
      });
    }

    return res.status(StatusCodes.OK).json({
      code: StatusCodes.OK,
      data: { roomId },
    });
  } catch (error) {
    console.error('Error authenticating room:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: { message: 'An error occurred while authenticating the room' },
    });
  }
}
