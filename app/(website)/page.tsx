import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { Skeleton } from '@/components/ui/skeleton';
import { PricingTable } from '@clerk/nextjs';
import { Suspense } from 'react';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { Stats } from './components/stats';

// Stats loading component
function StatsLoading() {
  return (
    <section
      aria-label="Stats Loading"
      className="mx-auto w-full px-4 py-20 md:px-6"
    >
      <FadeContainer className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <FadeDiv key={i}>
            <div className="group shrink-0">
              <div className="relative mx-auto size-68 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)]">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-radial from-transparent to-75% to-background"
                />
                <div className="absolute inset-0 m-auto flex size-24 items-center justify-center border-t border-l bg-white dark:bg-background">
                  <div className="flex min-h-30 min-w-30 flex-col items-center justify-center gap-2 text-center">
                    <Skeleton className="h-16 w-20" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </FadeDiv>
        ))}
      </FadeContainer>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      {/* <QRCard /> */}
      <Suspense fallback={<StatsLoading />}>
        <Stats />
      </Suspense>
      <Features />
      <PricingTable />
    </>
  );
}
