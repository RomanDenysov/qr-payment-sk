import type { ReactNode } from 'react';

import { ClerkProvider } from '@clerk/nextjs';

type ProvidersProps = {
  readonly children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
