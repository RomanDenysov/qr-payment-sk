'use server';

import db from '@/db';
import { profilesTable, subscriptionsTable } from '@/db/schema';
import type { NewProfile } from '@/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Validation schema for profile creation
const profileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required').max(200),
  defaultIban: z
    .string()
    .regex(/^SK\d{22}$/, 'Invalid Slovak IBAN format')
    .optional()
    .or(z.literal('')),
});

// Check if user has a profile
export async function hasProfile(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const profile = await db
    .select({ id: profilesTable.id })
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  return profile.length > 0;
}

// Get user profile with full data
export async function getUserProfile() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  return profile[0] || null;
}

// Create user profile
export async function createProfile(formData: FormData) {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error('Unauthorized');
  }

  // Validate form data
  const data = {
    businessName: formData.get('businessName') as string,
    defaultIban: formData.get('defaultIban') as string,
  };

  const validatedData = profileSchema.parse(data);

  try {
    // Check if profile already exists
    const existingProfile = await getUserProfile();
    if (existingProfile) {
      throw new Error('Profile already exists');
    }

    // Create profile
    const profileData: NewProfile = {
      clerkId: userId,
      email: user.emailAddresses[0]?.emailAddress || '',
      businessName: validatedData.businessName,
      defaultIban: validatedData.defaultIban || null,
    };

    const [newProfile] = await db
      .insert(profilesTable)
      .values(profileData)
      .returning();

    // Create default free subscription
    await db.insert(subscriptionsTable).values({
      userId: newProfile.id,
      plan: 'free',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
    });

    // Revalidate cache
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true, profile: newProfile };
  } catch (error) {
    console.error('Error creating profile:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create profile'
    );
  }
}

// Update user profile
export async function updateProfile(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const data = {
    businessName: formData.get('businessName') as string,
    defaultIban: formData.get('defaultIban') as string,
  };

  const validatedData = profileSchema.parse(data);

  try {
    const [updatedProfile] = await db
      .update(profilesTable)
      .set({
        businessName: validatedData.businessName,
        defaultIban: validatedData.defaultIban || null,
        updatedAt: new Date(),
      })
      .where(eq(profilesTable.clerkId, userId))
      .returning();

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/settings');

    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
}

// Get user subscription
export async function getUserSubscription() {
  const profile = await getUserProfile();

  if (!profile) {
    return null;
  }

  const subscription = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, profile.id))
    .limit(1);

  return subscription[0] || null;
}

// Check if user has access to specific features
export async function hasFeatureAccess(feature: string): Promise<boolean> {
  const subscription = await getUserSubscription();
  const plan = subscription?.plan || 'free';

  const FEATURE_ACCESS: Record<string, string[]> = {
    free: ['basic_qr', 'templates', 'history'],
    starter: [
      'basic_qr',
      'templates',
      'history',
      'api_access',
      'priority_support',
    ],
    professional: ['all_features'],
  };

  if (plan === 'professional') {
    return true;
  }

  const planFeatures = FEATURE_ACCESS[plan];
  return planFeatures?.includes(feature) || false;
}

// Get usage statistics for rate limiting
export async function getUsageStats() {
  const profile = await getUserProfile();
  const subscription = await getUserSubscription();

  if (!profile) {
    return { used: 0, limit: 0, plan: 'anonymous' };
  }

  const plan = subscription?.plan || 'free';
  const RATE_LIMITS = {
    free: 150,
    starter: 500,
    professional: -1, // Unlimited
  } as const;

  // Calculate current period usage (this month)
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // This would be implemented with actual QR generation count
  // For now, return placeholder data
  return {
    used: 0,
    limit: RATE_LIMITS[plan as keyof typeof RATE_LIMITS] || 150,
    plan,
    resetDate: new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      1
    ),
  };
}
