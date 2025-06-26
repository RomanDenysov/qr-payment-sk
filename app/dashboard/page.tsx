import {
  getRecentQRGenerations,
  getUserTemplates,
} from '@/app/actions/dashboard';
import { StatsLabels } from '@/components/dashboard/stats-labels';
import { FadeContainer, FadeDiv } from '@/components/motion/fade';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/format-utils';
import { cn } from '@/lib/utils';
import { CreditCardIcon, PlusIcon, QrCodeIcon } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const [templates, recentHistory] = await Promise.all([
    getUserTemplates(),
    getRecentQRGenerations({ limit: 5 }),
  ]);

  return (
    <FadeContainer className="space-y-6">
      <FadeDiv>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-medium text-2xl tracking-tight md:text-3xl">
              Dashboard
            </h1>
          </div>
          <Link
            href="/dashboard/generator"
            className={cn(buttonVariants({ size: 'sm' }))}
          >
            <PlusIcon className="size-4" />
            Vytvoriť QR kód
          </Link>
        </div>
      </FadeDiv>

      {/* Stats Overview */}
      <FadeDiv>
        <StatsLabels />
      </FadeDiv>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <FadeDiv className="lg:col-span-2">
          <Card className="size-full shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCodeIcon className="size-5" />
                Posledná aktivita
              </CardTitle>
              <CardDescription>Vaše najnovšie QR kódy</CardDescription>
            </CardHeader>
            <CardContent>
              {recentHistory.data && recentHistory.data.length > 0 ? (
                <div className="space-y-3">
                  {recentHistory.data.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {item.templateName}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(item.generatedAt).toLocaleDateString(
                            'sk-SK',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(item.amount.toString())}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {item.variableSymbol}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/history">
                    <Button variant="outline" className="mt-4 w-full">
                      Zobraziť všetko
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <QrCodeIcon className="mx-auto size-12 text-muted-foreground" />
                  <div className="mb-4">
                    <h3 className="mt-2 font-medium text-sm">Žiadne QR kódy</h3>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Začnite vytvorením vašho prvého QR kódu
                    </p>
                  </div>
                  <Link
                    href="/dashboard/generator"
                    className={cn(buttonVariants({ size: 'sm' }))}
                  >
                    <PlusIcon className="size-4" />
                    Vytvoriť QR kód
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeDiv>

        {/* QR Usage Card */}
        {/* <FadeDiv>
          <QrUsageCard />
        </FadeDiv> */}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Templates Quick Access */}
        <FadeDiv>
          <Card className="size-full shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Vaše šablóny
              </CardTitle>
              <CardDescription>
                Rýchly prístup k často používaným šablónam
              </CardDescription>
            </CardHeader>
            <CardContent>
              {templates.data && templates.data.length > 0 ? (
                <div className="space-y-3">
                  {templates.data.slice(0, 3).map((template: any) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{template.name}</p>
                        <p className="text-muted-foreground text-xs">
                          Použité {template.usageCount}×
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(template.amount.toString())}
                        </p>
                        <Link
                          href={`/dashboard/generator?template=${template.id}`}
                        >
                          <Button size="sm" variant="outline" className="mt-1">
                            Použiť
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                  <Link href="/dashboard/templates">
                    <Button variant="outline" className="mt-4 w-full">
                      Všetky šablóny
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <CreditCardIcon className="mx-auto size-12 text-muted-foreground" />
                  <div className="mb-4">
                    <h3 className="mt-2 font-medium text-sm">Žiadne šablóny</h3>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Vytvorte šablónu pre opakované platby
                    </p>
                  </div>
                  <Link
                    href="/dashboard/templates"
                    className={cn(buttonVariants({ size: 'sm' }))}
                  >
                    <PlusIcon className="size-4" />
                    Vytvoriť šablónu
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeDiv>

        {/* Quick Actions */}
        <FadeDiv className="lg:col-span-2">
          <Card className="size-full shadow-xl">
            <CardHeader>
              <CardTitle>Rýchle akcie</CardTitle>
              <CardDescription>Najčastejšie používané funkcie</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Link href="/dashboard/generator">
                <Button variant="outline" className="h-20 w-full flex-col">
                  <QrCodeIcon className="mb-2 h-6 w-6" />
                  Nový QR kód
                </Button>
              </Link>
              <Link href="/dashboard/templates">
                <Button variant="outline" className="h-20 w-full flex-col">
                  <CreditCardIcon className="mb-2 h-6 w-6" />
                  Spravovať šablóny
                </Button>
              </Link>
              <Link href="/dashboard/history">
                <Button variant="outline" className="h-20 w-full flex-col">
                  <QrCodeIcon className="mb-2 h-6 w-6" />
                  História QR kódov
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button variant="outline" className="h-20 w-full flex-col">
                  <QrCodeIcon className="mb-2 h-6 w-6" />
                  Analytika
                </Button>
              </Link>
            </CardContent>
          </Card>
        </FadeDiv>
      </div>
    </FadeContainer>
  );
}
