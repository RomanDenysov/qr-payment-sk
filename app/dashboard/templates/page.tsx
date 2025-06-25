import { getUserTemplates } from '@/app/actions/dashboard';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Copy,
  Edit,
  MoreHorizontal,
  Palette,
  Plus,
  QrCode,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

export default async function TemplatesPage() {
  const templates = await getUserTemplates();

  return (
    <FadeContainer className="space-y-8">
      <FadeDiv>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Šablóny</h1>
            <p className="text-muted-foreground">
              Spravujte svoje uložené platobné šablóny
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/generator">
              <Plus className="mr-2 h-4 w-4" />
              Nová šablóna
            </Link>
          </Button>
        </div>
      </FadeDiv>

      {templates.data?.length === 0 ? (
        <FadeDiv>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Palette className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 font-semibold text-lg">Žiadne šablóny</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Vytvorte svoju prvú šablónu pre rýchlejšie generovanie QR
                  kódov
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/generator">
                    <Plus className="mr-2 h-4 w-4" />
                    Vytvoriť šablónu
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeDiv>
      ) : (
        <FadeDiv>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.data?.map((template) => (
              <FadeDiv key={template.id}>
                <Card className="group transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: template.color || '#3b82f6' }}
                        className="text-white"
                      >
                        {template.icon || '💳'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/generator?template=${template.id}`}
                            >
                              <QrCode className="mr-2 h-4 w-4" />
                              Generovať QR
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplikovať
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Upraviť
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Zmazať
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="font-semibold text-foreground text-lg">
                      {template.amount} EUR
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {template.description && (
                        <p className="text-muted-foreground text-sm">
                          {template.description}
                        </p>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">IBAN:</span>
                          <span className="font-mono text-xs">
                            {template.userIbanId?.slice(0, 8)}...
                            {template.userIbanId?.slice(-4)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Použité:
                          </span>
                          <Badge variant="outline">
                            {template.usageCount}×
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Vytvorené:
                          </span>
                          <span className="text-xs">
                            {new Date(template.createdAt).toLocaleDateString(
                              'sk-SK'
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link
                            href={`/dashboard/generator?template=${template.id}`}
                          >
                            <QrCode className="mr-2 h-4 w-4" />
                            Generovať QR kód
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeDiv>
            ))}
          </div>
        </FadeDiv>
      )}
    </FadeContainer>
  );
}
