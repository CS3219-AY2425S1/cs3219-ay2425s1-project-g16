import postgres from 'postgres';

export const config = {
  host: process.env.EXPRESS_DB_HOST!,
  port: Number.parseInt(process.env.EXPRESS_DB_PORT!),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

export const db = postgres(config);
