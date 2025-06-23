'use client';

import { useSession } from '@/lib/auth-client';

export function useUser() {
  const { data: session, isPending, refetch, error } = useSession();

  return {
    user: session?.user,
    isSignedIn: !!session,
    isPending,
    refetch,
    error,
  };
}
