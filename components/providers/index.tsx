import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { ToastProvider } from './toast-provider';
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
        <ToastProvider />
      </ThemeProvider>
    </ClerkProvider>
  );
}
