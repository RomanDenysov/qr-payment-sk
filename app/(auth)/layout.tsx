import { FadeContainer } from '@/components/motion/fade';
import { Logo } from '@/components/shared/logo';
import { auth } from '@/lib/auth';
import { ChevronLeftIcon } from 'lucide-react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-6 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="dark relative z-20 flex items-center font-medium">
          <Logo>
            <ChevronLeftIcon className="size-6" />
          </Logo>
        </div>
        <div className="absolute top-4 right-4">{/* <ModeToggle /> */}</div>

        {/* TODO: Add testimonials */}
        {/* <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;QR platby nám zjednodušili komunikáciu s klientmi. Teraz
              stačí poslať QR kód a platba je vybavená za pár sekúnd.&rdquo;
            </p>
            <footer className="text-sm">Ján Novák, majiteľ e-shopu</footer>
          </blockquote>
        </div> */}
      </div>

      <div className="p-4 lg:p-8">
        <FadeContainer className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6">
          {children}
        </FadeContainer>
      </div>
    </main>
  );
}
