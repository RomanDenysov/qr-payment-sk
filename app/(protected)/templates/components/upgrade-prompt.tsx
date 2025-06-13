'use client';

import { CrownIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

interface UpgradePromptProps {
  targetPlan: 'business' | 'professional';
  feature: string;
  currentUsage?: number;
  limit?: number;
  onUpgrade?: (plan: 'business' | 'professional') => void;
}

export function UpgradePrompt({
  targetPlan,
  feature,
  currentUsage,
  limit,
  onUpgrade,
}: UpgradePromptProps) {
  const handleUpgrade = () => {
    onUpgrade?.(targetPlan);
  };

  return (
    <Card className="border-2 border-blue-300 border-dashed bg-blue-50/50">
      <CardContent className="p-6 text-center">
        <CrownIcon className="mx-auto mb-4 h-12 w-12 text-blue-500" />
        <h3 className="mb-2 font-semibold text-gray-900 text-lg">
          Upgrade to {targetPlan === 'business' ? 'Business' : 'Professional'}
        </h3>
        <p className="mb-4 text-gray-600 text-sm">
          {feature} is available in our {targetPlan} plan.
          {currentUsage !== undefined && limit !== undefined && (
            <>
              {' '}
              You've used {currentUsage} of {limit} templates.
            </>
          )}
        </p>
        <Button onClick={handleUpgrade} className="w-full">
          Upgrade Now - €{targetPlan === 'business' ? '5.99' : '16.99'}/month
        </Button>
      </CardContent>
    </Card>
  );
}
