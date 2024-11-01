import 'dotenv/config';

export const UI_HOST = process.env.PEERPREP_UI_HOST!;

export const EXPRESS_PORT = process.env.EXPRESS_PORT;

export const dbConfig = {
  host: process.env.EXPRESS_DB_HOST!,
  port: Number.parseInt(process.env.EXPRESS_DB_PORT!),
  database: process.env.POSTGRES_DB!,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

export const LOAD_TEST_POD = process.env.LOAD_TEST_POD || 'http://question-service-load-test';
