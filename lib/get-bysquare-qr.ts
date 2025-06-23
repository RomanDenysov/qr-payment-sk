import 'server-only';

import { CurrencyCode, PaymentOptions, encode } from 'bysquare';

const currentCurrency = CurrencyCode.EUR;
const currentPaymentOption = PaymentOptions.DirectDebit;

export function getBySquareQR(data: {
  iban: string;
  amount: number;
  variableSymbol: string;
  paymentNote?: string;
}): string {
  try {
    // Clean IBAN by removing spaces and converting to uppercase
    const cleanIban = data.iban.replace(/\s+/g, '').toUpperCase();

    return encode({
      payments: [
        {
          type: currentPaymentOption,
          amount: data.amount,
          variableSymbol: data.variableSymbol,
          currencyCode: currentCurrency,
          bankAccounts: [{ iban: cleanIban }],
          paymentNote: data.paymentNote,
        },
      ],
    });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error(error);
    throw new Error('Failed to generate QR code', { cause: error });
  }
}
