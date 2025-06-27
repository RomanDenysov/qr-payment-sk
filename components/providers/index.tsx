import { getUser } from '@/app/actions/users';
import { env } from '@/env';
import { HypertuneProvider } from '@/generated/hypertune.react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Provider as WBProvider } from 'react-wrap-balancer';
import { ShowQrDrawer } from '../show-qr-drawer';
import { Toaster } from '../ui/sonner';
import { TooltipProvider } from '../ui/tooltip';
import { ThemeProvider } from './theme-provider';

// Modal provider component
function ModalProvider() {
  return <ShowQrDrawer />;
}

type ProvidersProps = {
  readonly children: ReactNode;
};

export async function Providers({ children }: ProvidersProps) {
  const user = await getUser();

  console.log(user);

  return (
    <HypertuneProvider
      createSourceOptions={{
        token: env.QRPAYMENTS_NEXT_PUBLIC_HYPERTUNE_TOKEN,
        initData: undefined,
      }}
      rootArgs={{
        context: {
          user: {
            id: user?.id ?? '',
            name: user?.name ?? '',
            email: user?.email ?? '',
          },
          environment: env.NODE_ENV,
        },
      }}
    >
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WBProvider>
            <TooltipProvider>
              {children}
              <ModalProvider />
            </TooltipProvider>
          </WBProvider>
          <Toaster />
        </ThemeProvider>
      </NuqsAdapter>
    </HypertuneProvider>
  );
}
