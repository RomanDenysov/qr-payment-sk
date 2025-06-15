import type { ReactNode } from 'react';
import { Header } from './components/header';

type WebsiteLayoutProps = {
  readonly children: ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto w-full max-w-7xl px-4">
        {children}
      </main>
    </>
  );
}
