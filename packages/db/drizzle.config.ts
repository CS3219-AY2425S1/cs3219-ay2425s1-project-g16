import { defineConfig } from 'drizzle-kit';

import { config } from './src/config';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: config,
});
