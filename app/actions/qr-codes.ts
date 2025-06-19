'use server';

import db from '@/db';
import { businessProfilesTable, qrGenerationsTable } from '@/db/schema';
import { eurosToCents } from '@/lib/format-utils';
import { getBySquareQR } from '@/lib/get-bysquare-qr';
import {
  authActionClient,
  createSuccessResponse,
  publicActionClient,
} from '@/lib/safe-action';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
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
    console.error('Failed to generate variable symbol from sequence:', error);
    throw new Error('Failed to generate unique variable symbol');
  }
}

// Authenticated QR generation action
export const generateQRCodeAuth = authActionClient
  .metadata({
    actionName: 'generateQRCodeAuth',
    requiresAuth: true,
  })
  .schema(qrGenerationSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId, usageStatus } = ctx;

    // Get user profile
    const profile = await db.query.businessProfilesTable.findFirst({
      where: eq(businessProfilesTable.clerkId, userId),
    });

    if (!profile) {
      throw new Error('User profile not found');
    }

    // Generate variable symbol if not provided
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

    // Save generation record
    const qrGeneration = await db
      .insert(qrGenerationsTable)
      .values({
        clerkId: profile.clerkId,
        templateName: 'One-time payment', // Default template name
        amount: eurosToCents(parsedInput.amount), // Convert EUR to cents using utility
        variableSymbol: variableSymbol, // Now a string, no BigInt conversion needed
        qrData,
        iban: parsedInput.iban,
        note: parsedInput.paymentNote,
      })
      .returning();

    // Revalidate relevant pages
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/history');

    return createSuccessResponse(
      {
        qrId: qrGeneration[0].id,
        qrData,
        qrCodeUrl,
        variableSymbol,
        usageStatus: {
          used: usageStatus.used + 1,
          remaining: usageStatus.remaining - 1,
          limit: usageStatus.limit,
          plan: usageStatus.plan,
        },
      },
      'QR code generated successfully'
    );
  });

// Anonymous QR generation action (limited functionality)
export const generateQRCodeAnonymous = publicActionClient
  .metadata({
    actionName: 'generateQRCodeAnonymous',
    requiresAuth: false,
  })
  .schema(qrGenerationSchema)
  .action(async ({ parsedInput }) => {
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

    return createSuccessResponse(
      {
        qrData,
        qrCodeUrl,
        variableSymbol,
        // No database record for anonymous users
        isAnonymous: true,
      },
      'QR code generated successfully'
    );
  });

// Template-based QR generation
export const generateQRFromTemplate = authActionClient
  .metadata({
    actionName: 'generateQRFromTemplate',
    requiresAuth: true,
  })
  .schema(
    z.object({
      templateId: z.string().uuid(),
      overrides: qrGenerationSchema.partial().optional(),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx;

    // Get user profile
    const profile = await db.query.businessProfilesTable.findFirst({
      where: eq(businessProfilesTable.clerkId, userId),
    });

    if (!profile) {
      throw new Error('User profile not found');
    }

    // TODO: Implement template fetching and merging with overrides
    // This would fetch the template and merge with any overrides
  });

// Export types for frontend usage
export type QRGenerationInput = z.infer<typeof qrGenerationSchema>;
export type QRGenerationResult = Awaited<ReturnType<typeof generateQRCodeAuth>>;
export type AnonymousQRResult = Awaited<
  ReturnType<typeof generateQRCodeAnonymous>
>;
