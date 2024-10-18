import 'dotenv/config';

export const config = {
  host: process.env.DRIZZLE_HOST!,
  port: Number.parseInt(process.env.DRIZZLE_PORT!),
  database: process.env.POSTGRES_DB!,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
