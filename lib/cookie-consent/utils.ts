import type { ConsentPreferences, ConsentState } from './types';

const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0.0';

export const getDefaultConsentState = (): ConsentState => ({
  hasConsented: false,
  consentDate: null,
  preferences: {
    necessary: true, // Always true as required
    functionality: false,
    analytics: false,
    marketing: false,
  },
  version: CONSENT_VERSION,
});

export const loadConsentState = (): ConsentState => {
  if (typeof window === 'undefined') {
    return getDefaultConsentState();
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      return getDefaultConsentState();
    }

    const parsed = JSON.parse(stored);

    // Check if version matches, if not reset consent
    if (parsed.version !== CONSENT_VERSION) {
      return getDefaultConsentState();
    }

    return {
      ...parsed,
      consentDate: parsed.consentDate ? new Date(parsed.consentDate) : null,
    };
  } catch (error) {
    console.error('Failed to load consent state:', error);
    return getDefaultConsentState();
  }
};

export const saveConsentState = (state: ConsentState): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save consent state:', error);
  }
};

export const clearConsentState = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear consent state:', error);
  }
};

export const createConsentState = (
  preferences: ConsentPreferences
): ConsentState => ({
  hasConsented: true,
  consentDate: new Date(),
  preferences: {
    ...preferences,
    necessary: true, // Always true
  },
  version: CONSENT_VERSION,
});

export const shouldShowBanner = (consentState: ConsentState): boolean => {
  return !consentState.hasConsented;
};

export const hasValidConsent = (consentState: ConsentState): boolean => {
  if (!consentState.hasConsented || !consentState.consentDate) {
    return false;
  }

  // Check if consent is still valid (not older than 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return consentState.consentDate > oneYearAgo;
};

// Cookie management functions
export const setCookie = (name: string, value: string, days = 365): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');

  for (let c of ca) {
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
};

export const deleteCookie = (name: string): void => {
  if (typeof document === 'undefined') return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Clean up cookies based on consent
export const enforceCookieConsent = (preferences: ConsentPreferences): void => {
  if (typeof document === 'undefined') {
    return;
  }

  // If analytics consent is withdrawn, remove analytics cookies
  if (!preferences.analytics) {
    deleteCookie('_ga');
    deleteCookie('_ga_*');
    deleteCookie('analytics-session');
  }

  // If marketing consent is withdrawn, remove marketing cookies
  if (!preferences.marketing) {
    deleteCookie('_fbp');
    deleteCookie('_gcl_au');
    deleteCookie('marketing-id');
  }

  // If functionality consent is withdrawn, remove functionality cookies
  if (!preferences.functionality) {
    deleteCookie('language-preference');
    deleteCookie('theme-preference');
    deleteCookie('currency-preference');
  }
};
