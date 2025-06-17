'use server';

import db from '@/db';
import { profilesTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  businessName: z.string().min(1).max(200).optional(),
  email: z.string().email(),
  defaultIban: z.string().optional(),
});

const createProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  defaultIban: z.string().optional(),
});

export async function createProfile(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user email from Clerk
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error('User email not found');
  }

  // Extract and validate form data
  const businessName = formData.get('businessName') as string;
  const defaultIban = formData.get('defaultIban') as string;

  const validatedData = createProfileSchema.parse({
    businessName,
    defaultIban: defaultIban || undefined,
  });

  try {
    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      throw new Error('Profile already exists');
    }

    // Create new profile
    const newProfile = await db
      .insert(profilesTable)
      .values({
        clerkId: userId,
        businessName: validatedData.businessName,
        defaultIban: validatedData.defaultIban,
        email,
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true, profile: newProfile[0] };
  } catch (error) {
    console.error('Profile creation error:', error);
    throw new Error('Failed to create profile');
  }
}

export async function createOrUpdateProfile(
  data: z.infer<typeof profileSchema>
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Validate input
  const validatedData = profileSchema.parse(data);

  try {
    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    if (existingProfile.length > 0) {
      // Update existing profile
      const updatedProfile = await db
        .update(profilesTable)
        .set({
          businessName: validatedData.businessName,
          email: validatedData.email,
          defaultIban: validatedData.defaultIban,
          updatedAt: new Date(),
        })
        .where(eq(profilesTable.clerkId, userId))
        .returning();

      revalidatePath('/dashboard');
      return { success: true, profile: updatedProfile[0] };
    }

    // Create new profile
    const newProfile = await db
      .insert(profilesTable)
      .values({
        clerkId: userId,
        businessName: validatedData.businessName,
        email: validatedData.email,
        defaultIban: validatedData.defaultIban,
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true, profile: newProfile[0] };
  } catch (error) {
    console.error('Profile creation/update error:', error);
    throw new Error('Failed to create or update profile');
  }
}

export async function getProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    return profile[0] || null;
  } catch (error) {
    console.error('Get profile error:', error);
    return null;
  }
}

export async function deleteProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    await db.delete(profilesTable).where(eq(profilesTable.clerkId, userId));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Profile deletion error:', error);
    throw new Error('Failed to delete profile');
  }
}

export async function getUserSubscription() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // For now, return a default free plan subscription
  // TODO: Integrate with Clerk billing to get actual subscription data
  // This will be replaced with actual Clerk billing API calls
  return {
    id: 'mock-subscription',
    plan: 'free',
    status: 'active',
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelAtPeriodEnd: false,
  };
}

export async function hasProfile(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  try {
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkId, userId))
      .limit(1);

    return profile.length > 0;
  } catch (error) {
    console.error('Error checking profile existence:', error);
    return false;
  }
}
