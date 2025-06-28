'use client';

import { saveConsentPreferences } from '@/app/actions/cookie-consent';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ConsentPreferences, ConsentState } from './types';
import {
  createConsentState,
  enforceCookieConsent,
  getDefaultConsentState,
  hasValidConsent,
  shouldShowBanner,
} from './utils';

interface CookieConsentStore extends ConsentState {
  // UI State
  showBanner: boolean;
  showSettings: boolean;
  isInitialized: boolean;

  // Actions
  acceptAll: () => Promise<void>;
  rejectAll: () => Promise<void>;
  updatePreferences: (preferences: ConsentPreferences) => Promise<void>;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
  hasConsent: (category: keyof ConsentPreferences) => boolean;
  initialize: () => void;
  setShowBanner: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
}

export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set, get) => ({
      // Initial state - start with hidden banner to prevent flash
      ...getDefaultConsentState(),
      showBanner: false,
      showSettings: false,
      isInitialized: false,

      // Actions
      acceptAll: async () => {
        const preferences: ConsentPreferences = {
          necessary: true,
          functionality: true,
          analytics: true,
          marketing: true,
        };

        const newState = createConsentState(preferences);
        enforceCookieConsent(preferences);

        // Save to server using Next.js 15 server action
        try {
          await saveConsentPreferences(preferences);
        } catch (error) {
          console.error('Failed to save consent to server:', error);
        }

        set({
          ...newState,
          showBanner: false,
        });
      },

      rejectAll: async () => {
        const preferences: ConsentPreferences = {
          necessary: true, // Always true
          functionality: true, // Allow for better UX (theme, language)
          analytics: false,
          marketing: false,
        };

        const newState = createConsentState(preferences);
        enforceCookieConsent(preferences);

        // Save to server using Next.js 15 server action
        try {
          await saveConsentPreferences(preferences);
        } catch (error) {
          console.error('Failed to save consent to server:', error);
        }

        set({
          ...newState,
          showBanner: false,
        });
      },

      updatePreferences: async (preferences: ConsentPreferences) => {
        const newState = createConsentState(preferences);
        enforceCookieConsent(preferences);

        // Save to server using Next.js 15 server action
        try {
          await saveConsentPreferences(preferences);
        } catch (error) {
          console.error('Failed to save consent to server:', error);
        }

        set({
          ...newState,
          showBanner: false,
          showSettings: false,
        });
      },

      openSettings: () => {
        set({ showSettings: true });
      },

      closeSettings: () => {
        set({ showSettings: false });
      },

      closeBanner: () => {
        // Slovak law compliance: users can close banner without accepting cookies
        set({ showBanner: false });
      },

      hasConsent: (category: keyof ConsentPreferences) => {
        const state = get();
        return state.preferences[category];
      },

      initialize: () => {
        const state = get();

        // Only initialize once
        if (state.isInitialized) return;

        // Check if we need to show banner based on stored consent
        const needsBanner = shouldShowBanner(state) || !hasValidConsent(state);

        // Enforce current consent preferences
        enforceCookieConsent(state.preferences);

        set({
          showBanner: needsBanner,
          isInitialized: true,
        });
      },

      setShowBanner: (show: boolean) => set({ showBanner: show }),
      setShowSettings: (show: boolean) => set({ showSettings: show }),
    }),
    {
      name: 'cookie-consent',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hasConsented: state.hasConsented,
        consentDate: state.consentDate,
        preferences: state.preferences,
        version: state.version,
        isInitialized: state.isInitialized, // Persist initialization state
      }),
      // Handle hydration properly
      onRehydrateStorage: () => (state) => {
        // After rehydration, determine if banner should show
        if (state && !state.isInitialized) {
          const needsBanner =
            shouldShowBanner(state) || !hasValidConsent(state);
          state.showBanner = needsBanner;
          state.isInitialized = true;
        }
      },
    }
  )
);

// Hook for easy access to consent status
export const useHasConsent = (category: keyof ConsentPreferences) => {
  return useCookieConsentStore((state) => state.hasConsent(category));
};

// Hook for checking if cookie consent is needed
export const useNeedsCookieConsent = () => {
  return useCookieConsentStore(
    (state) => !state.hasConsented || state.showBanner
  );
};
