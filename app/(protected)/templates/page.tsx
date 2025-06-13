'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  usePermissions,
  useUpgradeFlow,
  useUsageTracking,
} from '~/hooks/use-permissions';
import type { Template } from './components/template-card';
import { TemplatesGrid } from './components/templates-grid';
import { TemplatesHeader } from './components/templates-header';
import { TemplatesSearch } from './components/templates-search';

// Mock data
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Restaurant Payment',
    description: 'Standard payment template for restaurant orders',
    amount: '25.50',
    iban: 'SK89 0200 0000 0000 1234',
    color: '#3b82f6',
    icon: '🍽️',
    usageCount: 156,
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Service Fee',
    description: 'Template for service fees and consultations',
    amount: '100.00',
    iban: 'SK89 0200 0000 0000 5678',
    color: '#10b981',
    icon: '💼',
    usageCount: 89,
    isActive: true,
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Product Purchase',
    description: 'General product purchase template',
    amount: '49.99',
    iban: 'SK89 0200 0000 0000 9012',
    color: '#f59e0b',
    icon: '🛍️',
    usageCount: 234,
    isActive: true,
    createdAt: new Date('2024-01-05'),
    lastUsed: new Date('2024-01-19'),
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage'>('name');

  // For demo purposes, we'll use 'starter' plan
  // In real app, this would come from user context/auth
  const currentPlan = 'starter';
  const { permissions, isLoading: permissionsLoading } =
    usePermissions(currentPlan);
  const { usage, isLoading: usageLoading } = useUsageTracking(currentPlan);
  const { handleUpgrade } = useUpgradeFlow();

  // Derived permissions
  const canCreateTemplate =
    usage.templates.remaining > 0 || usage.templates.limit === -1;

  // Handlers
  const handleCreateTemplate = (templateData: {
    name: string;
    description: string;
    amount: string;
    iban: string;
    color: string;
    icon: string;
  }) => {
    const newTemplate: Template = {
      id: Date.now().toString(),
      ...templateData,
      usageCount: 0,
      isActive: true,
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    setTemplates([...templates, newTemplate]);
  };

  const handleEdit = (id: string) => {
    console.log('Edit template:', id);
    toast.info('Edit functionality coming soon');
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast.success('Template deleted successfully');
  };

  const handleDuplicate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      const duplicated: Template = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        usageCount: 0,
        createdAt: new Date(),
        lastUsed: new Date(),
      };
      setTemplates([...templates, duplicated]);
      toast.success('Template duplicated successfully');
    }
  };

  const handleGenerate = (id: string) => {
    console.log('Generate QR for template:', id);
    toast.success('QR code generated successfully');
  };

  // Filter and sort templates
  const filteredTemplates = templates
    .filter(
      (template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'usage':
          return b.usageCount - a.usageCount;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <TemplatesHeader
        canCreateTemplate={canCreateTemplate}
        isLoading={permissionsLoading || usageLoading}
        usage={usage.templates}
        onCreateTemplate={handleCreateTemplate}
        onUpgrade={handleUpgrade}
      />

      {/* Search and Filters */}
      <TemplatesSearch
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

      {/* Templates Grid */}
      <TemplatesGrid
        templates={filteredTemplates}
        isLoading={permissionsLoading}
        permissions={{
          canDuplicateTemplate: permissions.canDuplicateTemplate,
          canShareTemplate: permissions.canShareTemplate,
          canCollaborate: permissions.canCollaborate,
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onGenerate={handleGenerate}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
