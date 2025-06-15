'use client';

import { Button } from '@/components/ui/button';
import { Loader2Icon, QrCodeIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';

export function SubmitQrButton({ className }: { className?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      form="generate-qr-form"
      className={className}
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
  );
}
