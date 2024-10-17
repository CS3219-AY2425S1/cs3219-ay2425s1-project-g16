// MAIN PROCESS
import { fork } from 'child_process';
import path from 'path';

import type { Server } from 'socket.io';

import { logger } from '@/lib/utils';
import { MATCH_SVC_EVENT, type IChildProcessMessage } from '@/ws';

let nWorkers = 0; // For tracking graceful exit of main process
export const initWorker = (name: string, io: Server) => {
  const lCaseName = name.toLowerCase();
  const worker = fork(path.join(__dirname, `${lCaseName}.js`));
  nWorkers += 1;
  const upperCaseName = name.replace(/^[A-Za-z]/, (c) => c.toUpperCase());
  worker.on('message', (message) => {
    if (typeof message.valueOf() === 'string') {
      logger.info({ pid: worker.pid }, `[${upperCaseName}]: ${message}`);
      return;
    }
    const messagePayload = message.valueOf();
    logger.info(
      { pid: worker.pid },
      `[${upperCaseName}]: WS Payload: ${JSON.stringify(messagePayload)}`
    );
    const { rooms, event, message: payload } = messagePayload as IChildProcessMessage;
    if (event === MATCH_SVC_EVENT.DISCONNECT) {
      io.sockets.in(rooms).disconnectSockets();
      return;
    }
    io.sockets.in(rooms).emit(event, payload);
  });
  worker.on('exit', (code) => {
    logger.error({ pid: worker.pid }, `${upperCaseName} exited with code ${code}.`);
    nWorkers -= 1;
    if (nWorkers === 0) {
      logger.info('Main Process exiting.');
      process.exit(0);
    }
  });
  return worker;
};
