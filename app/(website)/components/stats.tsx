import { getPlatformStatsAction } from '@/app/actions/analytics';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { formatCurrency, formatLargeNumber } from '@/lib/format-utils';
import type { ReactNode } from 'react';

const getStatItems = (stats: {
  totalUsers: number;
  totalQrCodes: number;
  averageRevenue: string;
}) => [
  {
    title: 'Aktívni používatelia',
    value: formatLargeNumber(stats.totalUsers ?? 0),
    subtitle: 'registrovaných',
  },
  {
    title: 'Vytvorené QR kódy',
    value: formatLargeNumber(stats.totalQrCodes ?? 0),
    subtitle: 'celkovo',
  },
  {
    title: 'Priemerná hodnota',
    value: formatCurrency(stats.averageRevenue ?? '0'),
    subtitle: 'na QR kód',
  },
];

export async function Stats() {
  const statsResponse = await getPlatformStatsAction();

  // Handle error state
  if (!statsResponse.success || !statsResponse.data) {
    return (
      <section
        aria-label="Stats"
        id="stats"
        className="mx-auto w-full px-4 py-20 md:px-6"
      >
        <div className="text-center text-muted-foreground">
          <p>Statistiky sa momentálne nedajú načítať</p>
        </div>
      </section>
    );
  }

  const statItems = getStatItems(statsResponse.data);

  return (
    <section
      aria-label="Stats"
      id="stats"
      className="mx-auto w-full px-4 py-20 md:px-6"
    >
      <FadeContainer className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {statItems.map((stat, i) => (
          <FadeDiv key={`${stat.title}-${i}`}>
            <StatCard
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
            />
          </FadeDiv>
        ))}
      </FadeContainer>
    </section>
  );
}

const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) => (
  <div className="group shrink-0">
    <FeatureDecorator>
      <div className="flex min-h-14 min-w-14 flex-col items-center justify-center gap-1 text-center md:min-h-30 md:min-w-30">
        <p className="font-medium text-5xl text-stroke leading-none md:text-7xl">
          {value}
        </p>
        <h3 className="text-nowrap font-medium text-muted-foreground text-sm md:text-lg">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground/70 text-xs md:text-sm">
            {subtitle}
          </p>
        )}
      </div>
    </FeatureDecorator>
  </div>
);

const FeatureDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-34 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] md:size-68 dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:16px_16px] md:bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="absolute inset-0 bg-radial from-transparent to-75% to-background"
    />
    <div className="absolute inset-0 m-auto flex size-0.5 items-center justify-center rounded-full border-t border-l bg-white dark:bg-background">
      {children}
    </div>
  </div>
);
