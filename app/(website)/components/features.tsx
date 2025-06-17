import { FadeContainer, FadeDiv, FadeSpan } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import { CheckIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function Features() {
  return (
    <section aria-label="Features" className="w-full py-20 lg:py-40">
      <FadeContainer className="grid grid-cols-1 items-center gap-8 px-4 md:px-6">
        <div className="flex flex-col items-start gap-4 md:items-center">
          <FadeDiv>
            <Badge variant="outline">Platform</Badge>
          </FadeDiv>
          <div className="flex flex-col gap-2">
            <h2 className="max-w-xl text-left font-medium text-3xl tracking-tighter md:text-center lg:text-5xl">
              <FadeSpan>Something new!</FadeSpan>
            </h2>
            <p className="max-w-xl text-left text-lg text-muted-foreground leading-relaxed tracking-tight">
              <FadeSpan>
                Managing a small business today is already tough.
              </FadeSpan>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-12 sm:grid-cols-3">
          <FadeDiv className="group flex flex-col items-center gap-6">
            <FeatureDecorator>
              <CheckIcon className="mt-2 h-4 w-4 text-primary" />
            </FeatureDecorator>
            <div className="flex flex-col gap-1 text-center">
              <p>Easy to use</p>
              <p className="text-muted-foreground text-sm">
                We&apos;ve made it easy to use and understand.
              </p>
            </div>
          </FadeDiv>
          <FadeDiv className="group flex flex-col items-center gap-6">
            <FeatureDecorator>
              <CheckIcon className="mt-2 h-4 w-4 text-primary" />
            </FeatureDecorator>
            <div className="flex flex-col gap-1 text-center">
              <p>Fast and reliable</p>
              <p className="text-muted-foreground text-sm">
                We&apos;ve made it fast and reliable.
              </p>
            </div>
          </FadeDiv>
          <FadeDiv className="group flex flex-col items-center gap-6">
            <FeatureDecorator>
              <CheckIcon className="mt-2 h-4 w-4 text-primary" />
            </FeatureDecorator>
            <div className="flex flex-col gap-1 text-center">
              <p>Beautiful and modern</p>
              <p className="text-muted-foreground text-sm">
                We&apos;ve made it beautiful and modern.
              </p>
            </div>
          </FadeDiv>
        </div>
      </FadeContainer>
    </section>
  );
}

const FeatureDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-transparent to-75% to-background"
    />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l bg-white dark:bg-background">
      {children}
    </div>
  </div>
);
