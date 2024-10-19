import { exit } from 'process';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { sql } from 'drizzle-orm';
import express, { json } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import pino from 'pino-http';

import { dbConfig, UI_HOST } from '@/config';
import { db } from '@/lib/db';
import { logger } from '@/lib/utils';
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/user';
import authCheckRoutes from '@/routes/auth-check';

const app = express();
app.use(pino());
app.use(json());
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: [UI_HOST],
    credentials: true,
  })
);

app.use('/auth', authRoutes);
app.use('/auth-check', authCheckRoutes);
app.use('/user', userRoutes)

// Health Check for Docker
app.get('/health', (_req, res) => res.status(StatusCodes.OK).send('OK'));

export const dbHealthCheck = async (exitApp: boolean = true) => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info('Connected to DB');
  } catch (error) {
    const { message } = error as Error;
    logger.error('Cannot connect to DB: ' + message);
    logger.error(`DB Config: ${JSON.stringify(dbConfig)}`);

    if (exitApp) {
      exit(1);
    }
  }
};

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await dbHealthCheck(false);
  res.json({ message: 'OK ' });
});

export default app;
