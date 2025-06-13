'use client';

import {
  CopyIcon,
  EditIcon,
  MoreVerticalIcon,
  PlayIcon,
  TrashIcon,
  UsersIcon,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { FeatureGate } from './feature-gate';

export interface Template {
  id: string;
  name: string;
  description: string;
  amount: string;
  iban: string;
  color: string;
  icon: string;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  lastUsed: Date;
}

interface TemplateCardProps {
  template: Template;
  permissions: {
    canDuplicateTemplate: boolean;
    canShareTemplate: boolean;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onGenerate: (id: string) => void;
}

export function TemplateCard({
  template,
  permissions,
  onEdit,
  onDelete,
  onDuplicate,
  onGenerate,
}: TemplateCardProps) {
  return (
    <Card className="group transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg text-white"
              style={{ backgroundColor: template.color }}
            >
              {template.icon}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">{template.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  €{template.amount}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {template.usageCount} uses
                </Badge>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(template.id)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <FeatureGate
                hasPermission={permissions.canDuplicateTemplate}
                fallback={
                  <DropdownMenuItem disabled>
                    <CopyIcon className="mr-2 h-4 w-4" />
                    Duplicate (Business+)
                  </DropdownMenuItem>
                }
              >
                <DropdownMenuItem onClick={() => onDuplicate(template.id)}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
              </FeatureGate>
              <FeatureGate
                hasPermission={permissions.canShareTemplate}
                fallback={
                  <DropdownMenuItem disabled>
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Share (Business+)
                  </DropdownMenuItem>
                }
              >
                <DropdownMenuItem>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
              </FeatureGate>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(template.id)}
                className="text-red-600 focus:text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {template.description}
        </p>
        <div className="space-y-2 text-muted-foreground text-xs">
          <div>IBAN: {template.iban}</div>
          <div className="flex items-center justify-between">
            <span>Created: {template.createdAt.toLocaleDateString()}</span>
            <span>Last used: {template.lastUsed.toLocaleDateString()}</span>
          </div>
        </div>
        <Button
          onClick={() => onGenerate(template.id)}
          className="w-full"
          size="sm"
        >
          <PlayIcon className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
