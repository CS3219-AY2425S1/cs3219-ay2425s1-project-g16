import type { DefaultEventsMap, Server, Socket } from 'socket.io';

import { client, logQueueStatus } from '@/lib/db';
import { logger } from '@/lib/utils';
import { queueingService } from '@/services';
import type { IRedisClient, IRequestMatchEvent } from '@/types';

import { MATCHING_EVENT, WS_EVENT } from './events';

type ISocketIOServer<T> = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, T>;
type ISocketIOSocket<T> = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, T>;

export const joinRoomHandler =
  <T>(socket: ISocketIOSocket<T>) =>
  (roomId?: string) => {
    if (!roomId) {
      logger.warn('joinRoom event received without a roomId');
      return;
    }

    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room: ${roomId}`);
    socket.emit('joinedRoom', roomId);
  };

export const cancelRoomHandler =
  <S, T>(io: ISocketIOServer<S>, socket: ISocketIOSocket<T>) =>
  (roomId?: string) => {
    if (roomId) {
      io.in(roomId).socketsLeave(roomId);
      logger.info(`Room ${roomId} has been cancelled and closed.`);
      socket.emit('roomCancelled', roomId);
    } else {
      logger.warn('No room ID provided for cancellation');
    }
  };

let redisClient: IRedisClient;

export const queueEventHandler =
  <T>(socket: ISocketIOSocket<T>) =>
  async (payload: Partial<IRequestMatchEvent>) => {
    // 1. Invalid Room
    if (!payload.roomId) {
      const errorMessage = 'Queuing Event triggered without room.';
      logger.warn(errorMessage);
      socket.emit(MATCHING_EVENT.ERROR, errorMessage);
      return;
    }

    // 2. Invalid Request
    const { roomId } = payload;

    if (
      !payload.userId ||
      (!payload.topic && !payload.difficulty) ||
      (payload.topic && !Array.isArray(payload.topic))
    ) {
      const message = `Payload for ${WS_EVENT.START_QUEUING} is invalid.`;
      logger.warn(message);
      socket.emit(MATCHING_EVENT.ERROR, message);
      return;
    }

    // 3. Start Queuing
    try {
      if (!redisClient || !redisClient.isOpen || !redisClient.isReady) {
        redisClient = await client.connect();
      }

      const { userId, difficulty, topic } = payload;
      const timestamp = `${Date.now()}`;
      await queueingService(redisClient, {
        userId,
        difficulty,
        topic,
        socketPort: roomId,
        timestamp,
      });
      socket.emit(MATCHING_EVENT.QUEUED);
      await logQueueStatus(
        logger,
        redisClient,
        `[ws::queueEventHandler] Queue Status Before Matching: <PLACEHOLDER>`
      );
    } catch (error) {
      const { name, message, stack, cause } = error as Error;
      logger.error({ name, message, stack, cause }, `An error occurred.`);
      socket.emit(MATCHING_EVENT.ERROR, 'Error connecting to client');
      return;
    }
  };
