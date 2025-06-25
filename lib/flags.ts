import 'server-only';
import { getUser } from '@/app/actions/users';
import {
  type Context,
  type FlagValues,
  createSource,
  vercelFlagDefinitions as flagDefinitions,
  flagFallbacks,
} from '@/generated/hypertune';
import { createHypertuneAdapter } from '@flags-sdk/hypertune';
import type { Identify } from 'flags';
import { dedupe, flag } from 'flags/next';

const identify: Identify<Context> = dedupe(async ({ headers, cookies }) => {
  const user = await getUser();

  // You can add more context here for better targeting
  return {
    environment: process.env.NODE_ENV,
    user: {
      id: user?.id ?? '',
      name: user?.name ?? '',
      email: user?.email ?? '',
      // Add more targeting criteria as needed:
      // plan: user?.subscription?.plan ?? 'free',
      // createdAt: user?.createdAt?.toISOString() ?? '',
      // isActive: user?.isActive ?? false,
    },
  };
});

const hypertuneAdapter = createHypertuneAdapter<FlagValues, Context>({
  createSource,
  flagFallbacks,
  flagDefinitions,
  identify,
});

export const appleSignUpFlag = flag(hypertuneAdapter.declarations.appleSignUp);
