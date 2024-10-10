import type { ChildProcess } from 'child_process';

import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import server, { io } from '@/server';
import { initWorker } from '@/workers';

const workers: ChildProcess[] = [];

const port = Number.parseInt(EXPRESS_PORT || '8001');

const listenMessage = `App listening on port: ${port}`;
server.listen(port, () => {
  logger.info(listenMessage);
  ['Cleaner', 'Matcher'].map(initWorker).forEach((process) => workers.push(process));
});

const shutdown = () => {
  workers.forEach((worker) => {
    worker.kill();
  });
  io.close(() => {
    logger.info('WS Server shut down');
  });
  server.close(() => {
    logger.info('App shut down');
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
