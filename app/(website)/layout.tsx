import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';

type WebsiteLayoutProps = {
  readonly children: ReactNode;
};

export default async function WebsiteLayout({ children }: WebsiteLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isSignedIn = !!session;

  return (
    <>
      <Header isSignedIn={isSignedIn} />
      <main className="container mx-auto max-w-7xl px-4">{children}</main>
      <Footer />
    </>
  );
}
