import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GenerateQrForm } from './generate-qr-form';
import { SubmitQrButton } from './submit-qr-button';

export function GetQrCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vygeneruj QR kód</CardTitle>
        <CardDescription>
          Vygeneruj QR kód pre platbu pomocou{' '}
          <span className="font-medium text-primary">BySquare</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenerateQrForm />
      </CardContent>
      <CardFooter className="flex justify-end">
        <SubmitQrButton className="w-full" />
      </CardFooter>
    </Card>
  );
}
