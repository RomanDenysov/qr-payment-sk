import db from '@/db';
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable,
    },
  }),
  rateLimit: {
    window: 60, // 1 minute window
    max: 50, // 50 requests per minute (more restrictive than default)
    storage: 'database', // Use your existing PostgreSQL database
    customRules: {
      '/sign-in/email': {
        window: 300, // 5 minutes
        max: 5, // 5 login attempts per 5 minutes
      },
      '/sign-up/email': {
        window: 3600, // 1 hour
        max: 3, // 3 registration attempts per hour
      },
      '/reset-password': {
        window: 3600,
        max: 3,
      },
    },
  },
  hooks: {
    // Only initialize user stats on registration - nothing more
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up') && ctx.context.newSession) {
        try {
          await initializeUserStats(ctx.context.newSession.user.id);
        } catch (error) {
          console.error('Failed to initialize user stats:', error);
        }
      }
    }),
  },
  plugins: [nextCookies()],
});

/**
 * Initialize user stats on registration
 */
async function initializeUserStats(userId: string) {
  // Just ensure user has today's stats entry - that's it
  const { trackUserActivity } = await import('@/lib/analytics');
  await trackUserActivity(userId, {
    qrCodesGenerated: 0,
    templatesCreated: 0,
    templatesUsed: 0,
    revenue: 0,
  });
}
