import { createServer } from 'http';

import { Server } from 'socket.io';

import { UI_HOST } from '@/config';
import { logger } from '@/lib/utils';

import { WS_EVENT } from './events';
import { cancelRoomHandler, joinRoomHandler, queueEventHandler } from './handlers';

export const createWs = (server: ReturnType<typeof createServer>) => {
  const io = new Server(server, {
    cors: {
      origin: [UI_HOST],
      credentials: true,
    },
    path: '/matching-socket',
  });
  io.on('connection', (socket) => {
    logger.info(`Socket ${socket.id} connected`);

    socket.on(WS_EVENT.JOIN_ROOM, joinRoomHandler(socket));
    socket.on(WS_EVENT.CANCEL_ROOM, cancelRoomHandler(io, socket));
    socket.on(WS_EVENT.LEAVE_ROOM, (room?: string) => {
      if (room) {
        socket.leave(room);
      }
    });
    socket.on(WS_EVENT.START_QUEUING, queueEventHandler(socket));
    socket.on(WS_EVENT.DISCONNECT, () => {
      logger.info(`Client disconnected: ${socket.id}`);
      socket.disconnect();
    });
  });
  return io;
};
