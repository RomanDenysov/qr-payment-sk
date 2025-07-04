import db from '@/db';
import { schema } from '@/db/schema';
import { env } from '@/env';
import { sendOTPEmail } from '@/lib/email';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { apiKey, emailOTP, openAPI, organization } from 'better-auth/plugins';

export const auth = betterAuth({
  appName: 'QR Platby',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
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
    google: {
      prompt: 'select_account',
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: ['https://appleid.apple.com'],
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendOTPEmail(email, otp);
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
  // await trackUserActivity(userId, {
  //   qrCodesGenerated: 0,
  //   templatesCreated: 0,
  //   templatesUsed: 0,
  //   revenue: 0,
  // });
}
