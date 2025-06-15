import type { Metadata } from 'next';
import './globals.css';

import { fonts } from '@/components/fonts';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: {
    default: 'QR Payments SK',
    template: '%s | QR Payments SK',
  },
  description:
    'Prijímajte platby jednoducho pomocou QR kódov kompatibilných so všetkými bankami na Slovensku.',
  icons: {
    icon: '/favicon.ico',
  },
};

type RootLayoutProps = {
  readonly children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={cn(fonts, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <body className="relative">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
