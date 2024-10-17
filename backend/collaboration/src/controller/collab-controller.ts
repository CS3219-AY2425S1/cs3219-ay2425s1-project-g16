import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { getCollabRoomService } from '@/service/get/collab-get-service';
import type { IGetCollabRoomPayload } from '@/service/get/types';

export async function getCollabRoom(req: Request, res: Response) {
  const { userid1, userid2, questionid } = req.query;
  const payload: IGetCollabRoomPayload = {
    userid1: userid1 as string,
    userid2: userid2 as string,
    questionid: questionid as string,
  };
  try {
    const result = await getCollabRoomService(payload);
    if (result.error) {
      return res.status(result.code).json({
        error: result.error.message ?? 'An error occurred',
      });
    }
    return res.status(result.code).json(result.data);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', err });
  }
}
