import db from '@/db';
import {
  limitPurchasesTable,
  qrGenerationsTable,
  usersTable,
} from '@/db/schema';
import { addMonths, startOfMonth } from 'date-fns';
import { and, count, desc, eq, gte, sql } from 'drizzle-orm';

// 🎯 Core Business Constants
export const QR_LIMIT_PROGRESSION = [50, 150, 250, 350, 450, 500] as const;
export const TOPUP_PRICE_CENTS = 299; // €2.99
export const SUBSCRIPTION_PRICE_CENTS = 999; // €9.99/month
export const SUBSCRIPTION_QR_LIMIT = 500;

// Calculate bonus QR codes for first top-up
export const FIRST_TOPUP_BONUS = 100; // 50 -> 150 gives user 100 extra codes

// 🔍 Core Database Functions

/**
 * Get user's current QR usage and limits
 */
export async function getUserQrUsage(userId: string) {
  const user = await db
    .select({
      monthlyQrLimit: usersTable.monthlyQrLimit,
      qrCodesUsedThisMonth: usersTable.qrCodesUsedThisMonth,
      topUpCount: usersTable.topUpCount,
      subscriptionPlan: usersTable.subscriptionPlan,
      limitResetDate: usersTable.limitResetDate,
      totalSpentOnTopups: usersTable.totalSpentOnTopups,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .limit(1);

  if (!user.length) {
    throw new Error('User not found');
  }

  const userData = user[0];
  const remaining = Math.max(
    0,
    userData.monthlyQrLimit - userData.qrCodesUsedThisMonth
  );
  const isNearLimit = remaining <= 5;
  const hasExceededLimit = remaining === 0;

  return {
    ...userData,
    remaining,
    isNearLimit,
    hasExceededLimit,
    canUpgrade: userData.topUpCount < QR_LIMIT_PROGRESSION.length - 1,
    nextLimit: getNextQrLimit(userData.topUpCount),
    isSubscriber: userData.subscriptionPlan === 'starter',
  };
}

/**
 * Get the next QR limit based on current top-up count
 */
export function getNextQrLimit(currentTopUpCount: number): number | null {
  if (currentTopUpCount >= QR_LIMIT_PROGRESSION.length - 1) {
    return null; // Already at max limit
  }
  return QR_LIMIT_PROGRESSION[currentTopUpCount + 1];
}

/**
 * Check if user has enough QR codes remaining
 */
export async function canUserGenerateQr(userId: string): Promise<{
  canGenerate: boolean;
  reason?: string;
  usage: Awaited<ReturnType<typeof getUserQrUsage>>;
}> {
  const usage = await getUserQrUsage(userId);

  if (usage.hasExceededLimit) {
    return {
      canGenerate: false,
      reason: 'Monthly QR code limit exceeded',
      usage,
    };
  }

  return {
    canGenerate: true,
    usage,
  };
}

/**
 * Increment user's QR usage count
 */
export async function incrementQrUsage(userId: string): Promise<void> {
  await db
    .update(usersTable)
    .set({
      qrCodesUsedThisMonth: sql`${usersTable.qrCodesUsedThisMonth} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId));
}

/**
 * Reset monthly usage for all users (to be run by cron job)
 */
export async function resetMonthlyUsage(): Promise<void> {
  const nextMonth = addMonths(startOfMonth(new Date()), 1);

  await db.update(usersTable).set({
    qrCodesUsedThisMonth: 0,
    limitResetDate: nextMonth.toISOString().split('T')[0], // Convert to date string
    updatedAt: new Date(),
  });
}

/**
 * Reset monthly usage for a specific user
 */
export async function resetUserMonthlyUsage(userId: string): Promise<void> {
  const nextMonth = addMonths(startOfMonth(new Date()), 1);

  await db
    .update(usersTable)
    .set({
      qrCodesUsedThisMonth: 0,
      limitResetDate: nextMonth.toISOString().split('T')[0], // Convert to date string
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId));
}

/**
 * Process a top-up purchase - increase QR limit
 */
export async function processTopUpPurchase(
  userId: string,
  stripePaymentIntentId?: string
): Promise<{
  success: boolean;
  newLimit: number;
  bonusQrCodes?: number;
  error?: string;
}> {
  try {
    const usage = await getUserQrUsage(userId);

    // Check if user can still upgrade
    if (!usage.canUpgrade) {
      return {
        success: false,
        newLimit: usage.monthlyQrLimit,
        error: 'Already at maximum QR limit',
      };
    }

    const previousLimit = usage.monthlyQrLimit;
    const newTopUpCount = usage.topUpCount + 1;
    const newLimit = QR_LIMIT_PROGRESSION[newTopUpCount];

    // Calculate bonus QR codes for first purchase
    const bonusQrCodes = newTopUpCount === 1 ? FIRST_TOPUP_BONUS : undefined;

    // Update user's limits
    await db
      .update(usersTable)
      .set({
        monthlyQrLimit: newLimit,
        topUpCount: newTopUpCount,
        totalSpentOnTopups: usage.totalSpentOnTopups + TOPUP_PRICE_CENTS,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    // Record the purchase
    await db.insert(limitPurchasesTable).values({
      userId,
      purchaseType: 'topup',
      previousLimit,
      newLimit,
      amountPaid: TOPUP_PRICE_CENTS,
      stripePaymentIntentId,
    });

    return {
      success: true,
      newLimit,
      bonusQrCodes,
    };
  } catch (error) {
    console.error('Error processing top-up purchase:', error);
    return {
      success: false,
      newLimit: 0,
      error: 'Failed to process purchase',
    };
  }
}

/**
 * Process subscription purchase - set to subscription plan
 */
export async function processSubscriptionPurchase(
  userId: string,
  stripePaymentIntentId?: string
): Promise<{
  success: boolean;
  newLimit: number;
  error?: string;
}> {
  try {
    const usage = await getUserQrUsage(userId);
    const previousLimit = usage.monthlyQrLimit;

    // Set subscription plan and limit
    await db
      .update(usersTable)
      .set({
        subscriptionPlan: 'starter',
        monthlyQrLimit: SUBSCRIPTION_QR_LIMIT,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, userId));

    // Record the purchase
    await db.insert(limitPurchasesTable).values({
      userId,
      purchaseType: 'subscription',
      previousLimit,
      newLimit: SUBSCRIPTION_QR_LIMIT,
      amountPaid: SUBSCRIPTION_PRICE_CENTS,
      stripePaymentIntentId,
    });

    return {
      success: true,
      newLimit: SUBSCRIPTION_QR_LIMIT,
    };
  } catch (error) {
    console.error('Error processing subscription purchase:', error);
    return {
      success: false,
      newLimit: 0,
      error: 'Failed to process subscription',
    };
  }
}

/**
 * Get purchase history for a user
 */
export async function getUserPurchaseHistory(userId: string) {
  return await db
    .select()
    .from(limitPurchasesTable)
    .where(eq(limitPurchasesTable.userId, userId))
    .orderBy(desc(limitPurchasesTable.purchasedAt));
}

/**
 * Calculate economics guidance for user
 */
export function calculateEconomicsGuidance(
  usage: Awaited<ReturnType<typeof getUserQrUsage>>
) {
  const currentUsage = usage.qrCodesUsedThisMonth;
  const currentLimit = usage.monthlyQrLimit;

  // If user consistently uses close to their limit, suggest upgrade
  const utilizationRate = currentUsage / currentLimit;

  if (utilizationRate >= 0.8 && usage.canUpgrade) {
    const nextLimit = getNextQrLimit(usage.topUpCount);
    const additionalQrCodes = nextLimit ? nextLimit - currentLimit : 0;
    const costPerQr = TOPUP_PRICE_CENTS / additionalQrCodes;

    return {
      shouldUpgrade: true,
      reasoning: `You're using ${Math.round(utilizationRate * 100)}% of your limit. Upgrade for ${additionalQrCodes} more QR codes at ${(costPerQr / 100).toFixed(3)}€ per code.`,
      nextLimit,
      additionalQrCodes,
      costPerQr: costPerQr / 100, // Convert to euros
    };
  }

  if (currentUsage >= 400 && !usage.isSubscriber) {
    return {
      shouldUpgrade: false,
      shouldSubscribe: true,
      reasoning:
        'Consider our €9.99/month subscription for 500+ QR codes plus advanced features.',
      subscriptionValue: 'Better value for high-usage scenarios',
    };
  }

  return {
    shouldUpgrade: false,
    reasoning: 'Your current plan fits your usage well.',
  };
}

/**
 * Get user statistics for dashboard
 */
export async function getUserDashboardStats(userId: string) {
  const usage = await getUserQrUsage(userId);
  const purchaseHistory = await getUserPurchaseHistory(userId);
  const guidance = calculateEconomicsGuidance(usage);

  // Calculate this month's QR generations for progress tracking
  const thisMonth = startOfMonth(new Date());
  const qrGenerationsThisMonth = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, userId),
        gte(qrGenerationsTable.generatedAt, thisMonth)
      )
    );

  return {
    usage,
    purchaseHistory,
    guidance,
    qrGenerationsThisMonth: qrGenerationsThisMonth[0]?.count || 0,
  };
}
