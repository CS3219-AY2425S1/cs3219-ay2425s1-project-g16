import { exit } from 'process';

import cors from 'cors';
import { sql } from 'drizzle-orm';
import express, { json } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import pino from 'pino-http';

import { UI_HOST } from '@/config';
import { config, db } from '@/lib/db';
import { logger } from '@/lib/utils';
import questionsRouter from '@/routes/question';

const app = express();
app.use(pino());
app.use(json());
app.use(helmet());
app.use(
  cors({
    origin: [UI_HOST],
    credentials: true,
  })
);

app.use('/questions', questionsRouter);

// Health Check for Docker
app.get('/health', (_req, res) => res.status(StatusCodes.OK).send('OK'));

export const dbHealthCheck = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info('Connected to DB');
  } catch (error) {
    const { message } = error as Error;
    logger.error('Cannot connect to DB: ' + message);
    logger.error(`DB Config: ${JSON.stringify({ ...config, password: '<REDACTED>' })}`);
    exit(1);
  }
};

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await dbHealthCheck();
  res.json({ message: 'OK ' });
});

export default app;
