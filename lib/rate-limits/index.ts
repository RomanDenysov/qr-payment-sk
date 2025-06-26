import 'server-only';

import db from '@/db';
import {
  businessProfilesTable,
  qrGenerationsTable,
  usersTable,
} from '@/db/schema';
import { auth } from '@/lib/auth';
import { getPeriodBoundaries } from '@/lib/date-utils';
import {
  canUserGenerateQr,
  getUserQrUsage,
  incrementQrUsage,
} from '@/lib/qr-limits';
import { count, eq, gte } from 'drizzle-orm';
import { headers } from 'next/headers';
import { ProfileNotFoundError, RateLimitError } from '../errors';
import { type PlanType, RATE_LIMITS, type UsageStatus } from './constants';

// Get start of period based on window
function getStartOfPeriod(window: string): Date {
  return getPeriodBoundaries(window as '7d' | '30d').start;
}

// Get reset date based on window
function getResetDate(window: string): Date {
  return getPeriodBoundaries(window as '7d' | '30d').reset;
}

// Check usage for authenticated users using the new QR limit system
export async function checkUserUsageLimit(): Promise<UsageStatus> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    throw new ProfileNotFoundError();
  }

  // Use new QR limit system
  const limitCheck = await canUserGenerateQr(userId);

  if (!limitCheck.canGenerate) {
    throw new RateLimitError(
      limitCheck.reason || 'QR generation limit exceeded',
      {
        used: limitCheck.usage.qrCodesUsedThisMonth,
        limit: limitCheck.usage.monthlyQrLimit,
        plan: limitCheck.usage.isSubscriber ? 'starter' : 'free',
        resetDate: new Date(limitCheck.usage.limitResetDate || new Date()),
      }
    );
  }

  // Determine plan type for compatibility with existing code
  const plan: PlanType = limitCheck.usage.isSubscriber ? 'starter' : 'free';

  return {
    allowed: true,
    used: limitCheck.usage.qrCodesUsedThisMonth,
    remaining: limitCheck.usage.remaining,
    limit: limitCheck.usage.monthlyQrLimit,
    plan,
    resetDate: new Date(limitCheck.usage.limitResetDate || new Date()),
  };
}

// Process QR generation and increment usage
export async function processQrGeneration(): Promise<void> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    throw new ProfileNotFoundError();
  }

  // Check if user can generate QR code
  await checkUserUsageLimit();

  // Increment usage count
  await incrementQrUsage(userId);
}

// Anonymous user rate limiting (simplified - in production use Redis/KV)
export async function checkAnonymousUsageLimit(
  ip: string
): Promise<UsageStatus> {
  const limit = RATE_LIMITS.anonymous.limit;
  const window = RATE_LIMITS.anonymous.window;

  // TODO: Implement proper IP-based rate limiting with Redis/KV store
  // For now, this is a placeholder that logs the check
  console.log(
    `Anonymous rate limit check for IP ${ip}: ${limit} per ${window}`
  );

  // In a real implementation, you would:
  // 1. Store IP-based counters in Redis with TTL
  // 2. Check current count for this IP
  // 3. Increment counter if within limits
  // 4. Throw RateLimitError if exceeded

  const resetDate = getResetDate(window);

  return {
    allowed: true,
    used: 0, // Placeholder
    remaining: limit,
    limit,
    plan: 'anonymous',
    resetDate,
  };
}

// Get user plan details using the new QR limit system
export async function getUserPlan(): Promise<{
  plan: PlanType;
  hasApiAccess: boolean;
  hasWebhooks: boolean;
  hasWhiteLabel: boolean;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    throw new ProfileNotFoundError();
  }

  const usage = await getUserQrUsage(userId);
  const plan: PlanType = usage.isSubscriber ? 'starter' : 'free';

  return {
    plan,
    hasApiAccess: usage.isSubscriber,
    hasWebhooks: false, // Future professional tier
    hasWhiteLabel: false, // Future professional tier
  };
}

// Get usage statistics for dashboard using the new system
export async function getUserUsageStats(): Promise<{
  current: UsageStatus;
  monthlyTrend: Array<{ date: string; count: number }>;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    throw new ProfileNotFoundError();
  }

  const currentUsage = await checkUserUsageLimit();

  // Get daily usage for the last 30 days using our utility
  const { start: thirtyDaysAgo } = getPeriodBoundaries('30d');

  const profile = await db.query.businessProfilesTable.findFirst({
    where: eq(businessProfilesTable.userId, userId),
  });

  if (!profile) {
    return {
      current: currentUsage,
      monthlyTrend: [],
    };
  }

  // This would typically be done with a GROUP BY date query
  // For now, return empty trend data
  const monthlyTrend: Array<{ date: string; count: number }> = [];

  return {
    current: currentUsage,
    monthlyTrend,
  };
}

// Get platform-wide usage statistics
export async function getPlatformUsageStats(): Promise<{
  totalUsers: number;
  totalQrCodes: number;
  monthlyGenerated: number;
  planDistribution: Record<PlanType, number>;
}> {
  const [totalUsers, totalQrCodes, monthlyGenerated] = await Promise.all([
    db.select({ count: count() }).from(businessProfilesTable),
    db.select({ count: count() }).from(qrGenerationsTable),
    db
      .select({ count: count() })
      .from(qrGenerationsTable)
      .where(gte(qrGenerationsTable.generatedAt, getStartOfPeriod('30d'))),
  ]);

  // Get plan distribution using new user system
  const usersByPlan = await db
    .select({
      subscriptionPlan: usersTable.subscriptionPlan,
      count: count(),
    })
    .from(usersTable)
    .groupBy(usersTable.subscriptionPlan);

  const planDistribution: Record<PlanType, number> = {
    anonymous: 0,
    free: 0,
    starter: 0,
    professional: 0,
  };

  for (const group of usersByPlan) {
    if (group.subscriptionPlan === 'starter') {
      planDistribution.starter = group.count;
    } else {
      planDistribution.free = group.count;
    }
  }

  return {
    totalUsers: totalUsers[0].count,
    totalQrCodes: totalQrCodes[0].count,
    monthlyGenerated: monthlyGenerated[0].count,
    planDistribution,
  };
}
