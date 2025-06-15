import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import Image from 'next/image';
import { Button } from './ui/button';

export function ShowQrDrawer({ qrCodeUrl }: { qrCodeUrl: string }) {
  return (
    <Drawer>
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
          <DrawerFooter>
            <Button variant="outline">Zavrieť</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
