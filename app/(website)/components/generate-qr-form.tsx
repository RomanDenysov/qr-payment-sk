'use client';

import { generateQRCode } from '@/app/actions/qr-codes';
import { IBANInput } from '@/components/shared/iban-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useActionState } from 'react';

const initialState = {
  success: false,
  error: null,
  qrCode: null,
  inputs: null,
};

export function GenerateQrForm() {
  const [state, formAction] = useActionState(generateQRCode, initialState);

  return (
    <div className="min-w-md space-y-4">
      <form
        action={formAction}
        id="generate-qr-form"
        className="space-y-4"
        autoComplete="on"
      >
        <div className="space-y-2">
          <Label htmlFor="iban">IBAN*</Label>
          <IBANInput
            id="iban"
            name="iban"
            maxLength={29}
            placeholder="SK31 1200 0000 1987 4263 7541"
            aria-describedby="iban-error"
            autoCapitalize="characters"
            defaultValue={state.inputs?.iban}
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
              id="variableSymbol"
              name="variableSymbol"
              type="text"
              defaultValue={state.inputs?.variableSymbol}
              aria-describedby="variableSymbol-error"
              maxLength={24}
            />
            {state.error?.variableSymbol && (
              <p id="variableSymbol-error" className="text-destructive text-sm">
                {state.error.variableSymbol[0]}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentNote">Poznámka k platbe</Label>
          <Textarea
            id="paymentNote"
            name="paymentNote"
            defaultValue={state.inputs?.paymentNote}
            aria-describedby="paymentNote-error"
            maxLength={150}
          />
          {state.error?.paymentNote && (
            <p id="paymentNote-error" className="text-destructive text-sm">
              {state.error.paymentNote[0]}
            </p>
          )}
        </div>
      </form>

      {state.success && state.qrCode && (
        <div className="mt-6 text-center">
          <h3 className="mb-4 font-semibold text-lg">QR kód</h3>
          <div className="flex justify-center">
            <Image
              src={state.qrCode}
              alt="QR kód"
              width={200}
              height={200}
              className="max-w-xs rounded-md border bg-accent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
