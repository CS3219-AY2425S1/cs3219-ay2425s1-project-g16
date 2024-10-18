import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { dbConfig } from '@/config';

const queryClient = postgres({
  ...dbConfig,
});

export const db = drizzle(queryClient);

export * from './schema';
