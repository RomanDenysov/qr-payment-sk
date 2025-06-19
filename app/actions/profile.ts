'use server';

import db from '@/db';
import { businessProfilesTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const businessProfileSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(200)
    .optional(),
  // IBAN fields (optional)
  businessType: z.enum(['individual', 'company', 'ngo']).optional(),
  vatNumber: z.string().optional(),
  registrationNumber: z.string().optional(),
  defaultCurrency: z.string().optional(),
});

type BusinessProfileData = z.infer<typeof businessProfileSchema>;

export async function createBusinessProfile(data: BusinessProfileData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const validatedData = businessProfileSchema.parse(data);

  try {
    // Create new profile
    await db
      .insert(businessProfilesTable)
      .values({
        clerkId: userId,
        businessName: validatedData.businessName || '',
        businessType: validatedData.businessType,
        vatNumber: validatedData.vatNumber,
        registrationNumber: validatedData.registrationNumber,
        defaultCurrency: validatedData.defaultCurrency,
      })
      .onConflictDoUpdate({
        target: [businessProfilesTable.clerkId],
        set: {
          businessName: validatedData.businessName || '',
          businessType: validatedData.businessType,
          vatNumber: validatedData.vatNumber,
          registrationNumber: validatedData.registrationNumber,
          defaultCurrency: validatedData.defaultCurrency,
        },
      });

    revalidatePath('/dashboard');
    return { success: true, error: null };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Business profile creation error:', error);
    return { success: false, error: 'Failed to create business profile' };
  }
}

export async function getBusinessProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const profile = await db.query.businessProfilesTable.findFirst({
      where: eq(businessProfilesTable.clerkId, userId),
    });

    return profile || null;
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Get profile error:', error);
    return null;
  }
}

export async function deleteBusinessProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await db
      .delete(businessProfilesTable)
      .where(eq(businessProfilesTable.clerkId, userId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Profile deletion error:', error);
    throw new Error('Failed to delete profile');
  }
}
