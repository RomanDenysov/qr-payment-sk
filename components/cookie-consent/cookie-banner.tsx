'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { CheckIcon, Cookie, Settings, X, XIcon } from 'lucide-react';
import Link from 'next/link';

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings, closeBanner } =
    useCookieConsent();

  // Don't render anything if banner shouldn't show
  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl border bg-background/95 p-6 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-start gap-4">
          {/* Cookie Icon */}
          <div className="flex-shrink-0">
            <Cookie className="h-6 w-6 text-primary" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                Súbory cookie a ochrana súkromia
              </h3>
              <p className="mt-2 text-muted-foreground text-sm">
                Používame súbory cookie na zlepšenie vašej skúsenosti na našej
                webstránke. Nevyhnutné súbory cookie sú potrebné pre správne
                fungovanie stránky a nemožno ich zakázať. Ostatné kategórie
                súborov cookie vyžadujú váš súhlas.
              </p>
              <p className="mt-2 text-muted-foreground text-xs">
                Prečítajte si našu{' '}
                <Link
                  href="/pravne/ochrana-sukromia"
                  className="underline hover:no-underline"
                >
                  Politiku ochrany súkromia
                </Link>{' '}
                a{' '}
                <Link
                  href="/pravne/zasady-cookies"
                  className="underline hover:no-underline"
                >
                  Zásady používania súborov cookie
                </Link>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  onClick={async () => await rejectAll()}
                  variant="outline"
                  size="sm"
                >
                  <XIcon className="size-4" /> Odmietnuť všetko
                </Button>
                <Button onClick={openSettings} variant="ghost" size="sm">
                  <Settings className="size-4" />
                  Prispôsobiť
                </Button>
              </div>
              <Button
                onClick={async () => await acceptAll()}
                size="sm"
                variant="outline"
                className="ml-auto w-full sm:w-auto"
              >
                <CheckIcon className="size-4" /> Prijať všetko
              </Button>
            </div>
          </div>

          {/* Close Button - Required by Slovak law */}
          <Button
            onClick={closeBanner}
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            aria-label="Zavrieť banner"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
