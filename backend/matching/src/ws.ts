import http from 'http';
import { Server } from 'socket.io';

export const createWs = (server: ReturnType<(typeof http)['createServer']>) => {
  const io = new Server(server);
  io.sockets.on('connection', (socket) => {
    socket.on('create', (room) => {
      socket.join(room);
    });
    socket.on('leave', (room) => {
      socket.leave(room);
    });
  });
  return io;
};
