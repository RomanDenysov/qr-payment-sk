import type { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from '../ui/sonner';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
  readonly children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  );
}
