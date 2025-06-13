import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const activities = [
  {
    id: 1,
    type: 'qr_generated',
    title: 'Payment QR Created',
    description: 'Restaurant payment QR for €125.50',
    time: '2 minutes ago',
    status: 'success' as const,
  },
  {
    id: 2,
    type: 'transaction',
    title: 'Payment Received',
    description: 'From customer #1247 - €89.99',
    time: '15 minutes ago',
    status: 'success' as const,
  },
  {
    id: 3,
    type: 'template_used',
    title: 'Template Applied',
    description: 'Used "Restaurant Menu" template',
    time: '1 hour ago',
    status: 'info' as const,
  },
  {
    id: 4,
    type: 'qr_scanned',
    title: 'QR Code Scanned',
    description: 'Menu QR scanned 24 times today',
    time: '2 hours ago',
    status: 'info' as const,
  },
  {
    id: 5,
    type: 'bulk_upload',
    title: 'Bulk Generation',
    description: '50 QR codes generated from CSV',
    time: '3 hours ago',
    status: 'success' as const,
  },
];

export function RecentActivity() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">
          Recent Activity
        </h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Latest Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              {...activity}
              isLast={index === activities.length - 1}
            />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

type ActivityItemProps = {
  readonly type: string;
  readonly title: string;
  readonly description: string;
  readonly time: string;
  readonly status: 'success' | 'info' | 'warning' | 'error';
  readonly isLast: boolean;
};

function ActivityItem({
  type,
  title,
  description,
  time,
  status,
  isLast,
}: ActivityItemProps) {
  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'qr_generated':
        return '🎯';
      case 'transaction':
        return '💰';
      case 'template_used':
        return '📋';
      case 'qr_scanned':
        return '👁️';
      case 'bulk_upload':
        return '📤';
      default:
        return '📋';
    }
  };

  const getStatusVariant = (activityStatus: string) => {
    switch (activityStatus) {
      case 'success':
        return 'default' as const;
      case 'info':
        return 'secondary' as const;
      case 'warning':
        return 'outline' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'secondary' as const;
    }
  };

  return (
    <div
      className={`flex items-start space-x-3 ${isLast ? '' : 'border-b pb-4'}`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm">
        {getActivityIcon(type)}
      </div>
      <div className="min-w-0 flex-grow space-y-1">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium text-sm">{title}</p>
          <Badge variant={getStatusVariant(status)} className="text-xs">
            {status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
        <p className="text-muted-foreground text-xs">{time}</p>
      </div>
    </div>
  );
}
