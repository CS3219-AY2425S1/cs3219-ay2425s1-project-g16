import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import server, { io } from '@/server';
import { dbHealthCheck } from '@/server';

const port = Number.parseInt(EXPRESS_PORT || '8001');

const listenMessage = `App listening on port: ${port}`;
server.listen(port, () => {
  void dbHealthCheck();
  logger.info(listenMessage);
});

const shutdown = () => {
  logger.info('Shutting down gracefully...');

  server.close((err) => {
    if (err) {
      logger.error('Error closing HTTP server', err);
      process.exit(1);
    }

    void io
      .close(() => {
        logger.info('WS Server shut down');
      })
      .then(() => {
        logger.info('App shut down');
        process.exit(0);
      });
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
