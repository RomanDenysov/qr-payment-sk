'use client';

import { useCookieConsentStore } from '@/lib/cookie-consent/store';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize Google Analytics only if consent is given
export function initializeGA() {
  if (!GA_TRACKING_ID) return;

  const consentState = useCookieConsentStore.getState();

  if (!consentState.preferences.analytics) {
    console.log('Google Analytics blocked - no analytics consent');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });

  console.log('Google Analytics initialized with consent');
}

// Track page views
export function trackPageView(url: string) {
  const consentState = useCookieConsentStore.getState();

  if (!consentState.preferences.analytics || !GA_TRACKING_ID) return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
}

// Track custom events
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  const consentState = useCookieConsentStore.getState();

  if (!consentState.preferences.analytics || !GA_TRACKING_ID) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

// QR Code specific tracking
export function trackQRCodeGeneration(
  method: 'anonymous' | 'authenticated',
  templateId?: string
) {
  trackEvent('qr_code_generated', 'qr_generation', method, templateId ? 1 : 0);
}

export function trackQRCodeDownload(format: 'png' | 'svg' | 'pdf') {
  trackEvent('qr_code_downloaded', 'qr_generation', format);
}

// Handle consent changes
export function handleAnalyticsConsentChange(hasConsent: boolean) {
  if (hasConsent && !window.gtag) {
    // Initialize GA if consent is granted
    initializeGA();
  } else if (!hasConsent && window.gtag) {
    // Disable GA if consent is withdrawn
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
    });

    // Clear GA cookies
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name] = cookie.split('=');
      if (name.trim().startsWith('_ga')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
      }
    }
  }
}
