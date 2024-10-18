import http from 'http';
import { WebSocketServer } from 'ws';

import { setUpPersistence, setupWSConnection } from '@/lib/y-postgres';

export const setUpWSServer = (server: ReturnType<(typeof http)['createServer']>) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', setupWSConnection);

  setUpPersistence();

  return wss;
};
