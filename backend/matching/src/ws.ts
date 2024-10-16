import http from 'http';
import { Server } from 'socket.io';
import { logger } from './lib/utils';
import { UI_HOST } from './config';

export const createWs = (server: ReturnType<(typeof http)['createServer']>) => {
  const io = new Server(server, {
    cors: {
      // to update
      origin: [UI_HOST, 'http://localhost:5174'],
      credentials: true,
    },
  });
  io.on('connection', (socket) => {
    logger.info(`${socket.id} connected`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
      logger.info(`Client joined room: ${room}`);
      socket.to(room).emit('message', `A new user has joined room: ${room}`);
    });
    // socket.on('create', (room) => {
    //   socket.join(room);
    // });
    socket.on('leave', (room) => {
      socket.leave(room);
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
