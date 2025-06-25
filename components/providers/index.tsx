import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Provider as WBProvider } from 'react-wrap-balancer';
import { Toaster } from '../ui/sonner';
import { TooltipProvider } from '../ui/tooltip';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
  readonly children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <WBProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </WBProvider>
        <Toaster />
      </ThemeProvider>
    </NuqsAdapter>
  );
}
