import { c15tConfig } from '@/lib/c15t/config';
import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from '@c15t/nextjs';
import type { ReactNode } from 'react';

export function CookieConsentProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <ConsentManagerProvider options={c15tConfig}>
      {children}
      <CookieBanner />
      <ConsentManagerDialog />
    </ConsentManagerProvider>
  );
}
