import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const actions = [
  {
    title: 'Create from Template',
    description: 'Use pre-made templates to quickly generate QR codes',
    buttonText: 'Browse Templates',
    variant: 'default' as const,
    badge: 'Popular',
    badgeVariant: 'default' as const,
  },
  {
    title: 'Quick Payment QR',
    description: 'Generate a payment QR code in seconds',
    buttonText: 'Generate Now',
    variant: 'outline' as const,
    badge: 'Fast',
    badgeVariant: 'secondary' as const,
  },
  {
    title: 'Bulk QR Generation',
    description: 'Create multiple QR codes at once from CSV',
    buttonText: 'Upload CSV',
    variant: 'outline' as const,
    badge: 'Pro',
    badgeVariant: 'destructive' as const,
  },
  {
    title: 'Analytics Dashboard',
    description: 'View detailed analytics for your QR codes',
    buttonText: 'View Analytics',
    variant: 'outline' as const,
    badge: 'New',
    badgeVariant: 'default' as const,
  },
];

export function QuickActions() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">Quick Actions</h2>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <QuickActionCard key={action.title} {...action} />
        ))}
      </div>
    </section>
  );
}

type QuickActionCardProps = {
  readonly title: string;
  readonly description: string;
  readonly buttonText: string;
  readonly variant: 'default' | 'outline';
  readonly badge: string;
  readonly badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
};

function QuickActionCard({
  title,
  description,
  buttonText,
  variant,
  badge,
  badgeVariant,
}: QuickActionCardProps) {
  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant={badgeVariant} className="text-xs">
            {badge}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        <Button
          variant={variant}
          size="sm"
          className="w-full transition-shadow group-hover:shadow-sm"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
