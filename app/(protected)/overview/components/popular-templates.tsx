import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const templates = [
  {
    id: 1,
    name: 'Restaurant Menu',
    description: 'Perfect for restaurants and cafes to display digital menus',
    uses: 234,
    category: 'Food & Beverage',
    image: '🍽️',
  },
  {
    id: 2,
    name: 'Payment Request',
    description: 'Simple payment QR for quick transactions',
    uses: 189,
    category: 'Finance',
    image: '💳',
  },
  {
    id: 3,
    name: 'Event Ticket',
    description: 'Digital tickets for events and conferences',
    uses: 156,
    category: 'Events',
    image: '🎟️',
  },
  {
    id: 4,
    name: 'Contact Card',
    description: 'Share contact information instantly',
    uses: 98,
    category: 'Business',
    image: '👤',
  },
];

export function PopularTemplates() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl tracking-tight">
          Popular Templates
        </h2>
        <Button variant="ghost" size="sm">
          Browse All
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <TemplateCard key={template.id} {...template} />
        ))}
      </div>
    </section>
  );
}

type TemplateCardProps = {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly uses: number;
  readonly category: string;
  readonly image: string;
};

function TemplateCard({
  name,
  description,
  uses,
  category,
  image,
}: TemplateCardProps) {
  return (
    <Card className="group cursor-pointer transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
              {image}
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base">{name}</CardTitle>
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Used {uses} times
          </span>
          <Button
            variant="outline"
            size="sm"
            className="transition-shadow group-hover:shadow-sm"
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
