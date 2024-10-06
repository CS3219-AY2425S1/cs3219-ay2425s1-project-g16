import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { config } from './config';

const migrationClient = postgres({ ...config, max: 1 });

const db = drizzle(migrationClient);

const main = async () => {
  await migrate(db, { migrationsFolder: 'drizzle' });
  await migrationClient.end();
};

void main();
