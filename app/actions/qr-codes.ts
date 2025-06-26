'use server';

import db from '@/db';
import { paymentTemplatesTable, qrGenerationsTable } from '@/db/schema';
import { auth } from '@/lib/auth';
import { eurosToCents } from '@/lib/format-utils';
import { getBySquareQR } from '@/lib/qr/get-bysquare-qr';
import { processQrGeneration } from '@/lib/rate-limits';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import QRCode from 'qrcode';
import { z } from 'zod';

// Input validation schema
const qrGenerationSchema = z.object({
  iban: z
    .string()
    .regex(/^SK\d{22}$/, 'Invalid Slovak IBAN format')
    .transform((val) => val.replace(/\s+/g, '').toUpperCase()),
  amount: z
    .number()
    .min(0.01, 'Amount must be at least €0.01')
    .max(99999999.99, 'Amount cannot exceed €99,999,999.99'),
  variableSymbol: z
    .string()
    .regex(/^\d{1,10}$/, 'Variable symbol must be 1-10 digits')
    .optional(),
  constantSymbol: z
    .string()
    .regex(/^\d{1,10}$/, 'Constant symbol must be 1-10 digits')
    .optional(),
  paymentNote: z
    .string()
    .max(140, 'Payment note cannot exceed 140 characters')
    .optional(),
});

// Generate unique variable symbol using database sequence
async function generateUniqueVariableSymbol(): Promise<string> {
  try {
    // Use raw SQL to call the sequence
    const result = await db.execute(
      sql`SELECT nextval('variable_symbol_seq') as next_val`
    );

    if (!result.rows || result.rows.length === 0) {
      throw new Error('No value returned from sequence');
    }

    const row = result.rows[0] as { next_val: number };
    return row.next_val.toString();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Failed to generate variable symbol from sequence:', error);
    throw new Error('Failed to generate unique variable symbol');
  }
}

// Authenticated QR generation action with new limit system
export const generateQRCode = async (parsedInput: QRGenerationInput) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;

  // Generate BySquare QR data

  const qrData = getBySquareQR({
    iban: parsedInput.iban,
    amount: parsedInput.amount,
    variableSymbol:
      parsedInput.variableSymbol || (await generateUniqueVariableSymbol()),
    paymentNote: parsedInput.paymentNote,
  });

  // Generate QR code image
  const qrCodeUrl = await QRCode.toDataURL(qrData, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });

  // Save generation record
  await db.insert(qrGenerationsTable).values({
    userId,
    templateName: '',
    amount: eurosToCents(parsedInput.amount),
    variableSymbol: parsedInput.variableSymbol || '',
    qrData,
    iban: parsedInput.iban,
    note: parsedInput.paymentNote,
  });

  // Revalidate relevant pages
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');

  return qrCodeUrl;
};

// Anonymous QR generation action (limited functionality)
export const generateQRCodeAnonymous = async (
  parsedInput: QRGenerationInput
) => {
  // TODO: Implement anonymous rate limiting with IP-based tracking
  // For now, allow anonymous generation without limits

  // Generate variable symbol
  const variableSymbol =
    parsedInput.variableSymbol || (await generateUniqueVariableSymbol());

  // Generate BySquare QR data
  const qrData = await getBySquareQR({
    iban: parsedInput.iban,
    amount: parsedInput.amount,
    variableSymbol,
    paymentNote: parsedInput.paymentNote,
  });

  // Generate QR code image
  const qrCodeUrl = await QRCode.toDataURL(qrData, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });

  return qrCodeUrl;
};

// Template-based QR generation
export const generateQRFromTemplate = async (
  parsedInput: QRGenerationInput,
  ctx: { userId: string }
) => {
  const { userId } = ctx;

  // Check limits and increment usage using new system
  await processQrGeneration();

  // Get template details
  const template = await db.query.paymentTemplatesTable.findFirst({
    where: (templates, { eq, and }) =>
      and(
        eq(templates.id, parsedInput.templateId),
        eq(templates.userId, userId),
        eq(templates.isActive, true)
      ),
  });

  if (!template) {
    throw new Error('Template not found or inactive');
  }

  // Merge template data with overrides
  const finalData = {
    iban: parsedInput.overrides?.iban || template.iban,
    amount: parsedInput.overrides?.amount || template.amount,
    variableSymbol: parsedInput.overrides?.variableSymbol,
    constantSymbol: parsedInput.overrides?.constantSymbol,
    paymentNote: parsedInput.overrides?.paymentNote || template.description,
  };

  // Generate variable symbol if not provided
  const variableSymbol =
    finalData.variableSymbol || (await generateUniqueVariableSymbol());

  // Generate BySquare QR data
  const qrData = await getBySquareQR({
    iban: finalData.iban,
    amount: finalData.amount,
    variableSymbol,
    paymentNote: finalData.paymentNote,
  });

  // Generate QR code image
  const qrCodeUrl = await QRCode.toDataURL(qrData, {
    width: 512,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });

  // Save generation record
  const qrGeneration = await db
    .insert(qrGenerationsTable)
    .values({
      userId: userId,
      templateId: template.id,
      templateName: template.name,
      amount: eurosToCents(finalData.amount),
      variableSymbol: variableSymbol,
      qrData,
      iban: finalData.iban,
      note: finalData.paymentNote,
    })
    .returning();

  // Increment template usage count
  await db
    .update(paymentTemplatesTable)
    .set({ usageCount: sql`${paymentTemplatesTable.usageCount} + 1` })
    .where(eq(paymentTemplatesTable.id, template.id));

  // Track user activity
  await trackUserActivity(userId, {
    qrCodesGenerated: 1,
    templatesUsed: 1,
    revenue: eurosToCents(finalData.amount),
  });

  // Revalidate relevant pages
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/history');
  revalidatePath('/dashboard/templates');

  return {
    qrId: qrGeneration[0].id,
    qrData,
    qrCodeUrl,
    variableSymbol,
    templateName: template.name,
  };
};

// Type exports
export type QRGenerationInput = z.infer<typeof qrGenerationSchema>;
export type QRGenerationResult = Awaited<ReturnType<typeof generateQRCode>>;
export type AnonymousQRResult = Awaited<
  ReturnType<typeof generateQRCodeAnonymous>
>;
export type TemplateQRResult = Awaited<
  ReturnType<typeof generateQRFromTemplate>
>;
