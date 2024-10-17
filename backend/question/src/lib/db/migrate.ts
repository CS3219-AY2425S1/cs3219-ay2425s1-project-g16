import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const config = {
  host: process.env.EXPRESS_DB_HOST!,
  port: Number.parseInt(process.env.EXPRESS_DB_PORT!),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
const migrationConnection = postgres({ ...config, max: 1 });

const db = drizzle(migrationConnection);

const main = async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await migrationConnection.end();
};

void main();
