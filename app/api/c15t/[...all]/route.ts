// Slovak-compliant consent configuration
export const SLOVAK_CONSENT_CONFIG = {
  appName: 'QR Payments SK',
  language: 'sk',
  region: 'SK',
  legalBasis: 'GDPR',
  ignoreGeoLocation: true,
  categories: {
    necessary: {
      name: 'Nevyhnutné súbory cookie',
      description:
        'Tieto súbory cookie sú nevyhnutné pre správne fungovanie webstránky a nemožno ich zakázať.',
      required: true,
      cookies: [
        {
          name: 'auth_token',
          purpose: 'Autentifikácia používateľa',
          duration: '30 dní',
        },
        {
          name: 'csrf_token',
          purpose: 'Ochrana pred CSRF útokmi',
          duration: 'Relácia',
        },
        {
          name: 'lang_pref',
          purpose: 'Jazykové nastavenia',
          duration: '1 rok',
        },
        {
          name: 'session_id',
          purpose: 'Identifikácia relácie',
          duration: 'Relácia',
        },
      ],
    },
    functional: {
      name: 'Funkčné súbory cookie',
      description:
        'Tieto súbory cookie umožňujú webstránke zapamätať si voľby, ktoré ste urobili.',
      required: false,
      cookies: [
        {
          name: 'dashboard_layout',
          purpose: 'Nastavenia rozloženia dashboard-u',
          duration: '1 rok',
        },
        {
          name: 'form_prefs',
          purpose: 'Preferencie formulárov',
          duration: '6 mesiacov',
        },
        {
          name: 'theme_preference',
          purpose: 'Nastavenie témy (svetlá/tmavá)',
          duration: '1 rok',
        },
      ],
    },
    analytics: {
      name: 'Analytické súbory cookie',
      description:
        'Tieto súbory cookie nám pomáhajú porozumieť tomu, ako návštevníci používajú webstránku.',
      required: false,
      cookies: [
        {
          name: '_ga',
          purpose: 'Google Analytics - identifikácia návštevníkov',
          duration: '2 roky',
        },
        {
          name: '_gid',
          purpose: 'Google Analytics - identifikácia relácie',
          duration: '24 hodín',
        },
        {
          name: 'ph_*',
          purpose: 'PostHog - analýza používania funkcií',
          duration: '1 rok',
        },
      ],
    },
    marketing: {
      name: 'Marketingové súbory cookie',
      description:
        'Tieto súbory cookie sa používajú na zobrazovanie relevantných reklám.',
      required: false,
      cookies: [
        {
          name: '_fbp',
          purpose: 'Facebook Pixel - sledovanie konverzií',
          duration: '3 mesiace',
        },
        {
          name: 'ads_id',
          purpose: 'Identifikátor pre reklamy',
          duration: '2 roky',
        },
      ],
    },
  },
  legalTexts: {
    banner: {
      title: 'Súbory cookie a ochrana súkromia',
      description:
        'Používame súbory cookie na zlepšenie vašej skúsenosti. Nevyhnutné súbory cookie sú potrebné pre fungovanie stránky. Ostatné vyžadujú váš súhlas.',
      acceptAll: 'Prijať všetko',
      rejectAll: 'Odmietnuť všetko',
      customize: 'Prispôsobiť',
      learnMore: 'Viac informácií',
    },
    modal: {
      title: 'Nastavenia súborov cookie',
      description:
        'Môžete si vybrať, aké kategórie súborov cookie chcete povoliť. Vaše rozhodnutie môžete kedykoľvek zmeniť.',
      save: 'Uložiť nastavenia',
      acceptAll: 'Prijať všetko',
      rejectAll: 'Odmietnuť všetko',
    },
  },
  compliance: {
    gdprApplies: true,
    consentRequired: true,
    dataRetention: {
      consent: '2 roky',
      logs: '1 rok',
    },
    rights: [
      'Právo na prístup k údajom',
      'Právo na opravu údajov',
      'Právo na vymazanie údajov',
      'Právo na prenosnosť údajov',
      'Právo odvolať súhlas',
    ],
  },
};
