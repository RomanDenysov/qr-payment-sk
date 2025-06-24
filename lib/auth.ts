import db from '@/db';
import {
  accountsTable,
  apikeyTable,
  invitationTable,
  memberTable,
  organizationsTable,
  rateLimitTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from '@/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, emailOTP, openAPI, organization } from 'better-auth/plugins';
import { trackUserActivity } from './analytics';

export const auth = betterAuth({
  appName: 'QR Platby',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationsTable,
      organization: organizationsTable,
      member: memberTable,
      invitation: invitationTable,
      apikey: apikeyTable,
      rateLimit: rateLimitTable,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'apple'],
      updateUserInfoOnLink: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  rateLimit: {
    window: 60, // 1 minute window
    max: 50, // 50 requests per minute (more restrictive than default)
    storage: 'database', // Use your existing PostgreSQL database
  },
  hooks: {
    // Only initialize user stats on registration - nothing more
    after: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path.startsWith('/autorizacia?state=registracia') &&
        ctx.context.newSession
      ) {
        try {
          await initializeUserStats(ctx.context.newSession.user.id);
        } catch (error) {
          // biome-ignore lint/suspicious/noConsole: <explanation>
          console.error('Failed to initialize user stats:', error);
        }
      }
    }),
  },
  socialProviders: {
    // apple: {
    //   clientId: env.APPLE_CLIENT_ID,
    //   clientSecret: env.APPLE_CLIENT_SECRET,
    //   // Optional
    //   appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
    // },
    // google: {
    // prompt: 'select_account',
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    // },
  },
  trustedOrigins: ['https://appleid.apple.com'],
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // Implement the sendVerificationOTP method to send the OTP to the user's email address
        console.log('Sending verification OTP to', email);
        console.log('OTP:', otp);
        console.log('Type:', type);
      },
    }),
    organization(),
    apiKey(),
    openAPI(),
    nextCookies(),
  ],
});

/**
 * Initialize user stats on registration
 */
async function initializeUserStats(userId: string) {
  // Just ensure user has today's stats entry - that's it
  await trackUserActivity(userId, {
    qrCodesGenerated: 0,
    templatesCreated: 0,
    templatesUsed: 0,
    revenue: 0,
  });
}
