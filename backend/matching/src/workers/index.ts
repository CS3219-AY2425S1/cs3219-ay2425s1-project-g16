import { fork } from 'child_process';
import path from 'path';
import { logger } from '@/lib/utils';

export const initWorker = (name: string) => {
  const lCaseName = name.toLowerCase();
  const worker = fork(path.join(__dirname, `${lCaseName}.js`));
  const upperCaseName = name.replace(/^[A-Za-z]/, (c) => c.toUpperCase());
  worker.on('message', (message) => {
    logger.info(`[${upperCaseName}]: ${message}`);
  });
  worker.on('exit', (code) => {
    logger.error(`${upperCaseName} exited with code ${code}.`);
  });
  return worker;
};
