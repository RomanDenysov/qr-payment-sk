'use client';

import { useQueryState } from 'nuqs';

export type AuthState = 'prihlasenie' | 'registracia' | 'otp';

export function useAuthState() {
  const [authState, setAuthState] = useQueryState<AuthState>('status', {
    defaultValue: 'prihlasenie',
    history: 'push',
    shallow: true,
    parse: (value) => value as AuthState,
    serialize: (value) => value as AuthState,
  });

  return { authState, setAuthState };
}
