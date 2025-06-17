'use client';

import { generateQRCodeAuth } from '@/app/actions/qr-codes';
import { IBANInput } from '@/components/shared/iban-input';
import { ShowQrDrawer } from '@/components/show-qr-drawer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Loader2Icon, QrCodeIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';

export function DashboardQrGenerator() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [showQrDrawer, setShowQrDrawer] = useState(false);

  const { execute, result, isExecuting } = useAction(generateQRCodeAuth);

  const ibanRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  // Handle successful QR generation
  useEffect(() => {
    if (result?.data?.data?.qrCodeUrl) {
      setQrCodeUrl(result.data.data.qrCodeUrl);
      setShowQrDrawer(true);
    }
  }, [result]);

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

  const handleSubmit = async (formData: FormData) => {
    const data = {
      iban: formData.get('iban') as string,
      amount: Number.parseFloat(formData.get('amount') as string),
      variableSymbol: (formData.get('variableSymbol') as string) || undefined,
      constantSymbol: (formData.get('constantSymbol') as string) || undefined,
      specificSymbol: (formData.get('specificSymbol') as string) || undefined,
      paymentNote: (formData.get('paymentNote') as string) || undefined,
      // TODO: Handle template saving
      templateName: saveAsTemplate
        ? (formData.get('templateName') as string)
        : undefined,
    };

    execute(data);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generovať QR kód</CardTitle>
        </CardHeader>
        <CardContent>
          {result?.serverError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{result.serverError.message}</AlertDescription>
            </Alert>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="iban">IBAN *</Label>
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

              <div className="space-y-2">
                <Label htmlFor="amount">Suma (EUR) *</Label>
                <Input
                  ref={amountRef}
                  disabled={isExecuting}
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="99999999.99"
                  required
                  placeholder="25.50"
                  aria-describedby="amount-error"
                />
                {result?.validationErrors?.amount?._errors?.[0] && (
                  <p id="amount-error" className="text-destructive text-sm">
                    {result.validationErrors.amount._errors[0]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="variableSymbol">Variabilný symbol</Label>
                <Input
                  disabled={isExecuting}
                  id="variableSymbol"
                  name="variableSymbol"
                  placeholder="12345678"
                  type="text"
                  aria-describedby="variableSymbol-error"
                  maxLength={10}
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

              <div className="space-y-2">
                <Label htmlFor="constantSymbol">Konštantný symbol</Label>
                <Input
                  disabled={isExecuting}
                  id="constantSymbol"
                  name="constantSymbol"
                  placeholder="0308"
                  type="text"
                  maxLength={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificSymbol">Špecifický symbol</Label>
                <Input
                  disabled={isExecuting}
                  id="specificSymbol"
                  name="specificSymbol"
                  placeholder="1234567890"
                  type="text"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNote">Poznámka k platbe</Label>
              <Textarea
                disabled={isExecuting}
                id="paymentNote"
                name="paymentNote"
                placeholder="Popis platby..."
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
                    disabled={isExecuting}
                  />
                  <Label htmlFor="saveAsTemplate" className="text-sm">
                    Uložiť ako šablónu
                  </Label>
                </div>

                {saveAsTemplate && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="templateName">Názov šablóny</Label>
                    <Input
                      disabled={isExecuting}
                      id="templateName"
                      name="templateName"
                      placeholder="Moja šablóna"
                      maxLength={100}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={isExecuting}>
              {isExecuting ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Generujem QR kód...
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

      {showQrDrawer && qrCodeUrl && <ShowQrDrawer qrCodeUrl={qrCodeUrl} />}
    </>
  );
}
