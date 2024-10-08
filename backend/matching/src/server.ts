import cors from 'cors';
import express, { json } from 'express';
import http from 'http';
import { StatusCodes } from 'http-status-codes';
import pino from 'pino-http';

// import { logger } from '@/lib/utils';
import { UI_HOST } from './config';
import { createWs } from './ws';

const app = express();
app.use(pino());
app.use(json());
app.use(
  cors({
    origin: [UI_HOST],
    credentials: true,
  })
);

// Health Check for Docker
app.get('/health', (_req, res) => res.status(StatusCodes.OK).send('OK'));

const server = http.createServer(app);

export const io = createWs(server);

export default server;
