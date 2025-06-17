'use client';

import { generateQRCode } from '@/app/actions/qr-codes';
import { IBANInput } from '@/components/shared/iban-input';
import { ShowQrDrawer } from '@/components/show-qr-drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon, QrCodeIcon } from 'lucide-react';
import {
  type KeyboardEvent,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';

const initialState = {
  success: false,
  error: null,
  qrCode: null,
  inputs: null,
};

export function DashboardQrGenerator() {
  const [state, formAction, pending] = useActionState(
    generateQRCode,
    initialState
  );
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [showQrDrawer, setShowQrDrawer] = useState(false);

  const ibanRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Show QR drawer when QR code is generated
  useEffect(() => {
    if (state.success && state.qrCode) {
      setShowQrDrawer(true);
    }
  }, [state.success, state.qrCode]);

  // Listen for template selection events
  useEffect(() => {
    const handleUseTemplate = (event: CustomEvent) => {
      const template = event.detail;

      // Fill form with template data
      if (ibanRef.current) ibanRef.current.value = template.iban;
      if (amountRef.current) amountRef.current.value = template.amount;

      // Reset template save option
      setSaveAsTemplate(false);
    };

    window.addEventListener('useTemplate', handleUseTemplate as EventListener);
    return () => {
      window.removeEventListener(
        'useTemplate',
        handleUseTemplate as EventListener
      );
    };
  }, []);

  // Handle Enter key in IBAN field to move to amount field
  const handleIbanKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      amountRef.current?.focus();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generovať QR kód</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="iban">IBAN *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="amount">Suma (EUR) *</Label>
                <Input
                  ref={amountRef}
                  disabled={pending}
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="99999999.99"
                  required
                  placeholder="25.50"
                  defaultValue={state.inputs?.amount}
                  aria-describedby="amount-error"
                />
                {state.error?.amount && (
                  <p id="amount-error" className="text-destructive text-sm">
                    {state.error.amount[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="variableSymbol">Variabilný symbol</Label>
                <Input
                  disabled={pending}
                  id="variableSymbol"
                  name="variableSymbol"
                  placeholder="12345678"
                  type="text"
                  defaultValue={state.inputs?.variableSymbol}
                  aria-describedby="variableSymbol-error"
                  maxLength={10}
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

              <div className="space-y-2">
                <Label htmlFor="constantSymbol">Konštantný symbol</Label>
                <Input
                  disabled={pending}
                  id="constantSymbol"
                  name="constantSymbol"
                  placeholder="0308"
                  type="text"
                  defaultValue={state.inputs?.constantSymbol}
                  maxLength={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificSymbol">Špecifický symbol</Label>
                <Input
                  disabled={pending}
                  id="specificSymbol"
                  name="specificSymbol"
                  placeholder="1234567890"
                  type="text"
                  defaultValue={state.inputs?.specificSymbol}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNote">Poznámka k platbe</Label>
              <Textarea
                disabled={pending}
                id="paymentNote"
                name="paymentNote"
                placeholder="Popis platby..."
                defaultValue={state.inputs?.paymentNote}
                maxLength={140}
                rows={3}
              />
            </div>

            {/* Save as Template */}
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveAsTemplate"
                    name="saveAsTemplate"
                    checked={saveAsTemplate}
                    onCheckedChange={(checked) => setSaveAsTemplate(!!checked)}
                    disabled={pending}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="saveAsTemplate"
                      className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Uložiť ako šablónu
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Uložte tieto nastavenia pre budúce použitie
                    </p>
                  </div>
                </div>
                {saveAsTemplate && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="templateName">Názov šablóny *</Label>
                    <Input
                      disabled={pending}
                      id="templateName"
                      name="templateName"
                      placeholder="Mesačná platba za energie"
                      required={saveAsTemplate}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Generujem...
                </>
              ) : (
                <>
                  <QrCodeIcon className="mr-2 h-4 w-4" />
                  Vygenerovať QR kód
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {showQrDrawer && state.qrCode && (
        <ShowQrDrawer qrCodeUrl={state.qrCode} />
      )}
    </>
  );
}
