import { getUserStatsAction } from '@/app/actions/analytics';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { formatCurrency, formatLargeNumber } from '@/lib/format-utils';

/**
 * Simple user dashboard stats with proper animations
 */
export async function StatsLabels() {
  const result = await getUserStatsAction();

  if (result.serverError || !result.data) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        Štatistiky sa nepodarilo načítať.
      </div>
    );
  }

  const stats = result.data;

  const statItems = [
    {
      title: 'Celkovo QR kódov',
      value: formatLargeNumber(stats.totalQrCodes),
    },
    {
      title: 'Priemerná hodnota',
      value: formatCurrency(stats.averageRevenue.toString()),
    },
    {
      title: 'Šablóny',
      value: formatLargeNumber(stats.totalTemplates),
    },
  ];

  return (
    <FadeContainer className="grid grid-cols-2 items-stretch gap-4 py-10 md:grid-cols-4">
      {statItems.map((item) => {
        return (
          <FadeDiv
            key={item.title}
            className="flex flex-col items-center justify-center"
          >
            <span className="font-bold text-3xl text-stroke leading-none">
              {item.value}
            </span>
            <p className="text-muted-foreground text-xs">{item.title}</p>
          </FadeDiv>
        );
      })}
    </FadeContainer>
  );
}
