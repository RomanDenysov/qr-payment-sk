'use client';

import { Button } from '@/components/ui/button';
import { useCookieConsentStore } from '@/lib/cookie-consent/store';
import { CookieIcon } from 'lucide-react';

export function CookieSettingsWidget() {
  const { hasConsented, openSettings } = useCookieConsentStore();

  // Only show widget if user has consented (so they can change settings)
  if (!hasConsented) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        onClick={openSettings}
        size="sm"
        variant="outline"
        className="rounded-full bg-background/95 backdrop-blur hover:bg-accent supports-[backdrop-filter]:bg-background/60"
        aria-label="Nastavenia súborov cookie"
      >
        <CookieIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
