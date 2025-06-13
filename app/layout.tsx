import type { Metadata } from 'next';
import './globals.css';
import type { ReactNode } from 'react';
import { fonts } from '~/components/fonts';
import { cn } from '~/lib/utils';
import { Providers } from '../components/providers';

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
    <html lang="sk" className={cn(fonts, 'scroll-smooth')} suppressHydrationWarning>
      <body
        className={cn(
          'relative min-h-screen overflow-x-hidden scroll-auto bg-gray-50 antialiased selection:bg-orange-100 selection:text-orange-600'
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
