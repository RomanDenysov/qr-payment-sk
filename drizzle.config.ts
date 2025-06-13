import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
  out: '../drizzle/migrations',
  schema: './database/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ['sk_*'],
});
