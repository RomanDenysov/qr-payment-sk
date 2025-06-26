import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { Skeleton } from '@/components/ui/skeleton';
import type { ReactNode } from 'react';

export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative w-full py-20 lg:py-40">
        <FadeContainer className="grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 ">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Skeleton className="h-6 w-24" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-16 w-full max-w-md" />
              <Skeleton className="h-24 w-full max-w-xl" />
            </div>
          </div>
          <div className="group size-full md:pt-5">
            <div className="relative mx-auto h-[600px] w-full max-w-4xl">
              <Skeleton className="h-full w-full" />
            </div>
          </div>
        </FadeContainer>
      </section>

      {/* Stats skeleton */}
      <section
        aria-label="Stats Loading"
        className="mx-auto w-full px-4 py-20 "
      >
        <FadeContainer className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <FadeDiv key={i}>
              <StatsSkeleton />
            </FadeDiv>
          ))}
        </FadeContainer>
      </section>

      {/* Features skeleton */}
      <section className="mx-auto w-full px-4 py-20 ">
        <FadeContainer className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <FadeDiv key={i}>
              <FeatureSkeleton />
            </FadeDiv>
          ))}
        </FadeContainer>
      </section>
    </>
  );
}

const StatsSkeleton = () => (
  <div className="group shrink-0">
    <SkeletonDecorator>
      <div className="flex min-h-30 min-w-30 flex-col items-center justify-center gap-2 text-center">
        <Skeleton className="h-16 w-20" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </SkeletonDecorator>
  </div>
);

const FeatureSkeleton = () => (
  <div className="group shrink-0">
    <SkeletonDecorator>
      <div className="flex min-h-30 min-w-30 flex-col items-center justify-center gap-2 p-4 text-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full" />
      </div>
    </SkeletonDecorator>
  </div>
);

const SkeletonDecorator = ({ children }: { children: ReactNode }) => (
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
      {children}
    </div>
  </div>
);
