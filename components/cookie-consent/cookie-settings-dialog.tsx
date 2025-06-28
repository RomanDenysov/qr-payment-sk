'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import type { ConsentPreferences } from '@/lib/cookie-consent/types';
import { CheckIcon, Cookie, Info, SaveIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

export function CookieSettingsDialog() {
  const {
    showSettings,
    closeSettings,
    savePreferences,
    preferences: currentPreferences,
  } = useCookieConsent();

  const [tempPreferences, setTempPreferences] =
    useState<ConsentPreferences>(currentPreferences);

  const handlePreferenceChange = (
    category: keyof ConsentPreferences,
    value: boolean
  ) => {
    setTempPreferences((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSave = async () => {
    if (savePreferences) {
      await savePreferences(tempPreferences);
    }
  };

  const handleAcceptAll = async () => {
    const allAccepted: ConsentPreferences = {
      necessary: true,
      functionality: true,
      analytics: true,
      marketing: true,
    };
    setTempPreferences(allAccepted);
    if (savePreferences) {
      await savePreferences(allAccepted);
    }
  };

  const handleRejectOptional = async () => {
    const essentialOnly: ConsentPreferences = {
      necessary: true, // Always true
      functionality: true, // Keep for better UX (theme, language)
      analytics: false,
      marketing: false,
    };
    setTempPreferences(essentialOnly);
    if (savePreferences) {
      await savePreferences(essentialOnly);
    }
  };

  return (
    <Dialog
      open={showSettings}
      onOpenChange={(open) => !open && closeSettings()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Nastavenia súborov cookie
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            {/* Essential Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Nevyhnutné súbory</span>
                  <span className="rounded bg-primary/10 px-2 py-1 text-primary text-xs">
                    Povinné
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Potrebné pre základné funkcie stránky
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            {/* Functionality Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Funkčné súbory</span>
                <p className="text-muted-foreground text-sm">
                  Téma, jazyk a vaše preferencie
                </p>
              </div>
              <Switch
                checked={tempPreferences.functionality}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('functionality', checked)
                }
              />
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Analytické súbory</span>
                <p className="text-muted-foreground text-sm">
                  Pomáhajú nám zlepšovať stránku
                </p>
              </div>
              <Switch
                checked={tempPreferences.analytics}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('analytics', checked)
                }
              />
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-medium">Marketingové súbory</span>
                <p className="text-muted-foreground text-sm">
                  Personalizované reklamy a obsah
                </p>
              </div>
              <Switch
                checked={tempPreferences.marketing}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('marketing', checked)
                }
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleAcceptAll}
              className="w-full"
            >
              <CheckIcon className="size-4" /> Prijať všetko
            </Button>
            <Button
              onClick={handleRejectOptional}
              variant="outline"
              className="w-full"
            >
              <XIcon className="size-4" /> Iba nevyhnutné
            </Button>
            <Button onClick={handleSave} variant="outline" className="w-full">
              <SaveIcon className="size-4" /> Uložiť nastavenia
            </Button>
          </div>

          {/* Legal Info */}
          <div className="flex gap-2 rounded bg-muted/50 p-3 text-muted-foreground text-xs">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>
              Analytické súbory nám pomáhajú pochopiť, ako používate našu
              stránku, aby sme ju mohli zlepšovať. Marketingové súbory sa
              používajú na zobrazovanie relevantných reklám.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
