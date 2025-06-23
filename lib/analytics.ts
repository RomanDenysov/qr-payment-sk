import db from '@/db';
import { dailyUserStatsTable, platformStatsTable } from '@/db/schema';
import { format } from 'date-fns';
import { and, eq, sql } from 'drizzle-orm';

/**
 * Super Simple Analytics - Just 3 metrics for homepage and user dashboard
 */

function getTodayDateString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Track user activity (only called from QR generation and template creation)
 */
export async function trackUserActivity(
  userId: string,
  activity: {
    qrCodesGenerated?: number;
    templatesCreated?: number;
    templatesUsed?: number;
    revenue?: number; // in cents
  }
) {
  const today = getTodayDateString();

  try {
    await db
      .insert(dailyUserStatsTable)
      .values({
        userId,
        date: today,
        qrCodesGenerated: activity.qrCodesGenerated || 0,
        templatesCreated: activity.templatesCreated || 0,
        templatesUsed: activity.templatesUsed || 0,
        revenue: activity.revenue || 0,
      })
      .onConflictDoUpdate({
        target: [dailyUserStatsTable.userId, dailyUserStatsTable.date],
        set: {
          qrCodesGenerated: sql`${dailyUserStatsTable.qrCodesGenerated} + ${activity.qrCodesGenerated || 0}`,
          templatesCreated: sql`${dailyUserStatsTable.templatesCreated} + ${activity.templatesCreated || 0}`,
          templatesUsed: sql`${dailyUserStatsTable.templatesUsed} + ${activity.templatesUsed || 0}`,
          revenue: sql`${dailyUserStatsTable.revenue} + ${activity.revenue || 0}`,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Failed to track user activity:', error);
  }
}

/**
 * Track authentication events
 * This is called from Better Auth hooks
 */
export async function trackAuthEvent(event: {
  type:
    | 'user_registered'
    | 'user_signed_in'
    | 'password_reset_requested'
    | 'auth_failed';
  userId?: string;
  userEmail?: string;
  metadata?: Record<string, string>;
}) {
  try {
    // Log the event for debugging and monitoring
    console.log('Auth Event:', {
      ...event,
      timestamp: new Date().toISOString(),
    });

    // Initialize user stats on registration
    if (event.type === 'user_registered' && event.userId) {
      await trackUserActivity(event.userId, {
        qrCodesGenerated: 0,
        templatesCreated: 0,
        templatesUsed: 0,
        revenue: 0,
      });
    }

    // Track daily sign-ins for engagement analytics
    if (event.type === 'user_signed_in' && event.userId) {
      await trackUserSignIn(event.userId);
    }

    // You can extend this to store auth events in a dedicated table
    // await storeAuthEventInDatabase(event);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Failed to track auth event:', error);
    // Don't throw - analytics shouldn't break the auth flow
  }
}

/**
 * Track user sign-in for engagement metrics
 */
async function trackUserSignIn(userId: string) {
  const today = getTodayDateString();

  try {
    // Update or create daily user stats to mark user as active
    await db
      .insert(dailyUserStatsTable)
      .values({
        userId,
        date: today,
        qrCodesGenerated: 0,
        templatesCreated: 0,
        templatesUsed: 0,
        revenue: 0,
        // Note: This ensures the user has a record for today
      })
      .onConflictDoUpdate({
        target: [dailyUserStatsTable.userId, dailyUserStatsTable.date],
        set: {
          updatedAt: new Date(), // Mark as active today
        },
      });
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Failed to track user sign-in:', error);
  }
}

/**
 * Get user engagement metrics
 */
export async function getUserEngagementStats(userId: string, days = 30) {
  const startDate = format(
    new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    'yyyy-MM-dd'
  );

  const stats = await db
    .select({
      activeDays: sql<number>`COUNT(DISTINCT ${dailyUserStatsTable.date})`,
      totalActivity: sql<number>`SUM(${dailyUserStatsTable.qrCodesGenerated} + ${dailyUserStatsTable.templatesCreated})`,
      lastActiveDate: sql<string>`MAX(${dailyUserStatsTable.date})`,
    })
    .from(dailyUserStatsTable)
    .where(
      and(
        eq(dailyUserStatsTable.userId, userId),
        sql`${dailyUserStatsTable.date} >= ${startDate}`
      )
    );

  return (
    stats[0] || {
      activeDays: 0,
      totalActivity: 0,
      lastActiveDate: null,
    }
  );
}

/**
 * Get user stats for a date range
 */
export async function getUserStatsAnalytics(
  userId: string,
  startDate: string,
  endDate?: string
) {
  const end = endDate || getTodayDateString();

  return await db
    .select({
      date: dailyUserStatsTable.date,
      qrCodesGenerated: dailyUserStatsTable.qrCodesGenerated,
      templatesCreated: dailyUserStatsTable.templatesCreated,
      templatesUsed: dailyUserStatsTable.templatesUsed,
      revenue: dailyUserStatsTable.revenue,
    })
    .from(dailyUserStatsTable)
    .where(
      and(
        eq(dailyUserStatsTable.userId, userId),
        sql`${dailyUserStatsTable.date} >= ${startDate}`,
        sql`${dailyUserStatsTable.date} <= ${end}`
      )
    )
    .orderBy(dailyUserStatsTable.date);
}

/**
 * Get latest platform stats
 */
export async function getPlatformStatsLatest() {
  const latestStats = await db
    .select()
    .from(platformStatsTable)
    .orderBy(sql`${platformStatsTable.date} DESC`)
    .limit(1);

  return (
    latestStats[0] || {
      qrCodesGenerated: 0,
      templatesCreated: 0,
      templatesUsed: 0,
      revenue: 0,
    }
  );
}

/**
 * Get platform stats for a date range (for charts)
 */
export async function getPlatformStatsRange(
  startDate: string,
  endDate?: string
) {
  const end = endDate || getTodayDateString();

  return await db
    .select()
    .from(platformStatsTable)
    .where(
      and(
        sql`${platformStatsTable.date} >= ${startDate}`,
        sql`${platformStatsTable.date} <= ${end}`
      )
    )
    .orderBy(platformStatsTable.date);
}

/**
 * Daily job: Update platform stats for today
 * This should be run once per day (via cron or scheduled job)
 */
export async function updatePlatformStats() {
  const today = getTodayDateString();

  try {
    // Calculate today's activity from all users
    const todayUserStats = await db
      .select({
        totalQrCodes: sql<number>`COALESCE(SUM(${dailyUserStatsTable.qrCodesGenerated}), 0)`,
        totalTemplatesCreated: sql<number>`COALESCE(SUM(${dailyUserStatsTable.templatesCreated}), 0)`,
        totalTemplatesUsed: sql<number>`COALESCE(SUM(${dailyUserStatsTable.templatesUsed}), 0)`,
        totalRevenue: sql<number>`COALESCE(SUM(${dailyUserStatsTable.revenue}), 0)`,
      })
      .from(dailyUserStatsTable)
      .where(eq(dailyUserStatsTable.date, today));

    const todayActivity = todayUserStats[0];

    // Update platform stats for today
    await db
      .insert(platformStatsTable)
      .values({
        date: today,
        qrCodesGenerated: todayActivity.totalQrCodes,
        templatesCreated: todayActivity.totalTemplatesCreated,
        templatesUsed: todayActivity.totalTemplatesUsed,
        revenue: todayActivity.totalRevenue,
      })
      .onConflictDoUpdate({
        target: [platformStatsTable.date],
        set: {
          qrCodesGenerated: todayActivity.totalQrCodes,
          templatesCreated: todayActivity.totalTemplatesCreated,
          templatesUsed: todayActivity.totalTemplatesUsed,
          revenue: todayActivity.totalRevenue,
          updatedAt: new Date(),
        },
      });

    // biome-ignore lint/suspicious/noConsole: <explanation>
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Platform stats updated for ${today}`);
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.error('Failed to update platform stats:', error);
    throw error;
  }
}
