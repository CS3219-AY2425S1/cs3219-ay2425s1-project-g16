import http from 'http';

import { Server } from 'socket.io';

import { UI_HOST } from './config';
import { logger } from './lib/utils';

export const createWs = (server: ReturnType<(typeof http)['createServer']>) => {
  const io = new Server(server, {
    cors: {
      // to update
      origin: [UI_HOST, 'http://localhost:5174'],
      credentials: true,
    },
    path: '/matching-socket',
  });
  io.on('connection', (socket) => {
    logger.info(`${socket.id} connected`);

    socket.on('joinRoom', (roomId) => {
      if (!roomId) {
        logger.warn('joinRoom event received without a roomId');
        return;
      }

      socket.join(roomId);
      logger.info(`Socket ${socket.id} joined room: ${roomId}`);
      socket.emit('joinedRoom', roomId);
    });
    // socket.on('create', (room) => {
    //   socket.join(room);
    // });
    socket.on('cancelRoom', (roomId) => {
      if (roomId) {
        io.in(roomId).socketsLeave(roomId);
        logger.info(`Room ${roomId} has been cancelled and closed.`);
        socket.emit('roomCancelled', roomId);
      } else {
        logger.warn('No room ID provided for cancellation');
      }
    });
    socket.on('leave', (room) => {
      socket.leave(room);
    });
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
  return io;
};

export const MATCH_SVC_EVENT = {
  SUCCESS: 'SUCCESS', // When match successful
  FAILED: 'FAILED', // When match failed
  PENDING: 'PENDING', // When waiting for match
  MATCHING: 'MATCHING', // When matching in progress
  DISCONNECT: 'DISCONNECT', // To disconnect all sockets in room
} as const;
export type IMatchEvent = (typeof MATCH_SVC_EVENT)[keyof typeof MATCH_SVC_EVENT];
export type IChildProcessMessage = {
  rooms: Array<string>;
  event: IMatchEvent;
  message?: unknown;
};
