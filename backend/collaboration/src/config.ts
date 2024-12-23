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

// disable gc when using snapshots!
export const GC_ENABLED = process.env.GC !== 'false' && process.env.GC !== '0';

export const ENABLE_CODE_ASSISTANCE = process.env.ENABLE_CODE_ASSISTANCE === 'true';
