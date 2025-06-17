'use server';

import db from '@/db';
import {
  paymentTemplatesTable,
  profilesTable,
  qrGenerationsTable,
} from '@/db/schema';
import { unstable_cache } from '@/lib/unstable-cache';
import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, gte } from 'drizzle-orm';

// Helper function to get start of current month
function getStartOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// Types for dashboard data
export interface UserStats {
  qrCodesGenerated: number;
  templatesCount: number;
  monthlyGenerated: number;
  totalTemplates: number;
}

export interface QrGenerationHistory {
  id: string;
  amount: string;
  iban: string;
  description: string | null;
  templateName: string | null;
  generatedAt: Date;
  variableSymbol: bigint;
  qrData: string;
  status: string;
}

export interface PaymentTemplate {
  id: string;
  name: string;
  iban: string;
  amount: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Pure cached functions that only depend on parameters
const getCachedUserStats = unstable_cache(
  async (profileId: string): Promise<UserStats> => {
    const startOfCurrentMonth = getStartOfCurrentMonth();

    const [totalQrGenerated, templatesCount, monthlyGenerated] =
      await Promise.all([
        db
          .select({ count: count() })
          .from(qrGenerationsTable)
          .where(eq(qrGenerationsTable.userId, profileId)),

        db
          .select({ count: count() })
          .from(paymentTemplatesTable)
          .where(
            and(
              eq(paymentTemplatesTable.userId, profileId),
              eq(paymentTemplatesTable.isActive, true)
            )
          ),

        db
          .select({ count: count() })
          .from(qrGenerationsTable)
          .where(
            and(
              eq(qrGenerationsTable.userId, profileId),
              gte(qrGenerationsTable.generatedAt, startOfCurrentMonth)
            )
          ),
      ]);

    return {
      qrCodesGenerated: totalQrGenerated[0].count,
      templatesCount: templatesCount[0].count,
      monthlyGenerated: monthlyGenerated[0].count,
      totalTemplates: templatesCount[0].count,
    };
  },
  ['user-stats'],
  { revalidate: 300 }
);

const getCachedUserTemplates = unstable_cache(
  async (profileId: string): Promise<PaymentTemplate[]> => {
    return await db
      .select()
      .from(paymentTemplatesTable)
      .where(
        and(
          eq(paymentTemplatesTable.userId, profileId),
          eq(paymentTemplatesTable.isActive, true)
        )
      )
      .orderBy(desc(paymentTemplatesTable.usageCount))
      .limit(10);
  },
  ['user-templates'],
  { revalidate: 300 }
);

// Public functions that handle auth and call cached functions
export async function getUserStats(): Promise<UserStats> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const profile = await getUserProfile();
  if (!profile) {
    throw new Error('Profile not found');
  }

  return getCachedUserStats(profile.id);
}

export async function getUserTemplates(): Promise<PaymentTemplate[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const profile = await getUserProfile();
  if (!profile) {
    throw new Error('Profile not found');
  }

  return getCachedUserTemplates(profile.id);
}

export async function getQrHistory(
  limit?: number
): Promise<QrGenerationHistory[]> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const profile = await getUserProfile();
  if (!profile) {
    throw new Error('Profile not found');
  }

  // For now, fetch directly without complex caching to avoid type issues
  return await db
    .select()
    .from(qrGenerationsTable)
    .where(eq(qrGenerationsTable.userId, profile.id))
    .orderBy(desc(qrGenerationsTable.generatedAt))
    .limit(limit || 20);
}

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

export async function checkUsageLimit(): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  const profile = await getUserProfile();

  if (!profile) {
    // No profile means user hasn't completed setup, return anonymous limits
    return { allowed: false, remaining: 0 };
  }

  const startOfCurrentMonth = getStartOfCurrentMonth();

  const monthlyUsage = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profile.id),
        gte(qrGenerationsTable.generatedAt, startOfCurrentMonth)
      )
    );

  const used = monthlyUsage[0].count;
  const limits = {
    free: 150,
    starter: 500,
    professional: -1, // unlimited
  };

  // Default to free plan if no subscription found
  const limit = limits.free;
  const allowed = limit === -1 || used < limit;
  const remaining = limit === -1 ? -1 : Math.max(0, limit - used);

  return { allowed, remaining };
}
