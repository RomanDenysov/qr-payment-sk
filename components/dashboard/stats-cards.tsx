import type { UserStats } from '@/app/actions/dashboard';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatLargeNumber } from '@/lib/format-utils';
import {
  CreditCardIcon,
  QrCodeIcon,
  TrendingUpIcon,
  UsersIcon,
} from 'lucide-react';

interface StatsCardsProps {
  stats: UserStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      title: 'Celkovo QR kódov',
      value: formatLargeNumber(stats.totalQrCodes),
      description: 'vytvorených kódov',
      icon: QrCodeIcon,
      color: 'text-blue-600',
    },
    {
      title: 'Tento mesiac',
      value: formatLargeNumber(stats.monthlyQrCodes),
      description: `z ${stats.usageLimit === -1 ? '∞' : formatLargeNumber(stats.usageLimit)} dostupných`,
      icon: TrendingUpIcon,
      color: 'text-green-600',
    },
    {
      title: 'Šablóny',
      value: formatLargeNumber(stats.totalTemplates),
      description: 'aktívnych šablón',
      icon: CreditCardIcon,
      color: 'text-purple-600',
    },
    {
      title: 'Celková suma',
      value: formatCurrency(stats.totalAmount),
      description: 'spracovaných platieb',
      icon: UsersIcon,
      color: 'text-orange-600',
    },
  ];

  return (
    <FadeContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <FadeDiv key={item.title}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="font-medium text-muted-foreground text-sm">
                  {item.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{item.value}</div>
                <p className="text-muted-foreground text-xs">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </FadeDiv>
        );
      })}
    </FadeContainer>
  );
}
