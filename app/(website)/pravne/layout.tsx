import { FadeContainer } from '@/components/motion/fade';
import type { ReactNode } from 'react';

const LegalDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative min-h-screen w-full max-w-screen [--color-border:color-mix(in_oklab,var(--color-zinc-950)8%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)12%,transparent)]">
    {/* Grid pattern background */}
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:32px_32px]"
    />
    {/* Radial gradient overlay to fade edges */}
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-transparent via-transparent to-85% to-background"
    />
    {/* Subtle highlight in center */}
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-white/5 via-transparent to-40% to-transparent dark:from-white/3"
    />
    {/* Content container */}
    <div className="relative">{children}</div>
  </div>
);

export default function PravneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LegalDecorator>
      <FadeContainer className="container mx-auto max-w-5xl py-8 sm:px-4">
        {children}
      </FadeContainer>
    </LegalDecorator>
  );
}
