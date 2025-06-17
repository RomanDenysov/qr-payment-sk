import {
  getQrHistory,
  getUserStats,
  getUserTemplates,
} from '@/app/actions/dashboard';
import { SubscriptionCard } from '@/components/billing/subscription-card';
import { StatsCards } from '@/components/dashboard/stats-cards';
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
import { formatCurrency } from '@/lib/format-utils';
import { CreditCardIcon, PlusIcon, QrCodeIcon } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const [stats, templates, recentHistory] = await Promise.all([
    getUserStats(),
    getUserTemplates(),
    getQrHistory(5), // Get last 5 QR generations
  ]);

  return (
    <FadeContainer className="space-y-8">
      <FadeDiv>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Prehľad vašich QR kódov a šablón
            </p>
          </div>
          <Link href="/dashboard/generator">
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Vytvoriť QR kód
            </Button>
          </Link>
        </div>
      </FadeDiv>

      {/* Stats Overview */}
      <FadeDiv>
        <StatsCards stats={stats} />
      </FadeDiv>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <FadeDiv className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCodeIcon className="h-5 w-5" />
                Posledná aktivita
              </CardTitle>
              <CardDescription>Vaše najnovšie QR kódy</CardDescription>
            </CardHeader>
            <CardContent>
              {recentHistory.length > 0 ? (
                <div className="space-y-3">
                  {recentHistory.map((item) => (
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
                          {formatCurrency(item.amount)}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {item.status}
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
                  <QrCodeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 font-medium text-sm">Žiadne QR kódy</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Začnite vytvorením vašho prvého QR kódu
                  </p>
                  <Link href="/dashboard/generator">
                    <Button className="mt-4">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Vytvoriť QR kód
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeDiv>

        {/* Subscription Card */}
        <FadeDiv>
          <SubscriptionCard />
        </FadeDiv>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Templates Quick Access */}
        <FadeDiv>
          <Card>
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
              {templates.length > 0 ? (
                <div className="space-y-3">
                  {templates.slice(0, 3).map((template) => (
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
                          {formatCurrency(template.amount)}
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
                  <CreditCardIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 font-medium text-sm">Žiadne šablóny</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Vytvorte šablónu pre opakované platby
                  </p>
                  <Link href="/dashboard/templates">
                    <Button className="mt-4">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Vytvoriť šablónu
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeDiv>

        {/* Placeholder for future feature */}
        <FadeDiv>
          <Card>
            <CardHeader>
              <CardTitle>Nastavenia účtu</CardTitle>
              <CardDescription>
                Spravujte svoje účtovné údaje a predvoľby
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/dashboard/settings">
                  <Button variant="outline" className="w-full">
                    Nastavenia účtu
                  </Button>
                </Link>
                <Link href="/dashboard/billing">
                  <Button variant="outline" className="w-full">
                    Účtovné údaje
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </FadeDiv>
      </div>

      {/* Usage Progress Bar */}
      {stats.usageLimit !== -1 && (
        <FadeDiv>
          <Card>
            <CardHeader>
              <CardTitle>Mesačné využitie</CardTitle>
              <CardDescription>
                {stats.plan === 'free'
                  ? 'Bezplatný plán'
                  : `${stats.plan} plán`}{' '}
                -{stats.remainingUses} zostávajúcich QR kódov v tomto mesiaci
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Využité</span>
                  <span>
                    {stats.qrCodesGenerated} / {stats.usageLimit}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${Math.min(
                        (stats.qrCodesGenerated / stats.usageLimit) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                {stats.qrCodesGenerated / stats.usageLimit > 0.8 && (
                  <p className="text-amber-600 text-sm">
                    Blížite sa k mesačnému limitu. Zvážte upgrade vášho plánu.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeDiv>
      )}
    </FadeContainer>
  );
}
