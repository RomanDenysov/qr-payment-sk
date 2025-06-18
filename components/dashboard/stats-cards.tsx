import { getUserStats } from '@/app/actions/dashboard';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { formatLargeNumber } from '@/lib/format-utils';

export async function StatsCards() {
  const stats = await getUserStats();

  const statItems = [
    {
      title: 'Celkovo QR kódov',
      value: formatLargeNumber(stats.totalQRs),
    },
    {
      title: 'Tento mesiac',
      value: formatLargeNumber(stats.currentMonthQRs),
    },
    {
      title: 'Šablóny',
      value: formatLargeNumber(stats.activeTemplates),
    },
    {
      title: 'Rast',
      value: `${stats.growthPercentage}%`,
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
