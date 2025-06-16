import type { ReactNode } from 'react';

import dynamic from 'next/dynamic';
import { Toaster } from '../ui/sonner';
import { ThemeProvider } from './theme-provider';

type ProvidersProps = {
  readonly children: ReactNode;
};

const DynamicClerkClientProvider = dynamic(() =>
  import('./clerk-client-provider').then((mod) => mod.ClerkClientProvider)
);

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <DynamicClerkClientProvider>
        {children}
        <Toaster />
      </DynamicClerkClientProvider>
    </ThemeProvider>
  );
}
