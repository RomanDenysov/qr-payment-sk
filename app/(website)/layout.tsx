import type { ReactNode } from 'react';

type WebsiteLayoutProps = {
  readonly children: ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      {children}
    </main>
  );
}
