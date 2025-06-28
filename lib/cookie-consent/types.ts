export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies?: string[];
}

export interface ConsentPreferences {
  necessary: boolean;
  functionality: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentState {
  hasConsented: boolean;
  consentDate: Date | null;
  preferences: ConsentPreferences;
  version: string;
}

export interface CookieConsentContextType {
  consentState: ConsentState;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: ConsentPreferences) => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
  hasConsent: (category: keyof ConsentPreferences) => boolean;
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'necessary',
    name: 'Nevyhnutné súbory cookie',
    description:
      'Tieto súbory cookie sú nevyhnutné pre správne fungovanie webstránky a nemožno ich zakázať. Spravidla sa nastavujú len v reakcii na vaše akcie, ktoré predstavujú požiadavku na služby.',
    required: true,
    cookies: ['auth-token', 'session', 'csrf-token'],
  },
  {
    id: 'functionality',
    name: 'Funkčné súbory cookie',
    description:
      'Tieto súbory cookie umožňujú webstránke zapamätať si voľby, ktoré ste urobili (ako vaše používateľské meno, jazyk alebo región) a poskytujú rozšírené, osobnejšie funkcie.',
    required: false,
    cookies: ['language-preference', 'theme-preference', 'currency-preference'],
  },
  {
    id: 'analytics',
    name: 'Analytické súbory cookie',
    description:
      'Tieto súbory cookie nám pomáhajú porozumieť tomu, ako návštevníci používajú webstránku. Všetky informácie, ktoré tieto súbory cookie zhromažďujú, sú agregované a preto anonymné.',
    required: false,
    cookies: ['_ga', '_ga_*', 'analytics-session'],
  },
  {
    id: 'marketing',
    name: 'Marketingové súbory cookie',
    description:
      'Tieto súbory cookie sa používajú na zobrazovanie relevantných reklám návštevníkom. Môžu sa použiť na vytvorenie profilu vašich záujmov a zobrazovanie relevantných reklám na iných stránkach.',
    required: false,
    cookies: ['_fbp', '_gcl_au', 'marketing-id'],
  },
];
