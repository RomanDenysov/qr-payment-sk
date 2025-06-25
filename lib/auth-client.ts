import { env } from '@/env';
import {
  apiKeyClient,
  emailOTPClient,
  organizationClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  fetchOptions: {
    // biome-ignore lint/suspicious/useAwait: <explanation>
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get('X-Retry-After');
        // Show user-friendly message
        toast.error(`Priveľa pokusov. Skúste znova za ${retryAfter} sekúnd.`);
      }
    },
  },
  plugins: [emailOTPClient(), apiKeyClient(), organizationClient()],
});
