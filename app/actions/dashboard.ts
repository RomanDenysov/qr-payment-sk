'use server';

import db from '@/db';
import {
  paymentTemplatesTable,
  profilesTable,
  qrGenerationsTable,
} from '@/db/schema';
import { getMonthlyBoundaries } from '@/lib/date-utils';
import { unstable_cache } from '@/lib/unstable-cache';
import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, gte, lt } from 'drizzle-orm';

// Get dashboard statistics
export async function getUserStats() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user profile
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  // Return default stats if no profile exists
  if (!profile.length) {
    return {
      currentMonthQRs: 0,
      totalQRs: 0,
      activeTemplates: 0,
      growthPercentage: 0,
    };
  }

  const profileId = profile[0].id;

  // Get date boundaries using our utility
  const { currentMonth, lastMonth } = getMonthlyBoundaries();

  // Get current month stats
  const [currentMonthQRs] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profileId),
        gte(qrGenerationsTable.generatedAt, currentMonth.start)
      )
    );

  // Get last month stats for comparison
  const [lastMonthQRs] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profileId),
        gte(qrGenerationsTable.generatedAt, lastMonth.start),
        lt(qrGenerationsTable.generatedAt, lastMonth.end)
      )
    );

  // Get total QR generations
  const [totalQRs] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(eq(qrGenerationsTable.userId, profileId));

  // Get active templates count
  const [activeTemplates] = await db
    .select({ count: count() })
    .from(paymentTemplatesTable)
    .where(
      and(
        eq(paymentTemplatesTable.userId, profileId),
        eq(paymentTemplatesTable.isActive, true)
      )
    );

  // Calculate growth percentage
  const growthPercentage =
    lastMonthQRs.count > 0
      ? ((currentMonthQRs.count - lastMonthQRs.count) / lastMonthQRs.count) *
        100
      : currentMonthQRs.count > 0
        ? 100
        : 0;

  return {
    currentMonthQRs: currentMonthQRs.count,
    totalQRs: totalQRs.count,
    activeTemplates: activeTemplates.count,
    growthPercentage: Math.round(growthPercentage * 100) / 100,
  };
}

// Cached function that only handles DB operations
const getCachedRecentQRGenerations = unstable_cache(
  async (profileId: string, limit: number) => {
    return db.query.qrGenerationsTable.findMany({
      with: {
        template: true,
        userIban: true,
      },
      where: eq(qrGenerationsTable.userId, profileId),
      orderBy: desc(qrGenerationsTable.generatedAt),
      limit: limit || 10,
    });
  },
  ['recent-qr-generations'],
  {
    revalidate: 60,
  }
);

// Wrapper function that handles auth and calls the cached function
export async function getRecentQRGenerations(limit: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user profile
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  // Return empty array if no profile exists
  if (!profile.length) {
    return [];
  }

  // Call the cached function with profileId
  return getCachedRecentQRGenerations(profile[0].id, limit);
}

// Get usage statistics for current period
export async function getCurrentUsageStats() {
  const { userId } = await auth();

  if (!userId) {
    return {
      used: 0,
      limit: 150, // Default free plan limit
      remaining: 150,
      plan: 'free',
      resetDate: new Date(),
    };
  }

  // Get user profile
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  // Return default usage stats if no profile exists
  if (!profile.length) {
    const { nextReset } = getMonthlyBoundaries();
    return {
      used: 0,
      limit: 150,
      remaining: 150,
      plan: 'free',
      resetDate: nextReset,
    };
  }

  // Get date boundaries using our utility
  const { currentMonth, nextReset } = getMonthlyBoundaries();

  const [currentUsage] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profile[0].id),
        gte(qrGenerationsTable.generatedAt, currentMonth.start)
      )
    );

  // TODO: Get actual plan from Clerk billing
  // For now, default to free plan
  const plan = 'free';
  const limit = 150; // Free plan limit

  const used = currentUsage.count;
  const remaining = Math.max(0, limit - used);

  return {
    used,
    limit,
    remaining,
    plan,
    resetDate: nextReset,
  };
}

export async function getUserTemplates() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Get user profile
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  // Return empty array if no profile exists
  if (!profile.length) {
    return [];
  }

  const templates = await db
    .select()
    .from(paymentTemplatesTable)
    .where(
      and(
        eq(paymentTemplatesTable.userId, profile[0].id),
        eq(paymentTemplatesTable.isActive, true)
      )
    )
    .orderBy(desc(paymentTemplatesTable.usageCount));

  return templates;
}
