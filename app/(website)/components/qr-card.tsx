'use client';
import { QrCodeForm } from '@/components/shared/qr-code-form';
import { ShowQrDrawer } from '@/components/show-qr-drawer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type KeyboardEvent, useRef, useState } from 'react';

export function QRCard() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const ibanRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);

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

    console.log(data);
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
          <QrCodeForm />
        </CardContent>
      </Card>

      {qrCodeUrl && <ShowQrDrawer qrCodeUrl={qrCodeUrl} />}
    </>
  );
}
