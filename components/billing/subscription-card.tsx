'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@clerk/nextjs';
import { CheckCircle, CreditCard, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SubscriptionData {
  plan: string;
  status: string;
  currentPeriodEnd: Date | null;
  used: number;
  limit: number;
}

const PLAN_INFO = {
  free: {
    name: 'Free',
    price: '€0',
    color: 'secondary' as const,
    icon: CheckCircle,
    features: ['150 QR codes/month', 'Basic templates', 'History tracking'],
  },
  starter: {
    name: 'Starter',
    price: '€3.99',
    color: 'default' as const,
    icon: CreditCard,
    features: [
      '500 QR codes/month',
      'API access',
      'Email support',
      'All templates',
    ],
  },
  professional: {
    name: 'Professional',
    price: '€14.99',
    color: 'default' as const,
    icon: Zap,
    features: [
      'Unlimited QR codes',
      'Priority support',
      'White-label',
      'Webhooks',
    ],
  },
};

export function SubscriptionCard() {
  const { has } = useAuth();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscriptionData() {
      try {
        const plan = 'free';

        // For now, we'll use placeholder data for usage
        // In a real implementation, this would come from the database
        const usageData = {
          used: 45,
          limit: plan === 'free' ? 150 : plan === 'starter' ? 500 : -1,
        };

        setSubscriptionData({
          plan,
          status: 'active',
          currentPeriodEnd: null,
          ...usageData,
        });
      } catch (error) {
        console.error('Error loading subscription data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptionData();
  }, []);

  if (loading) {
    return (
      <Card className="size-full shadow-xl">
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionData) {
    return null;
  }

  const planInfo = PLAN_INFO[subscriptionData.plan as keyof typeof PLAN_INFO];
  const usagePercentage =
    subscriptionData.limit === -1
      ? 0
      : Math.round((subscriptionData.used / subscriptionData.limit) * 100);

  const handleUpgrade = () => {
    // For now, this would integrate with Clerk's billing system
    // Example: clerk.billing.startCheckout({ plan: 'starter' })
    console.log('Upgrade clicked - would integrate with Clerk billing');
  };

  const Icon = planInfo.icon;

  return (
    <Card className="size-full shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle className="text-lg">{planInfo.name} Plan</CardTitle>
          </div>
          <Badge variant={planInfo.color}>
            {subscriptionData.status === 'active'
              ? 'Active'
              : subscriptionData.status}
          </Badge>
        </div>
        <CardDescription>
          {planInfo.price} {subscriptionData.plan !== 'free' && '/ month'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Section */}
        {subscriptionData.limit !== -1 && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>QR Codes Used</span>
              <span className="font-medium">
                {subscriptionData.used} / {subscriptionData.limit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            {usagePercentage > 80 && (
              <p className="text-orange-600 text-sm">
                You're approaching your monthly limit
              </p>
            )}
          </div>
        )}

        {/* Features */}
        <div>
          <h4 className="mb-2 font-medium">Features</h4>
          <ul className="space-y-1">
            {planInfo.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Upgrade Button */}
        {subscriptionData.plan === 'free' && (
          <Button onClick={handleUpgrade} className="w-full">
            Upgrade to Starter
          </Button>
        )}

        {subscriptionData.plan === 'starter' && (
          <Button onClick={handleUpgrade} variant="outline" className="w-full">
            Upgrade to Professional
          </Button>
        )}

        {subscriptionData.plan === 'professional' && (
          <div className="py-2 text-center">
            <p className="text-muted-foreground text-sm">
              You have the highest tier plan
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
