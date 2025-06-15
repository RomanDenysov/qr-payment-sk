import { SubmitButton } from '@/components/shared/submit-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GenerateQrForm } from './generate-qr-form';

export function GetQrCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vygeneruj QR kód</CardTitle>
        <CardDescription>
          Vygeneruj QR kód pre platbu cez BySquare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenerateQrForm />
      </CardContent>
      <CardFooter className="flex justify-end">
        <SubmitButton
          formId="generate-qr-form"
          title="Vygenerovať QR kód"
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
