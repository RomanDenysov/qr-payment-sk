import {
  formatCurrency,
  formatLargeNumber,
  getPlatformStats,
} from '@/app/actions/stats';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import type { ReactNode } from 'react';

const getStatItems = (stats: {
  totalUsers: number;
  totalQrCodes: number;
  totalTemplates: number;
  totalRevenue: string;
}) => [
  {
    title: 'Aktívni používatelia',
    value: formatLargeNumber(stats.totalUsers),
    subtitle: 'registrovaných',
  },
  {
    title: 'Vytvorené QR kódy',
    value: formatLargeNumber(stats.totalQrCodes),
    subtitle: 'celkovo',
  },
  {
    title: 'Platobné šablóny',
    value: formatLargeNumber(stats.totalTemplates),
    subtitle: 'vytvorených',
  },
  {
    title: 'Celkový obrat',
    value: formatCurrency(stats.totalRevenue),
    subtitle: 'spracovaný',
  },
];

export async function Stats() {
  const statsResponse = await getPlatformStats();

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
      <FadeContainer className="grid grid-cols-1 gap-8 md:grid-cols-4">
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
      <div className="flex min-h-30 min-w-30 flex-col items-center justify-center gap-1 text-center">
        <p className="font-medium text-7xl text-stroke leading-none">{value}</p>
        <h3 className="text-nowrap font-medium text-lg text-muted-foreground">
          {title}
        </h3>
        {subtitle && (
          <p className="text-muted-foreground/70 text-sm">{subtitle}</p>
        )}
      </div>
    </FeatureDecorator>
  </div>
);

const FeatureDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-68 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] dark:group-hover:bg-white/5 group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
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
