import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';

type WebsiteLayoutProps = {
  readonly children: ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-7xl px-4 md:px-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
