import crypto from 'crypto';

import { StatusCodes } from 'http-status-codes';

import { IGetCollabRoomPayload, IGetCollabRoomResponse } from './types';

export async function getCollabRoomService(
  payload: IGetCollabRoomPayload
): Promise<IGetCollabRoomResponse> {
  const { userid1, userid2, questionid } = payload;

  if (!userid1 || !userid2 || !questionid) {
    return {
      code: StatusCodes.UNPROCESSABLE_ENTITY,
      error: {
        message: 'Malformed',
      },
    };
  }

  const randomString = crypto.randomBytes(4).toString('hex');
  const combinedString = `uid1=${userid1}|uid2=${userid2}|qid=${questionid}|rand=${randomString}`;
  const hash = crypto.createHash('sha256');
  const uniqueRoomName = hash.update(combinedString).digest('hex');
  return {
    code: StatusCodes.OK,
    data: {
      roomName: uniqueRoomName,
    },
  };
}
