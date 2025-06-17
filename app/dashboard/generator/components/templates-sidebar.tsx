'use client';

import type { DashboardTemplate } from '@/app/actions/dashboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, QrCodeIcon } from 'lucide-react';

interface TemplatesSidebarProps {
  templates: DashboardTemplate[];
}

export function TemplatesSidebar({ templates }: TemplatesSidebarProps) {
  const handleUseTemplate = (template: DashboardTemplate) => {
    // Dispatch custom event to fill the form
    const event = new CustomEvent('useTemplate', { detail: template });
    window.dispatchEvent(event);
  };

  if (templates.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Šablóny
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Nemáte žiadne uložené šablóny. Vytvorte prvú šablónu pri generovaní
            QR kódu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Šablóny ({templates.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-2 p-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="border-dashed transition-colors hover:border-solid"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm leading-none">
                          {template.name}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {template.description || 'Bez popisu'}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: template.color || '#3b82f6' }}
                        className="text-white"
                      >
                        {template.icon}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Suma:</span>
                        <span className="font-medium">
                          {template.amount} EUR
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">IBAN:</span>
                        <span className="font-mono text-xs">
                          {template.iban.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Použité:</span>
                        <span>{template.usageCount}×</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleUseTemplate(template)}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      <QrCodeIcon className="mr-2 h-3 w-3" />
                      Použiť šablónu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
