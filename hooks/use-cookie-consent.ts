'use client';

import {
  useCookieConsentStore,
  useHasConsent,
} from '@/lib/cookie-consent/store';
import { useEffect, useState } from 'react';

export function useCookieConsent() {
  const [isMounted, setIsMounted] = useState(false);
  const store = useCookieConsentStore();

  useEffect(() => {
    setIsMounted(true);
    // Initialize store when component mounts on client
    if (!store.isInitialized) {
      store.initialize();
    }
  }, [store]);

  // Return loading state until mounted to prevent hydration mismatch
  if (!isMounted) {
    return {
      ...store,
      showBanner: false,
      showSettings: false,
      isInitialized: false,
    };
  }

  return {
    // State
    hasConsented: store.hasConsented,
    preferences: store.preferences,
    showBanner: store.showBanner,
    showSettings: store.showSettings,

    // Actions
    acceptAll: store.acceptAll,
    rejectAll: store.rejectAll,
    savePreferences: store.updatePreferences,
    openSettings: store.openSettings,
    closeSettings: store.closeSettings,
    closeBanner: store.closeBanner,

    // Utilities
    hasConsent: store.hasConsent,
    canUseAnalytics: () => store.hasConsent('analytics'),
    canUseMarketing: () => store.hasConsent('marketing'),
    canUseFunctionality: () => store.hasConsent('functionality'),
  };
}

// Specific consent hooks
export { useHasConsent } from '@/lib/cookie-consent/store';

// Hook for analytics
export function useAnalyticsConsent() {
  return useHasConsent('analytics');
}

// Hook for marketing
export function useMarketingConsent() {
  return useHasConsent('marketing');
}

// Hook for functionality
export function useFunctionalityConsent() {
  return useHasConsent('functionality');
}
