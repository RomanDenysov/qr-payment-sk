'use server';

import db from '@/db';
import {
  paymentTemplatesTable,
  profilesTable,
  qrGenerationsTable,
} from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, count, desc, eq, gte, lt } from 'drizzle-orm';

// Get dashboard statistics
export async function getDashboardStats() {
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

  if (!profile.length) {
    throw new Error('Profile not found');
  }

  const profileId = profile[0].id;

  // Calculate date ranges
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get current month stats
  const [currentMonthQRs] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profileId),
        gte(qrGenerationsTable.generatedAt, startOfMonth)
      )
    );

  // Get last month stats for comparison
  const [lastMonthQRs] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profileId),
        gte(qrGenerationsTable.generatedAt, startOfLastMonth),
        lt(qrGenerationsTable.generatedAt, endOfLastMonth)
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

// Get recent QR generations
export async function getRecentQRGenerations(limit = 10) {
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

  if (!profile.length) {
    throw new Error('Profile not found');
  }

  const recentQRs = await db
    .select({
      id: qrGenerationsTable.id,
      templateName: qrGenerationsTable.templateName,
      amount: qrGenerationsTable.amount,
      variableSymbol: qrGenerationsTable.variableSymbol,
      generatedAt: qrGenerationsTable.generatedAt,
      status: qrGenerationsTable.status,
    })
    .from(qrGenerationsTable)
    .where(eq(qrGenerationsTable.userId, profile[0].id))
    .orderBy(desc(qrGenerationsTable.generatedAt))
    .limit(limit);

  return recentQRs;
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

  if (!profile.length) {
    return {
      used: 0,
      limit: 150,
      remaining: 150,
      plan: 'free',
      resetDate: new Date(),
    };
  }

  // Calculate current month usage
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [currentUsage] = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profile[0].id),
        gte(qrGenerationsTable.generatedAt, startOfMonth)
      )
    );

  // TODO: Get actual plan from Clerk billing
  // For now, default to free plan
  const plan = 'free';
  const limit = 150; // Free plan limit

  const used = currentUsage.count;
  const remaining = Math.max(0, limit - used);

  // Calculate next reset date (start of next month)
  const resetDate = new Date(startOfMonth);
  resetDate.setMonth(resetDate.getMonth() + 1);

  return {
    used,
    limit,
    remaining,
    plan,
    resetDate,
  };
}

// Aliases for backward compatibility with dashboard page
export async function getQrHistory(limit = 10) {
  return getRecentQRGenerations(limit);
}

export async function getUserStats() {
  return getDashboardStats();
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
