import { UsersIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { FeatureGate } from './feature-gate';
import { type Template, TemplateCard } from './template-card';
import { UpgradePrompt } from './upgrade-prompt';

interface TemplatesGridProps {
  templates: Template[];
  isLoading: boolean;
  permissions: {
    canDuplicateTemplate: boolean;
    canShareTemplate: boolean;
    canCollaborate: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onGenerate: (id: string) => void;
  onUpgrade: (plan: 'business' | 'professional') => void;
}

export function TemplatesGrid({
  templates,
  isLoading,
  permissions,
  onEdit,
  onDelete,
  onDuplicate,
  onGenerate,
  onUpgrade,
}: TemplatesGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="space-y-4 p-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="border-2 border-gray-200 border-dashed">
        <CardContent className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <span className="text-2xl">📄</span>
          </div>
          <h3 className="mb-2 font-semibold text-gray-900 text-lg">
            No templates yet
          </h3>
          <p className="mb-4 text-gray-600">
            Create your first payment template to get started with QR code
            generation.
          </p>
          <Button>Create Your First Template</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collaboration Section */}
      <FeatureGate
        hasPermission={permissions.canCollaborate}
        fallback={
          <UpgradePrompt
            targetPlan="professional"
            feature="Team collaboration and advanced template management"
            onUpgrade={onUpgrade}
          />
        }
      >
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <UsersIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Team Collaboration
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Share templates with your team and collaborate on QR code
                    generation
                  </p>
                </div>
              </div>
              <Button variant="outline">Manage Team</Button>
            </div>
          </CardContent>
        </Card>
      </FeatureGate>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            permissions={permissions}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onGenerate={onGenerate}
          />
        ))}
      </div>
    </div>
  );
}
