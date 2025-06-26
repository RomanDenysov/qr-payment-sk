import { env } from '@/env';
import type { ConsentManagerOptions } from '@c15t/nextjs';

export const c15tConfig: ConsentManagerOptions = {
  mode: 'c15t',
  backendURL: env.NEXT_PUBLIC_C15T_URL,
  ignoreGeoLocation: true,
  //   region: {
  //     SK: {
  //       mode: 'opt-in',
  //       showCloseButton: true,
  //       equalButtons: true,
  //       consentValidDays: 365,
  //       blockingMode: 'auto',
  //       requiredCategories: ['necessary'],
  //       categories: {
  //         necessary: { required: true },
  //       },
  //     },
  //   },
  consentCategories: ['necessary', 'functionality', 'measurement', 'marketing'],
  translations: {
    translations: {
      sk: {
        common: {
          acceptAll: 'Prijať všetko',
          rejectAll: 'Odmietnuť všetko',
          customize: 'Prispôsobiť',
          save: 'Uložiť nastavenia',
        },
        cookieBanner: {
          title: 'Súbory cookie a ochrana súkromia',
          description:
            'Používame súbory cookie na zlepšenie vašej skúsenosti. Nevyhnutné súbory cookie sú potrebné pre fungovanie stránky. Ostatné vyžadujú váš súhlas.',
        },
        consentManagerDialog: {
          title: 'Nastavenia súborov cookie',
          description:
            'Môžete si vybrať, aké kategórie súborov cookie chcete povoliť. Vaše rozhodnutie môžete kedykoľvek zmeniť.',
        },
        consentTypes: {
          necessary: {
            title: 'Nevyhnutné súbory cookie',
            description:
              'Tieto súbory cookie sú nevyhnutné pre správne fungovanie webstránky a nemožno ich zakázať. Spravidla sa nastavujú len v reakcii na vaše akcie, ktoré predstavujú požiadavku na služby.',
          },
          functionality: {
            title: 'Funkčné súbory cookie',
            description:
              'Tieto súbory cookie umožňujú webstránke zapamätať si voľby, ktoré ste urobili (ako vaše používateľské meno, jazyk alebo región, v ktorom sa nachádzate) a poskytujú rozšírené, osobnejšie funkcie.',
          },
          measurement: {
            title: 'Analytické súbory cookie',
            description:
              'Tieto súbory cookie nám pomáhajú porozumieť tomu, ako návštevníci používajú webstránku. Všetky informácie, ktoré tieto súbory cookie zhromažďujú, sú agregované a preto anonymné.',
          },
          marketing: {
            title: 'Marketingové súbory cookie',
            description:
              'Tieto súbory cookie sa používajú na zobrazovanie relevantných reklám návštevníkom. Môžu sa použiť na vytvorenie profilu vašich záujmov a zobrazovanie relevantných reklám na iných stránkach.',
          },
        },
      },
    },
    defaultLanguage: 'sk',
  },
  //   legalLinks: {
  //     privacyPolicy: '/pravne/ochrana-sukromia',
  //     cookiePolicy: '/pravne/zasady-cookies',
  //     termsOfService: '/pravne/obchodne-podmienky',
  //   },
  //   compliance: {
  //     gdprApplies: true,
  //     jurisdiction: 'Slovakia',
  //     dataRetention: {
  //       consent: 730, // 2 years in days
  //       logs: 365, // 1 year in days
  //     },
  //   },
  //   cookieExpiry: 730, // 2 years in days
  //   showDeclineAll: true,
  //   react: {
  //     theme: {
  //       'banner.root': {
  //         backgroundColor: 'hsl(var(--background))',
  //         borderRadius: '8px',
  //       },
  //       'dialog.root': {
  //         backgroundColor: 'hsl(var(--background))',
  //         borderRadius: '8px',
  //       },
  //       'widget.root': {
  //         backgroundColor: 'hsl(var(--background))',
  //         borderRadius: '8px',
  //       },
  //     },
  //   },
};
