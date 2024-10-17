import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { client, logQueueStatus } from '@/lib/db';
import type { IRedisClient, IRequestMatchPayload } from '@/types';
import { createNotifSocket, queueingService } from '@/services';
import { logger } from '@/lib/utils';

let redisClient: IRedisClient;
export const matchRequestController = async (req: Request, res: Response) => {
  const payload: Partial<IRequestMatchPayload> = req.body;
  const { userId, difficulty, topic } = payload;
  if (!userId || (!difficulty && !topic)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  if (!redisClient || !redisClient.isOpen || !redisClient.isReady) {
    redisClient = await client.connect();
  }

  // TODO: Assign a proper socket to the user
  const socketRoom = createNotifSocket(userId);
  const timestamp = `${Date.now()}`;

  // Send socket to user first for them to subscribe
  res
    .status(StatusCodes.OK)
    .json({
      socketPort: socketRoom,
      requestId: timestamp, // Queue ID
    })
    .end();

  // Added time buffer for matcher worker, but may be insufficient (especially if <1s is left)
  await queueingService(redisClient, {
    userId,
    difficulty,
    topic,
    socketPort: socketRoom,
    timestamp,
  });

  logQueueStatus(logger, redisClient, `Queue Status Before Matching: <PLACEHOLDER>`);
};
