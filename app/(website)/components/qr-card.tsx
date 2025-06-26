import { QrCodeForm } from '@/components/shared/qr-code-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function QRCard() {
  return (
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
  );
}
