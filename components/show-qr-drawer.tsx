'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useQrCodeActions } from '@/hooks/use-qr-code-actions';
import {
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  ShareIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function ShowQrDrawer({ qrCodeUrl }: { qrCodeUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (qrCodeUrl) {
      setOpen(true);
    }
    return () => {
      setOpen(false);
    };
  }, [qrCodeUrl]);

  const { isLoading, handleCopyQR, handleShareQR, handleDownloadQR } =
    useQrCodeActions(qrCodeUrl);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex items-center justify-center gap-1">
              <CheckCircleIcon className="size-4" />
              Vaš QR kód je pripravený!
            </DrawerTitle>
            <DrawerDescription>
              Skenujte tento QR kód pomocou aplikácie vášho banku pre zadanie
              platby.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-2">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={400}
              height={400}
              className="aspect-square w-full rounded-lg border bg-muted"
            />
            <div className="flex size-full flex-row flex-wrap items-start justify-start gap-2 rounded-lg border p-4">
              <Badge>IBAN: SK00 0000 0000 0000 0000 0000</Badge>
              <Badge>100.00 EUR</Badge>
              <Badge>VS: 000000</Badge>
              <Badge>KS: 000000</Badge>
              <Badge>Sprava príjemca</Badge>
            </div>
          </div>
          <DrawerFooter className="">
            <div className="flex flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyQR}
                disabled={isLoading}
                className="flex-1"
              >
                <CopyIcon className="size-4" />
                Kopírovať
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleShareQR}
                disabled={isLoading}
                className="flex-1"
              >
                <ShareIcon className="size-4" />
                Zdieľať
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadQR}
                disabled={isLoading}
                className="flex-1"
              >
                <DownloadIcon className="size-4" />
                Stiahnuť
              </Button>
            </div>
            <Separator className="my-1" />
            <span className="text-wrap text-center text-muted-foreground text-sm">
              Chcete uložiť históriu QR kódov?{' '}
              <Link href="/sign-up" className="text-primary underline">
                Vytvoriť účet zadarmo
              </Link>{' '}
              alebo pokračujte anonymne
            </span>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
