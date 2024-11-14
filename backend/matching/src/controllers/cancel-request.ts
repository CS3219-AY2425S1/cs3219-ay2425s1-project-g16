import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { client as redisClient, logQueueStatus } from '@/lib/db';
import { STREAM_NAME } from '@/lib/db/constants';
import { getPoolKey, getStreamId, logger } from '@/lib/utils';
import { io } from '@/server';
import { MATCHING_EVENT } from '@/ws/events';

export const cancelMatchRequestController = async (req: Request, res: Response) => {
  const { userId } = req.body; // Only check for userId

  if (!userId) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'User ID is required' }); // No need for roomId
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Check pending status using only userId
    const result = await redisClient
      .hGetAll(getPoolKey(userId))
      .then(async (value) => {
        if (value.pending === 'true') {
          const timestamp = value.timestamp;
          await Promise.all([
            redisClient.del(getPoolKey(userId)),
            timestamp
              ? redisClient.xDel(STREAM_NAME, getStreamId(value.timestamp))
              : Promise.resolve(),
          ]);
          await logQueueStatus(
            logger,
            redisClient,
            'Queue Status after cancelling request: <PLACEHOLDER>'
          );
          logger.info(`Request cancellation successful`);
          const room = value.socketPort;

          if (room) {
            io.sockets.in(room).socketsLeave(room);
          }

          return {
            success: true,
          };
        }

        return {
          success: false,
          error: `Match in ${MATCHING_EVENT.MATCHING} state.`,
        };
      })
      .catch((reason) => {
        if (reason) {
          return {
            success: false,
            error: reason,
          };
        }
      });

    if (result?.success) {
      return res.status(StatusCodes.OK).end();
    } else if (!result?.success) {
      return res.status(StatusCodes.FORBIDDEN).json(result?.error);
    }
  } catch (error) {
    console.error('Error canceling match:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};
