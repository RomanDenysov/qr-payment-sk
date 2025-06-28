import { cookies } from 'next/headers';
import type { ConsentPreferences } from './types';

export interface CookieService {
  name: string;
  category: 'necessary' | 'functionality' | 'analytics' | 'marketing';
  initialize: () => void;
  cleanup: () => void;
}

// Next.js 15 compatible server-side cookie utilities
export const nextjsCookieUtils = {
  // Server-side cookie setting (use in Server Actions or API routes)
  async setServerCookie(
    name: string,
    value: string,
    options?: {
      maxAge?: number;
      httpOnly?: boolean;
      secure?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      path?: string;
    }
  ) {
    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      maxAge: options?.maxAge || 365 * 24 * 60 * 60, // 1 year default
      httpOnly: options?.httpOnly ?? true,
      secure: options?.secure ?? process.env.NODE_ENV === 'production',
      sameSite: options?.sameSite || 'lax',
      path: options?.path || '/',
    });
  },

  // Server-side cookie getting
  async getServerCookie(name: string): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  },

  // Server-side cookie deletion
  async deleteServerCookie(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
  },

  // Save consent preferences using Next.js cookies API
  async saveConsentToServer(preferences: ConsentPreferences) {
    await this.setServerCookie(
      'cookie-consent',
      JSON.stringify({
        hasConsented: true,
        consentDate: new Date().toISOString(),
        preferences,
        version: '1.0.0',
      }),
      {
        httpOnly: false, // Allow client-side access for immediate use
        maxAge: 365 * 24 * 60 * 60, // 1 year
      }
    );
  },

  // Load consent preferences from server
  async loadConsentFromServer() {
    try {
      const consentData = await this.getServerCookie('cookie-consent');
      if (!consentData) return null;

      return JSON.parse(consentData);
    } catch (error) {
      console.error('Failed to load consent from server:', error);
      return null;
    }
  },
};

// Create cookie manager with functional approach
function createCookieManager() {
  const services = new Map<string, CookieService>();
  let currentConsent: Record<string, boolean> = {};

  return {
    // Register a service (Google Analytics, Facebook Pixel, etc.)
    register: (service: CookieService) => {
      services.set(service.name, service);
    },

    // Update consent and manage services accordingly
    updateConsent: (consent: Record<string, boolean>) => {
      const previousConsent = { ...currentConsent };
      currentConsent = consent;

      // Handle each service based on consent changes
      for (const [name, service] of services) {
        const hasConsent = consent[service.category] === true;
        const hadConsent = previousConsent[service.category] === true;

        // Initialize service if consent was granted
        if (hasConsent && !hadConsent) {
          try {
            service.initialize();
            console.log(`✅ Initialized ${service.name}`);
          } catch (error) {
            console.error(`❌ Failed to initialize ${service.name}:`, error);
          }
        }

        // Cleanup service if consent was withdrawn
        if (!hasConsent && hadConsent) {
          try {
            service.cleanup();
            console.log(`🧹 Cleaned up ${service.name}`);
          } catch (error) {
            console.error(`❌ Failed to cleanup ${service.name}:`, error);
          }
        }
      }
    },

    // Check if a category has consent
    hasConsent: (category: string): boolean => {
      return currentConsent[category] === true;
    },

    // Get all services for a category
    getServices: (category: string): CookieService[] => {
      return Array.from(services.values()).filter(
        (service) => service.category === category
      );
    },
  };
}

// Global instance
export const cookieManager = createCookieManager();

// Helper to set cookies safely
export const setConsentCookie = (name: string, value: string, days = 365) => {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
};

// Helper to delete cookies safely
export const deleteConsentCookie = (name: string) => {
  if (typeof document === 'undefined') return;

  // Delete with different path variations to ensure cleanup
  const paths = ['/', '/dashboard', ''];
  for (const path of paths) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};`;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path};domain=${window.location.hostname};`;
  }
};
