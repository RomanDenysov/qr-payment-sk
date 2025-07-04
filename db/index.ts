// import 'server-only';

import { env } from '@/env';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { schema } from './schema';

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql, schema });

export default db;
