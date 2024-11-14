import { createServer } from 'http';

import { Server } from 'socket.io';

import { UI_HOST } from '@/config';
import { logger } from '@/lib/utils';

import { WS_CLIENT_EVENT } from './events';
import { joinRoomHandler, leaveRoomHandler, sendMessageHandler } from './handlers';

export const createWs = (server: ReturnType<typeof createServer>) => {
  const io = new Server(server, {
    cors: {
      origin: [UI_HOST],
      credentials: true,
    },
    path: '/chat-socket',
  });

  io.on('connection', (socket) => {
    logger.info(`Socket ${socket.id} connected`);

    socket.on(WS_CLIENT_EVENT.JOIN_ROOM, joinRoomHandler(socket));
    socket.on(WS_CLIENT_EVENT.LEAVE_ROOM, leaveRoomHandler(socket));
    socket.on(WS_CLIENT_EVENT.SEND_MESSAGE, sendMessageHandler(io, socket));
    socket.on(WS_CLIENT_EVENT.DISCONNECT, () => {
      logger.info(`Client disconnected: ${socket.id}`);
      socket.disconnect();
    });
  });

  return io;
};
