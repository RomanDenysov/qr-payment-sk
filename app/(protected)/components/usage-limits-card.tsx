import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { cn } from '~/lib/utils';

type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'enterprise';

interface UsageLimitsCardProps {
  plan?: SubscriptionPlan;
  paymentsUsed?: number;
  paymentsLimit?: number;
  apiCallsUsed?: number;
  apiCallsLimit?: number;
}

const planConfig = {
  free: {
    title: 'Free plán',
    color: 'bg-gray-600',
    upgradeText: 'Prejsť na Basic',
  },
  basic: {
    title: 'Basic plán',
    color: 'bg-orange-600',
    upgradeText: 'Prejsť na Pro',
  },
  pro: {
    title: 'Pro plán',
    color: 'bg-blue-600',
    upgradeText: 'Prejsť na Enterprise',
  },
  enterprise: {
    title: 'Enterprise plán',
    color: 'bg-purple-600',
    upgradeText: 'Kontaktovať predaj',
  },
};

export function UsageLimitsCard({
  plan = 'basic',
  paymentsUsed = 45,
  paymentsLimit = 100,
  apiCallsUsed = 2340,
  apiCallsLimit = 5000,
}: UsageLimitsCardProps) {
  const config = planConfig[plan];
  const paymentsPercent = (paymentsUsed / paymentsLimit) * 100;
  const apiPercent = (apiCallsUsed / apiCallsLimit) * 100;

  // Free plan - very minimal
  if (plan === 'free') {
    return (
      <Card className="py-4">
        <CardHeader className="px-4">
          <CardTitle className="mt-1 text-sm">Limity</CardTitle>
          <CardAction>
            <Badge
              className={cn(
                config.color,
                'border-none font-semibold text-white text-xs'
              )}
            >
              {config.title}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="px-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Platby</span>
                <span>
                  {paymentsUsed}/{paymentsLimit}
                </span>
              </div>
              <Progress value={paymentsPercent} className="h-1" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4">
          <Button size="sm" className="w-full text-xs">
            {config.upgradeText}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Basic plan - compact with essential info
  if (plan === 'basic') {
    return (
      <Card className="py-4">
        <CardHeader className="px-4">
          <CardTitle className="mt-1 text-sm">Limity</CardTitle>
          <CardAction>
            <Badge
              className={cn(
                config.color,
                'border-none font-semibold text-white text-xs'
              )}
            >
              {config.title}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="px-4">
          <div className="space-y-3">
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>Platby</span>
                  <span>
                    {paymentsUsed}/{paymentsLimit}
                  </span>
                </div>
                <Progress value={paymentsPercent} className="h-1.5" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span>API volania</span>
                  <span>
                    {apiCallsUsed.toLocaleString()}/
                    {apiCallsLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={apiPercent} className="h-1.5" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4">
          <Button variant="outline" size="sm" className="w-full text-xs">
            {config.upgradeText}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Pro plan - more detailed
  if (plan === 'pro') {
    return (
      <Card className="py-4">
        <CardHeader className="px-4">
          <CardTitle className="mt-1 text-sm">Limity</CardTitle>
          <CardAction>
            <Badge
              className={cn(
                config.color,
                'border-none font-semibold text-white text-xs'
              )}
            >
              {config.title}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="px-4">
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>Mesačné platby</span>
                <span className="font-medium">
                  {paymentsUsed}/{paymentsLimit}
                </span>
              </div>
              <Progress value={paymentsPercent} className="h-2" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span>API volania</span>
                <span className="font-medium">
                  {apiCallsUsed.toLocaleString()}/
                  {apiCallsLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={apiPercent} className="h-2" />
            </div>
            <div className="border-t pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Obnovenie:</span>
                <span>15. mar 2024</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-4">
          <Button variant="outline" size="sm" className="w-full text-xs">
            {config.upgradeText}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Enterprise plan - most detailed
  return (
    <Card className="py-4">
      <CardHeader className="px-4">
        <CardTitle className="mt-1 text-sm">Limity</CardTitle>
        <CardAction>
          <Badge
            className={cn(
              config.color,
              'border-none font-semibold text-white text-xs'
            )}
          >
            {config.title}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>Mesačné platby</span>
              <span className="font-medium">
                {paymentsUsed}/{paymentsLimit}
              </span>
            </div>
            <Progress value={paymentsPercent} className="h-2" />
            <p className="mt-1 text-muted-foreground text-xs">
              {paymentsLimit - paymentsUsed} zostáva
            </p>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>API volania</span>
              <span className="font-medium">
                {apiCallsUsed.toLocaleString()}/{apiCallsLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={apiPercent} className="h-2" />
            <p className="mt-1 text-muted-foreground text-xs">
              {(apiCallsLimit - apiCallsUsed).toLocaleString()} zostáva
            </p>
          </div>
          <div className="space-y-1 border-t pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Aktuálny plán:</span>
              <span className={`font-medium ${config.color}`}>
                {config.title}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Obnovenie:</span>
              <span>15. mar 2024</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          {config.upgradeText}
        </Button>
      </CardFooter>
    </Card>
  );
}
