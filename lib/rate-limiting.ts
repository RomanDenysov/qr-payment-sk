import 'server-only';

import db from '@/db';
import { businessProfilesTable, qrGenerationsTable } from '@/db/schema';
import { getPeriodBoundaries } from '@/lib/date-utils';
import { auth } from '@clerk/nextjs/server';
import { and, count, eq, gte } from 'drizzle-orm';
import { ProfileNotFoundError, RateLimitError } from './errors';
import {
  type PlanType,
  RATE_LIMITS,
  type UsageStatus,
} from './rate-limiting-constants';

// Get start of period based on window
function getStartOfPeriod(window: string): Date {
  return getPeriodBoundaries(window as '7d' | '30d').start;
}

// Get reset date based on window
function getResetDate(window: string): Date {
  return getPeriodBoundaries(window as '7d' | '30d').reset;
}

// Check usage for authenticated users using Clerk's native billing
export async function checkUserUsageLimit(): Promise<UsageStatus> {
  const { has, userId } = await auth();

  if (!userId) {
    throw new ProfileNotFoundError();
  }

  const profile = await db.query.businessProfilesTable.findFirst({
    where: eq(businessProfilesTable.clerkId, userId),
  });

  if (!profile) {
    throw new ProfileNotFoundError();
  }

  // Determine plan using Clerk's native billing
  let plan: PlanType = 'free'; // Default to free

  if (has({ plan: 'professional' })) {
    plan = 'professional';
  } else if (has({ plan: 'starter' })) {
    plan = 'starter';
  }

  const planConfig = RATE_LIMITS[plan];

  // Calculate period boundaries
  const periodStart = getStartOfPeriod(planConfig.window);
  const resetDate = getResetDate(planConfig.window);

  // Count current period usage
  const usage = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.clerkId, profile.clerkId),
        gte(qrGenerationsTable.generatedAt, periodStart)
      )
    );

  const used = usage[0].count;
  const limit = planConfig.limit;

  // Check if limit exceeded
  if (limit !== -1 && used >= limit) {
    throw new RateLimitError(
      `${plan} plan limit exceeded. ${used}/${limit} QR codes used this period.`,
      { used, limit, plan, resetDate }
    );
  }

  return {
    allowed: true,
    used,
    remaining: limit === -1 ? -1 : Math.max(0, limit - used),
    limit,
    plan,
    resetDate,
  };
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

  return await {
    allowed: true,
    used: 0, // Placeholder
    remaining: limit,
    limit,
    plan: 'anonymous',
    resetDate,
  };
}

// Get user plan details using Clerk's native billing
export async function getUserPlan(): Promise<{
  plan: PlanType;
  hasApiAccess: boolean;
  hasWebhooks: boolean;
  hasWhiteLabel: boolean;
}> {
  const { has, userId } = await auth();
  if (!userId) {
    throw new ProfileNotFoundError();
  }

  let plan: PlanType = 'free';

  if (has({ plan: 'professional' })) {
    plan = 'professional';
  } else if (has({ plan: 'starter' })) {
    plan = 'starter';
  }

  return {
    plan,
    hasApiAccess: has({ feature: 'api_access' }),
    hasWebhooks: has({ feature: 'webhooks' }),
    hasWhiteLabel: has({ feature: 'white_label' }),
  };
}

// Get usage statistics for dashboard
export async function getUserUsageStats(): Promise<{
  current: UsageStatus;
  monthlyTrend: Array<{ date: string; count: number }>;
}> {
  const { userId } = await auth();

  if (!userId) {
    throw new ProfileNotFoundError();
  }

  const currentUsage = await checkUserUsageLimit();

  // Get daily usage for the last 30 days using our utility
  const { start: thirtyDaysAgo } = getPeriodBoundaries('30d');

  const profile = await db.query.businessProfilesTable.findFirst({
    where: eq(businessProfilesTable.clerkId, userId),
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

  // Plan distribution would need to be calculated from Clerk's billing data
  // For now, return placeholder data
  const planDistribution: Record<PlanType, number> = {
    anonymous: 0,
    free: totalUsers[0].count, // Assume all users are free for now
    starter: 0,
    professional: 0,
  };

  return {
    totalUsers: totalUsers[0].count,
    totalQrCodes: totalQrCodes[0].count,
    monthlyGenerated: monthlyGenerated[0].count,
    planDistribution,
  };
}
