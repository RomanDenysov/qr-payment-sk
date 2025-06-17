'use client';

import { generateQRCodeAnonymous } from '@/app/actions/qr-codes';
import { IBANInput } from '@/components/shared/iban-input';
import { ShowQrDrawer } from '@/components/show-qr-drawer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2Icon, QrCodeIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

export function QRCard() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const { execute, result, isExecuting } = useAction(generateQRCodeAnonymous);

  const ibanRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Handle successful QR generation
  useEffect(() => {
    if (result?.data?.data?.qrCodeUrl) {
      setQrCodeUrl(result.data.data.qrCodeUrl);
    }
  }, [result]);

  // Handle Enter key in IBAN field to move to amount field
  const handleIbanKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      amountRef.current?.focus();
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const data = {
      iban: formData.get('iban') as string,
      amount: Number.parseFloat(formData.get('amount') as string),
      variableSymbol: (formData.get('variableSymbol') as string) || undefined,
      paymentNote: (formData.get('paymentNote') as string) || undefined,
    };

    execute(data);
  };

  return (
    <>
      <Card className="w-full min-w-xs shadow-xl">
        <CardHeader>
          <CardTitle>Vygeneruj QR kód</CardTitle>
          <CardDescription>
            Vygeneruj QR kód pre rýchlu platbu pomocou{' '}
            <a
              href="https://bysquare.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              BySquare
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result?.serverError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {result.serverError.message}
                </AlertDescription>
              </Alert>
            )}

            <form
              action={handleSubmit}
              id="generate-qr-form"
              name="generate-qr-form"
              className="space-y-4"
              autoComplete="on"
            >
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN*</Label>
                <IBANInput
                  ref={ibanRef}
                  disabled={isExecuting}
                  id="iban"
                  name="iban"
                  maxLength={29}
                  placeholder="SK31 1200 0000 1987 4263 7541"
                  aria-describedby="iban-error"
                  autoCapitalize="characters"
                  onKeyDown={handleIbanKeyDown}
                  required
                />
                {result?.validationErrors?.iban?._errors?.[0] && (
                  <p id="iban-error" className="text-destructive text-sm">
                    {result.validationErrors.iban._errors[0]}
                  </p>
                )}
              </div>
              <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="amount">Suma*</Label>
                  <Input
                    ref={amountRef}
                    disabled={isExecuting}
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000000"
                    required
                    placeholder="100.00"
                    aria-describedby="amount-error"
                  />
                  {result?.validationErrors?.amount?._errors?.[0] && (
                    <p id="amount-error" className="text-destructive text-sm">
                      {result.validationErrors.amount._errors[0]}
                    </p>
                  )}
                </div>
                <div className="flex-2 space-y-2">
                  <Label htmlFor="variableSymbol">Variabilný symbol</Label>
                  <Input
                    disabled={isExecuting}
                    id="variableSymbol"
                    name="variableSymbol"
                    placeholder="0100004050"
                    type="text"
                    aria-describedby="variableSymbol-error"
                    maxLength={24}
                  />
                  {result?.validationErrors?.variableSymbol?._errors?.[0] && (
                    <p
                      id="variableSymbol-error"
                      className="text-destructive text-sm"
                    >
                      {result.validationErrors.variableSymbol._errors[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentNote">Poznámka k platbe</Label>
                <Textarea
                  disabled={isExecuting}
                  id="paymentNote"
                  name="paymentNote"
                  placeholder="Nazov služby, čislo, kód..."
                  aria-describedby="paymentNote-error"
                  maxLength={250}
                />
                {result?.validationErrors?.paymentNote?._errors?.[0] && (
                  <p
                    id="paymentNote-error"
                    className="text-destructive text-sm"
                  >
                    {result.validationErrors.paymentNote._errors[0]}
                  </p>
                )}
              </div>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            form="generate-qr-form"
            className="w-full"
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Generujem QR kód...
              </>
            ) : (
              <>
                <QrCodeIcon />
                Vygenerovať QR kód
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {qrCodeUrl && <ShowQrDrawer qrCodeUrl={qrCodeUrl} />}
    </>
  );
}
