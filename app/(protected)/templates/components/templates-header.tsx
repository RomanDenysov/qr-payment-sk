'use client';

import { PlusIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { CreateTemplateDialog } from './create-template-dialog';
import { FeatureGate } from './feature-gate';
import { UpgradePrompt } from './upgrade-prompt';
import { UsageIndicator } from './usage-indicator';

interface TemplatesHeaderProps {
  canCreateTemplate: boolean;
  isLoading: boolean;
  usage: {
    current: number;
    limit: number;
    remaining: number;
  };
  onCreateTemplate: (template: {
    name: string;
    description: string;
    amount: string;
    iban: string;
    color: string;
    icon: string;
  }) => void;
  onUpgrade: (plan: 'business' | 'professional') => void;
}

export function TemplatesHeader({
  canCreateTemplate,
  isLoading,
  usage,
  onCreateTemplate,
  onUpgrade,
}: TemplatesHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">Payment Templates</h1>
        <FeatureGate
          hasPermission={canCreateTemplate}
          isLoading={isLoading}
          fallback={
            <Button disabled>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Template (Limit Reached)
            </Button>
          }
        >
          <CreateTemplateDialog onCreateTemplate={onCreateTemplate}>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </CreateTemplateDialog>
        </FeatureGate>
      </div>

      <Card>
        <CardContent className="p-6">
          <UsageIndicator
            current={usage.current}
            limit={usage.limit}
            remaining={usage.remaining}
          />
        </CardContent>
      </Card>

      {!canCreateTemplate && usage.limit !== -1 && (
        <UpgradePrompt
          targetPlan="business"
          feature="Create more templates and unlock advanced features"
          currentUsage={usage.current}
          limit={usage.limit}
          onUpgrade={onUpgrade}
        />
      )}
    </div>
  );
}
