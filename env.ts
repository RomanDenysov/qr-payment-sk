import { vercel } from '@t3-oss/env-core/presets-zod';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),
    BREVO_API_KEY: z.string(),
    // SMTP Settings (for Gmail or custom SMTP)
    EMAIL_USER: z.string().optional(),
    EMAIL_PASSWORD: z.string().optional(),

    HYPERTUNE_FRAMEWORK: z.string(),
    HYPERTUNE_OUTPUT_DIRECTORY_PATH: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    // APPLE_CLIENT_ID: z.string(),
    // APPLE_CLIENT_SECRET: z.string(),
    // APPLE_APP_BUNDLE_IDENTIFIER: z.string(),
    QRPAYMENTS_NEXT_PUBLIC_HYPERTUNE_TOKEN: z.string(),

    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    NEXT_PUBLIC_BETTER_AUTH_URL:
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    // APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
    // APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
    // APPLE_APP_BUNDLE _IDENTIFIER: process.env.APPLE_APP_BUNDLE_IDENTIFIER,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    NODE_ENV: process.env.NODE_ENV || 'development',
    QRPAYMENTS_NEXT_PUBLIC_HYPERTUNE_TOKEN:
      process.env.QRPAYMENTS_NEXT_PUBLIC_HYPERTUNE_TOKEN,
    HYPERTUNE_FRAMEWORK: process.env.HYPERTUNE_FRAMEWORK,
    HYPERTUNE_OUTPUT_DIRECTORY_PATH:
      process.env.HYPERTUNE_OUTPUT_DIRECTORY_PATH,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  extends: [vercel()],
});
