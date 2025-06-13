import type { ReactNode } from 'react';
import Header from './component/header';

export default function WebLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="relative mx-auto flex min-h-screen flex-col">
        {children}
      </main>
    </>
  );
}
