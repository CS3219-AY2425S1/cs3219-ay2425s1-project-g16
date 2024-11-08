import { and, eq } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { db, rooms } from '@/lib/db';
import { IServiceResponse } from '@/types';

import { IGetAuthRoomPayload } from './types';

export const roomAuthService = async (
  params: IGetAuthRoomPayload
): Promise<IServiceResponse<{ questionId: number }>> => {
  const authedRooms = await db
    .select()
    .from(rooms)
    .where(and(eq(rooms.roomId, params.roomId)))
    .limit(1);

  if (!authedRooms || authedRooms.length === 0) {
    return {
      code: StatusCodes.UNAUTHORIZED,
      error: {
        message: 'No room with the given ID exists',
      },
    };
  }

  const authedRoom = authedRooms[0];
  const { userId1, userId2, questionId } = authedRoom;

  if (![userId1, userId2].includes(params.userId)) {
    return {
      code: StatusCodes.UNAUTHORIZED,
      error: {
        message: 'No room with the given ID exists',
      },
    };
  }

  return {
    code: StatusCodes.OK,
    data: {
      questionId,
    },
  };
};
