import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import app from '@/server';

const port = Number.parseInt(EXPRESS_PORT || '8001');

const listenMessage = `App listening on port: ${port}`;
app.listen(port, () => {
  logger.info(listenMessage);
});
