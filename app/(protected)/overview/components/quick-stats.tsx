import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const stats = [
  {
    title: 'Total Revenue',
    value: '€100,000',
    change: '+12.5%',
    changeType: 'positive' as const,
    description: 'vs last month',
    icon: '💰',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    title: 'Total Transactions',
    value: '1,247',
    change: '+8.2%',
    changeType: 'positive' as const,
    description: 'vs last month',
    icon: '📊',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    title: 'QR Codes Generated',
    value: '89',
    change: '+24.1%',
    changeType: 'positive' as const,
    description: 'vs last month',
    icon: '🎯',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    title: 'Active Users',
    value: '156',
    change: '-2.4%',
    changeType: 'negative' as const,
    description: 'vs last month',
    icon: '👥',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
];

export function QuickStats() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">Quick Stats</h2>
        <Badge variant="outline" className="text-xs">
          Live Data
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <QuickStatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
}

type QuickStatCardProps = {
  readonly title: string;
  readonly value: string;
  readonly change: string;
  readonly changeType: 'positive' | 'negative' | 'neutral';
  readonly description: string;
  readonly icon: string;
  readonly bgColor: string;
  readonly borderColor: string;
};

function QuickStatCard({
  title,
  value,
  change,
  changeType,
  description,
  icon,
  bgColor,
  borderColor,
}: QuickStatCardProps) {
  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return '↗️';
      case 'negative':
        return '↘️';
      default:
        return '→';
    }
  };

  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-lg ${borderColor} border-2`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div
            className={`h-10 w-10 ${bgColor} flex items-center justify-center rounded-lg text-lg shadow-sm`}
          >
            {icon}
          </div>
          <div className="text-right">
            <div
              className={`flex items-center font-medium text-sm ${getChangeColor(changeType)}`}
            >
              <span className="mr-1">{getChangeIcon(changeType)}</span>
              {change}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <CardTitle className="mb-1 font-medium text-muted-foreground text-sm">
            {title}
          </CardTitle>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-3xl tracking-tight">{value}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  );
}
