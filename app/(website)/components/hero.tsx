import { FadeContainer, FadeDiv, FadeSpan } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import type { ReactNode } from 'react';
import Balancer from 'react-wrap-balancer';
import { QRCard } from './qr-card';

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="Hlavná sekcia"
      className="relative w-full py-20 lg:py-40"
    >
      <FadeContainer className="grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <FadeDiv>
            <Badge variant="outline">
              <span className="mr-1 size-2.5 rounded-full bg-green-400" />
              Sme online!
            </Badge>
          </FadeDiv>
          <div className="flex flex-col gap-4">
            <h1 className="text-center font-medium text-5xl tracking-tighter sm:text-7xl sm:leading-[4.5rem] md:text-left">
              <Balancer>
                <FadeSpan className="text-nowrap">Okamžité prevody s</FadeSpan>
                <br />
                <FadeSpan className="text-stroke">QR Platby</FadeSpan>
              </Balancer>
            </h1>
            <p className="max-w-xl text-balance text-center text-base text-muted-foreground tracking-tight sm:text-xl md:text-left">
              <FadeSpan>Generátor BySquare QR kódov pre váš biznis.</FadeSpan>
              <br />
              <FadeSpan>Jednoducho, rýchlo, spoľahlivo</FadeSpan>{' '}
              <FadeSpan>– bez chýb, bez čakania,</FadeSpan>{' '}
              <FadeSpan>bez komplikácií.</FadeSpan>
            </p>
          </div>
        </div>

        <FadeDiv className="group size-full md:pt-5">
          <HeroDecorator>
            <QRCard />
          </HeroDecorator>
        </FadeDiv>
      </FadeContainer>
    </section>
  );
}

const HeroDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto h-[600px] w-full max-w-4xl duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)8%,transparent)] group-hover:bg-white/5 dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)15%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)12%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)18%,transparent)]">
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
    <div className="absolute inset-0 flex items-center justify-center p-12">
      {children}
    </div>
  </div>
);
