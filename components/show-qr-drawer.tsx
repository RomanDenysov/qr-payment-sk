'use client';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useQrCodeActions } from '@/hooks/useQrCodeActions';
import { CopyIcon, DownloadIcon, ShareIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

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
            <DrawerTitle>Vaš QR kód</DrawerTitle>
            <DrawerDescription>
              Skenujte tento QR kód pomocou aplikácie vášho banku pre zadanie
              platby.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center p-2">
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={400}
              height={400}
              className="rounded-lg border"
            />
          </div>
          <DrawerFooter className="flex-row gap-2">
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
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
