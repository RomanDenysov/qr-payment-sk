'use client';

import { CookieBanner } from './cookie-banner';
import { CookieSettingsDialog } from './cookie-settings-dialog';
import { CookieSettingsWidget } from './cookie-settings-widget';

export function CookieConsent() {
  return (
    <>
      <CookieBanner />
      <CookieSettingsDialog />
      <CookieSettingsWidget />
    </>
  );
}

// Export individual components for flexibility
export { CookieBanner } from './cookie-banner';
export { CookieSettingsDialog } from './cookie-settings-dialog';
export { CookieSettingsWidget } from './cookie-settings-widget';

// Export hooks and utilities
export {
  useCookieConsentStore,
  useHasConsent,
  useNeedsCookieConsent,
} from '@/lib/cookie-consent/store';
export type {
  ConsentPreferences,
  ConsentState,
} from '@/lib/cookie-consent/types';
