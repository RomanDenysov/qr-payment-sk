'use client';

import { generateQRCode } from '@/app/actions/qr-codes';
import { IBANInput } from '@/components/shared/iban-input';
import { ShowQrDrawer } from '@/components/show-qr-drawer';
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
import { Loader2Icon, QrCodeIcon } from 'lucide-react';
import { type KeyboardEvent, useActionState, useRef } from 'react';

const initialState = {
  success: false,
  error: null,
  qrCode: null,
  inputs: null,
};

export function QRCard() {
  const [state, formAction, pending] = useActionState(
    generateQRCode,
    initialState
  );

  const ibanRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Handle Enter key in IBAN field to move to amount field
  const handleIbanKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      amountRef.current?.focus();
    }
  };

  return (
    <>
      <Card className="w-full shadow-xl">
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
          <div className="space-y-4 ">
            <form
              action={formAction}
              id="generate-qr-form"
              name="generate-qr-form"
              className="space-y-4"
              autoComplete="on"
            >
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN*</Label>
                <IBANInput
                  ref={ibanRef}
                  disabled={pending}
                  id="iban"
                  name="iban"
                  maxLength={29}
                  placeholder="SK31 1200 0000 1987 4263 7541"
                  aria-describedby="iban-error"
                  autoCapitalize="characters"
                  defaultValue={state.inputs?.iban}
                  onKeyDown={handleIbanKeyDown}
                  required
                />
                {state.error?.iban && (
                  <p id="iban-error" className="text-destructive text-sm">
                    {state.error.iban[0]}
                  </p>
                )}
              </div>
              <div className="flex w-full flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="amount">Suma*</Label>
                  <Input
                    ref={amountRef}
                    disabled={pending}
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000000"
                    required
                    placeholder="100.00"
                    defaultValue={state.inputs?.amount}
                    aria-describedby="amount-error"
                  />
                  {state.error?.amount && (
                    <p id="amount-error" className="text-destructive text-sm">
                      {state.error.amount[0]}
                    </p>
                  )}
                </div>
                <div className="flex-2 space-y-2">
                  <Label htmlFor="variableSymbol">Variabilný symbol</Label>
                  <Input
                    disabled={pending}
                    id="variableSymbol"
                    name="variableSymbol"
                    placeholder="0100004050"
                    type="text"
                    defaultValue={state.inputs?.variableSymbol}
                    aria-describedby="variableSymbol-error"
                    maxLength={24}
                  />
                  {state.error?.variableSymbol && (
                    <p
                      id="variableSymbol-error"
                      className="text-destructive text-sm"
                    >
                      {state.error.variableSymbol[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentNote">Poznámka k platbe</Label>
                <Textarea
                  disabled={pending}
                  id="paymentNote"
                  name="paymentNote"
                  placeholder="Nazov služby, čislo, kód..."
                  defaultValue={state.inputs?.paymentNote}
                  aria-describedby="paymentNote-error"
                  maxLength={250}
                />
                {state.error?.paymentNote && (
                  <p
                    id="paymentNote-error"
                    className="text-destructive text-sm"
                  >
                    {state.error.paymentNote[0]}
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
            disabled={pending}
          >
            {pending ? (
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

      {state.success && state.qrCode && (
        <ShowQrDrawer qrCodeUrl={state.qrCode} />
      )}
    </>
  );
}
