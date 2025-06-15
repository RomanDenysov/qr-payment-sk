'use server';

import { getBySquareQR } from '@/lib/get-bysquare-qr';
import QRCode from 'qrcode';
import { z } from 'zod';

const bankAccountsSchema = z.object({
  iban: z
    .string()
    .min(1, { message: 'IBAN je povinný' })
    .max(29, { message: 'IBAN je príliš dlhý' })
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]*$/, { message: 'Neplatný formát IBAN' }),
});
const bySquareSchema = z
  .object({
    amount: z.coerce.number().min(0.01).max(1000000),
    variableSymbol: z.string().optional(),
    paymentNote: z.string().optional(),
  })
  .merge(bankAccountsSchema);

type BySquareSchema = z.infer<typeof bySquareSchema>;

type GenerateQRCodeResponse = {
  success: boolean;
  error: Record<string, string[] | undefined> | null;
  qrCode: string | null;
  inputs: Record<string, string> | null;
};

export async function generateQRCode(
  _: GenerateQRCodeResponse,
  formData: FormData
): Promise<GenerateQRCodeResponse> {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  try {
    const rawData = {
      iban: formData.get('iban') as string,
      amount: formData.get('amount') as string,
      variableSymbol: formData.get('variableSymbol') as string,
      paymentNote: formData.get('paymentNote') as string,
    };

    // Clean IBAN by removing spaces before validation
    const data = {
      ...rawData,
      iban: rawData.iban.replace(/\s+/g, '').toUpperCase(),
    };

    // Debug logging
    console.log('Raw form data:', rawData);
    console.log('Cleaned data:', data);

    const validatedData = bySquareSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.flatten().fieldErrors,
        qrCode: null,
        inputs: rawData,
      };
    }

    const { iban, amount, variableSymbol, paymentNote } = validatedData.data;

    const qrCode = await getBySquareQR({
      iban,
      amount,
      variableSymbol: variableSymbol ?? '',
      paymentNote: paymentNote ?? undefined,
    });

    const qrCodeUrl = await QRCode.toDataURL(qrCode, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });

    return {
      success: true,
      error: null,
      qrCode: qrCodeUrl,
      inputs: null,
    };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error);
    return {
      success: false,
      error: {
        iban: ['Nastala chyba pri generovaní QR kódu'],
      },
      qrCode: null,
      inputs: null,
    };
  }
}
