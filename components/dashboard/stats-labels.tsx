import { getUserStatsAction } from '@/app/actions/analytics';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { formatCurrency, formatLargeNumber } from '@/lib/format-utils';
import { Hint } from '../shared/hint';

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
      hint: 'Celkovo vytvorených QR kódov',
    },
    {
      title: 'Priemerná hodnota',
      value: formatCurrency(stats.averageRevenue.toString()),
      hint: 'Priemerná hodnota vygenerovaných QR kódov',
    },
    {
      title: 'Šablóny',
      value: formatLargeNumber(stats.totalTemplates),
      hint: 'Celkovo vytvorených šablón',
    },
  ];

  return (
    <FadeContainer className="grid grid-cols-2 items-stretch gap-4 py-10 md:grid-cols-3">
      {statItems.map((item) => {
        return (
          <FadeDiv
            key={item.title}
            className="flex flex-col items-center justify-center"
          >
            <span className="font-bold text-4xl text-stroke leading-none">
              {item.value}
            </span>
            <Hint content={item.hint}>
              <p className="text-muted-foreground text-sm">{item.title}</p>
            </Hint>
          </FadeDiv>
        );
      })}
    </FadeContainer>
  );
}
