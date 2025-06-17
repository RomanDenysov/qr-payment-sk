'use server';

import db from '@/db';
import {
  profilesTable,
  qrGenerationsTable,
  subscriptionsTable,
} from '@/db/schema';
import { and, count, eq, gte } from 'drizzle-orm';

// Rate limits configuration
export const RATE_LIMITS = {
  anonymous: { limit: 10, window: '7d' }, // 10 QR codes per week
  free: { limit: 150, window: '30d' }, // 150 QR codes per month
  starter: { limit: 500, window: '30d' }, // 500 QR codes per month
  professional: { limit: -1, window: '30d' }, // Unlimited
} as const;

export type PlanType = keyof typeof RATE_LIMITS;

// Usage status interface
export interface UsageStatus {
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
  plan: PlanType;
  resetDate: Date;
}

// Error for rate limiting
export class RateLimitError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode = 429) {
    super(message);
    this.name = 'RateLimitError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

// Get start of period based on window
function getStartOfPeriod(window: string): Date {
  const now = new Date();

  switch (window) {
    case '7d': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return weekAgo;
    }
    case '30d':
      return new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
    default:
      throw new Error(`Unsupported window: ${window}`);
  }
}

// Get reset date based on window
function getResetDate(window: string): Date {
  const now = new Date();

  switch (window) {
    case '7d': {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }
    case '30d':
      return new Date(now.getFullYear(), now.getMonth() + 1, 1); // Start of next month
    default:
      throw new Error(`Unsupported window: ${window}`);
  }
}

// Check usage for authenticated users
export async function checkUserUsageLimit(
  userId: string
): Promise<UsageStatus> {
  // Get user profile
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  if (!profile.length) {
    throw new RateLimitError(
      'User profile not found',
      'PROFILE_NOT_FOUND',
      404
    );
  }

  // Get user subscription
  const subscription = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, profile[0].id))
    .limit(1);

  const plan: PlanType = (subscription[0]?.plan as PlanType) || 'free';
  const planConfig = RATE_LIMITS[plan];

  // Check subscription status
  if (subscription[0]?.status === 'past_due') {
    throw new RateLimitError(
      'Payment required to continue using the service',
      'PAYMENT_REQUIRED',
      402
    );
  }

  if (subscription[0]?.status === 'canceled') {
    throw new RateLimitError(
      'Subscription canceled',
      'SUBSCRIPTION_CANCELED',
      403
    );
  }

  // Calculate period boundaries
  const periodStart = getStartOfPeriod(planConfig.window);
  const resetDate = getResetDate(planConfig.window);

  // Count current period usage
  const usage = await db
    .select({ count: count() })
    .from(qrGenerationsTable)
    .where(
      and(
        eq(qrGenerationsTable.userId, profile[0].id),
        gte(qrGenerationsTable.generatedAt, periodStart)
      )
    );

  const used = usage[0].count;
  const limit = planConfig.limit;

  // Check if limit exceeded
  if (limit !== -1 && used >= limit) {
    throw new RateLimitError(
      `${plan} plan limit exceeded. ${used}/${limit} QR codes used this period.`,
      'RATE_LIMIT_EXCEEDED',
      429
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

  return {
    allowed: true,
    used: 0, // Placeholder
    remaining: limit,
    limit,
    plan: 'anonymous',
    resetDate,
  };
}

// Get user subscription details
export async function getUserSubscription(userId: string): Promise<{
  plan: PlanType;
  status: string;
  subscription: typeof subscriptionsTable.$inferSelect | null;
}> {
  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  if (!profile.length) {
    return {
      plan: 'free',
      status: 'active',
      subscription: null,
    };
  }

  const subscription = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, profile[0].id))
    .limit(1);

  return {
    plan: (subscription[0]?.plan as PlanType) || 'free',
    status: subscription[0]?.status || 'active',
    subscription: subscription[0] || null,
  };
}

// Get usage statistics for dashboard
export async function getUserUsageStats(userId: string): Promise<{
  current: UsageStatus;
  monthlyTrend: Array<{ date: string; count: number }>;
}> {
  const currentUsage = await checkUserUsageLimit(userId);

  // Get daily usage for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const profile = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.clerkId, userId))
    .limit(1);

  if (!profile.length) {
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

// Check if user has access to specific features
export async function checkFeatureAccess(
  userId: string,
  feature: string
): Promise<boolean> {
  const { plan } = await getUserSubscription(userId);

  const featureAccess = {
    api_access: ['starter', 'professional'],
    templates: ['free', 'starter', 'professional'],
    history: ['free', 'starter', 'professional'],
    webhooks: ['professional'],
    customization: ['professional'],
    white_label: ['professional'],
    priority_support: ['starter', 'professional'],
  };

  const allowedPlans = featureAccess[feature as keyof typeof featureAccess];
  return allowedPlans ? allowedPlans.includes(plan) : false;
}

// Increment usage counter (for caching/analytics)
export async function incrementUsageCounter(
  userId: string,
  qrGenerationId: string
): Promise<void> {
  // This could be used for real-time analytics
  // or caching purposes in the future
  console.log(`Usage incremented for user ${userId}, QR: ${qrGenerationId}`);
}

// Get platform-wide usage statistics
export async function getPlatformUsageStats(): Promise<{
  totalUsers: number;
  totalQrCodes: number;
  monthlyGenerated: number;
  planDistribution: Record<PlanType, number>;
}> {
  const [totalUsers, totalQrCodes, monthlyGenerated] = await Promise.all([
    db.select({ count: count() }).from(profilesTable),
    db.select({ count: count() }).from(qrGenerationsTable),
    db
      .select({ count: count() })
      .from(qrGenerationsTable)
      .where(gte(qrGenerationsTable.generatedAt, getStartOfPeriod('30d'))),
  ]);

  // Get plan distribution
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  const planDistribution: Record<PlanType, number> = {
    anonymous: 0,
    free: 0,
    starter: 0,
    professional: 0,
  };

  for (const sub of subscriptions) {
    const plan = sub.plan as PlanType;
    if (plan in planDistribution) {
      planDistribution[plan]++;
    }
  }

  // Count free users (users without active subscriptions)
  const freeUsers = totalUsers[0].count - subscriptions.length;
  planDistribution.free = freeUsers;

  return {
    totalUsers: totalUsers[0].count,
    totalQrCodes: totalQrCodes[0].count,
    monthlyGenerated: monthlyGenerated[0].count,
    planDistribution,
  };
}
