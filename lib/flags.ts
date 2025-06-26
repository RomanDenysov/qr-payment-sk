import { getUser } from '@/app/actions/users';
import { env } from '@/env';
import {
  type Context,
  type RootFlagValues,
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
    environment: env.NODE_ENV,
    user: {
      id: user?.id ?? '',
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  };
});

const hypertuneAdapter = createHypertuneAdapter<RootFlagValues, Context>({
  createSource,
  flagFallbacks,
  flagDefinitions,
  identify,
});

export const appleSignUpFlag = flag(hypertuneAdapter.declarations.appleSignUp);
