import { logger } from '@/lib/utils';
import app, { dbHealthCheck } from '@/server';
import { EXPRESS_PORT } from '@/config';

const port = Number.parseInt(EXPRESS_PORT ?? '8001');

const listenMessage = `App listening on port: ${port}`;
app.listen(port, () => {
  void dbHealthCheck();
  logger.info(listenMessage);
});
