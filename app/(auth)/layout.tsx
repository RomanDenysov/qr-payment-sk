import { Logo } from '@/components/shared/logo';
import { ChevronLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="container relative grid h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="dark relative z-20 flex items-center font-medium">
          <ChevronLeftIcon className="mr-2 size-6" />
          <Logo />
        </div>
        <div className="absolute top-4 right-4">{/* <ModeToggle /> */}</div>
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
      <div className="lg:p-8">
        <AuthDecorator>
          <div className="mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-6">
            {children}
          </div>
        </AuthDecorator>
      </div>
    </main>
  );
}

const AuthDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto h-[600px] w-full max-w-[500px] duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)8%,transparent)] group-hover:bg-white/5 dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)15%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)12%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)18%,transparent)]">
    {/* Grid pattern background */}
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px]"
    />
    {/* Radial gradient overlay to fade edges */}
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-transparent via-transparent to-80% to-background"
    />
    {/* Subtle highlight in center */}
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-white/5 via-transparent to-40% to-transparent dark:from-white/3"
    />
    {/* Content container - centered card */}
    <div className="absolute inset-0">{children}</div>
  </div>
);
