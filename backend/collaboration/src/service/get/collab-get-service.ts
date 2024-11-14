import crypto from 'crypto';

import { StatusCodes } from 'http-status-codes';

import { db, rooms } from '@/lib/db';

import { IGetCollabRoomPayload, IGetCollabRoomResponse } from './types';

export async function getCollabRoomService(
  payload: IGetCollabRoomPayload
): Promise<IGetCollabRoomResponse> {
  const { userid1, userid2, questionid } = payload;

  const qid = Number(questionid);

  if (!userid1 || !userid2 || isNaN(qid)) {
    return {
      code: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        message: 'Malformed',
      },
    };
  }

  const roomId = crypto.randomBytes(6).toString('hex');

  try {
    await db.insert(rooms).values({
      roomId,
      userId1: userid1,
      userId2: userid2,
      questionId: qid,
      createdAt: new Date(),
    });

    return {
      code: StatusCodes.OK,
      data: {
        roomName: roomId,
      },
    };
  } catch (error) {
    console.error('Error saving room to database:', error);
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: {
        message: 'Failed to create room',
      },
    };
  }
}
