'use server';

import db from '@/db';
import { profilesTable, qrGenerationsTable } from '@/db/schema';
import { getBySquareQR } from '@/lib/get-bysquare-qr';
import {
  authActionClient,
  createSuccessResponse,
  publicActionClient,
} from '@/lib/safe-action';
import { eq } from 'drizzle-orm';
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
  paymentNote: z
    .string()
    .max(140, 'Payment note cannot exceed 140 characters')
    .optional(),
  templateId: z.string().uuid().optional(),
  templateName: z.string().max(100).optional(),
});

// Generate unique variable symbol
async function generateUniqueVariableSymbol(): Promise<string> {
  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Timestamp + random component for uniqueness
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    const random = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, '0');
    const variableSymbol = timestamp + random;

    // Check uniqueness in database
    const existing = await db
      .select()
      .from(qrGenerationsTable)
      .where(eq(qrGenerationsTable.variableSymbol, BigInt(variableSymbol)))
      .limit(1);

    if (!existing.length) {
      return variableSymbol;
    }
  }

  throw new Error(
    'Failed to generate unique variable symbol after 10 attempts'
  );
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
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    if (!profile.length) {
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
        userId: profile[0].id,
        templateId: parsedInput.templateId || null,
        templateName: parsedInput.templateName || 'One-time payment',
        amount: parsedInput.amount.toString(),
        variableSymbol: BigInt(variableSymbol),
        qrData,
        iban: parsedInput.iban,
        description: parsedInput.paymentNote,
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
  .schema(qrGenerationSchema.omit({ templateId: true, templateName: true }))
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
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    if (!profile.length) {
      throw new Error('User profile not found');
    }

    // TODO: Implement template fetching and merging with overrides
    // This would fetch the template and merge with any overrides

    throw new Error('Template-based generation not yet implemented');
  });

// Export types for frontend usage
export type QRGenerationInput = z.infer<typeof qrGenerationSchema>;
export type QRGenerationResult = Awaited<ReturnType<typeof generateQRCodeAuth>>;
export type AnonymousQRResult = Awaited<
  ReturnType<typeof generateQRCodeAnonymous>
>;
