import { getRecentQRGenerations } from '@/app/actions/dashboard';
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
import { Calendar, Clock, CreditCard, Download, QrCode } from 'lucide-react';
import Link from 'next/link';

export default async function HistoryPage() {
  const qrHistory = await getRecentQRGenerations({ limit: 10 });

  return (
    <FadeContainer className="space-y-8">
      <FadeDiv>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">
              História QR kódov
            </h1>
            <p className="text-muted-foreground">
              Prehľad všetkých vygenerovaných QR kódov
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/generator">
              <QrCode className="mr-2 h-4 w-4" />
              Nový QR kód
            </Link>
          </Button>
        </div>
      </FadeDiv>

      {qrHistory.data?.length === 0 ? (
        <FadeDiv>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Clock className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 font-semibold text-lg">Žiadna história</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  Zatiaľ ste nevygenerovali žiadne QR kódy
                </p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/generator">
                    <QrCode className="mr-2 h-4 w-4" />
                    Vytvoriť prvý QR kód
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeDiv>
      ) : (
        <FadeDiv>
          <div className="space-y-4">
            {qrHistory.data?.map((qr) => (
              <Card key={qr.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <QrCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {qr.templateName || 'Jednorazová platba'}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(qr.generatedAt).toLocaleString('sk-SK')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className="font-semibold text-lg"
                      >
                        {qr.amount} EUR
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">IBAN:</span>
                        <span className="font-mono">
                          {qr.userIbanId?.slice(0, 8)}...
                          {qr.userIbanId?.slice(-4)}
                        </span>
                      </div>

                      {qr.variableSymbol && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">VS:</span>
                          <span className="font-mono">
                            {qr.variableSymbol.toString()}
                          </span>
                        </div>
                      )}

                      {qr.note && (
                        <div className="space-y-1">
                          <span className="text-muted-foreground text-sm">
                            Poznámka:
                          </span>
                          <p className="text-sm">{qr.note}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Stiahnuť PNG
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <QrCode className="mr-2 h-4 w-4" />
                        Znovu vygenerovať
                      </Button>
                      {qr.templateName !== 'Jednorazová platba' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href="/dashboard/templates">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Zobraziť šablónu
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeDiv>
      )}
    </FadeContainer>
  );
}
