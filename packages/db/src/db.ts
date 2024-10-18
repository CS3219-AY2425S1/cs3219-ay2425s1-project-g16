import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { config } from './config';

const queryClient = postgres(config);

export const db = drizzle(queryClient);
