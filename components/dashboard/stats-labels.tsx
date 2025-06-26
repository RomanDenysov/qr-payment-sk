'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/use-user';
import { formatCurrency } from '@/lib/format-utils';
import { BarChart3, CreditCard, QrCode, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserStats {
  qrCodesGenerated: number;
  templatesCreated: number;
  totalRevenue: number;
  currentPlan: string;
  usageThisMonth: number;
  usageLimit: number;
}

export function StatsLabels() {
  const user = useUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // TODO: Replace with actual API call once we have the endpoint
        // For now, show placeholder data
        const mockStats: UserStats = {
          qrCodesGenerated: 0,
          templatesCreated: 0,
          totalRevenue: 0,
          currentPlan: 'Free',
          usageThisMonth: 0,
          usageLimit: 150,
        };

        setStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!user || !stats) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-muted-foreground">
            Prihláste sa pre zobrazenie štatistík
          </p>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage =
    stats.usageLimit > 0 ? (stats.usageThisMonth / stats.usageLimit) * 100 : 0;

  const statCards = [
    {
      title: 'QR kódy',
      value: stats.qrCodesGenerated.toString(),
      description: 'Celkom vygenerovaných',
      icon: QrCode,
      change: null,
    },
    {
      title: 'Šablóny',
      value: stats.templatesCreated.toString(),
      description: 'Aktívnych šablón',
      icon: CreditCard,
      change: null,
    },
    {
      title: 'Obrat',
      value: formatCurrency((stats.totalRevenue / 100).toString()),
      description: 'Celková suma platby',
      icon: TrendingUp,
      change: null,
    },
    {
      title: 'Využitie',
      value: `${stats.usageThisMonth}/${stats.usageLimit}`,
      description: (
        <div className="flex items-center gap-2">
          <span>Tento mesiac</span>
          <Badge
            variant={usagePercentage > 80 ? 'destructive' : 'secondary'}
            className="text-xs"
          >
            {stats.currentPlan}
          </Badge>
        </div>
      ),
      icon: BarChart3,
      change: usagePercentage > 80 ? 'warning' : null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card
          key={index}
          className={stat.change === 'warning' ? 'border-amber-200' : ''}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{stat.value}</div>
            <div className="mt-1 text-muted-foreground text-xs">
              {typeof stat.description === 'string'
                ? stat.description
                : stat.description}
            </div>
            {stat.change === 'warning' && (
              <div className="mt-2">
                <Badge variant="outline" className="text-amber-600 text-xs">
                  Blížite sa k limitu
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
