'use server';

import db from '@/db';
import {
  paymentTemplatesTable,
  profilesTable,
  qrGenerationsTable,
} from '@/db/schema';
import { unstable_cache } from '@/lib/unstable-cache';
import { count, sql } from 'drizzle-orm';

export type PlatformStats = {
  totalUsers: number;
  totalQrCodes: number;
  totalTemplates: number;
  totalRevenue: string;
};

type StatsResponse = {
  success: boolean;
  data: PlatformStats | null;
  error: string | null;
};

/**
 * Calculates platform statistics directly from actual data tables
 * This ensures data consistency and eliminates the need for a separate stats table
 */
const calculatePlatformStats = async (): Promise<StatsResponse> => {
  try {
    // Calculate all stats in parallel for better performance
    const [usersResult, qrCodesResult, templatesResult, revenueResult] =
      await Promise.all([
        // Total number of registered users
        db
          .select({ count: count() })
          .from(profilesTable),

        // Total number of generated QR codes
        db
          .select({ count: count() })
          .from(qrGenerationsTable),

        // Total number of payment templates created
        db
          .select({ count: count() })
          .from(paymentTemplatesTable),

        // Total revenue from all QR codes (sum of amounts)
        db
          .select({
            total: sql<string>`COALESCE(SUM(${qrGenerationsTable.amount}), 0)::text`,
          })
          .from(qrGenerationsTable),
      ]);

    const stats: PlatformStats = {
      totalUsers: usersResult[0]?.count ?? 0,
      totalQrCodes: qrCodesResult[0]?.count ?? 0,
      totalTemplates: templatesResult[0]?.count ?? 0,
      totalRevenue: revenueResult[0]?.total ?? '0',
    };

    return {
      success: true,
      data: stats,
      error: null,
    };
  } catch (error) {
    console.error('Error calculating platform stats:', error);
    return {
      success: false,
      data: null,
      error: 'Failed to calculate platform statistics',
    };
  }
};

/**
 * Cached version of platform stats calculation
 * Uses the custom unstable_cache wrapper for optimal caching
 */
export const getPlatformStats = unstable_cache(
  calculatePlatformStats,
  ['platform-stats'],
  {
    revalidate: 600, // 10 minutes
  }
);

/**
 * Legacy function for backwards compatibility
 * @deprecated Use getPlatformStats directly
 */
export const getCachedPlatformStats = getPlatformStats;

/**
 * Get more detailed stats for admin dashboard
 */
const calculateDetailedStats = async () => {
  try {
    const [basicStats, recentQrCodes, topTemplates] = await Promise.all([
      calculatePlatformStats(),

      // Recent QR codes count (last 30 days)
      db
        .select({ count: count() })
        .from(qrGenerationsTable)
        .where(
          sql`${qrGenerationsTable.generatedAt} >= NOW() - INTERVAL '30 days'`
        ),

      // Most used templates
      db
        .select({
          templateName: paymentTemplatesTable.name,
          usageCount: paymentTemplatesTable.usageCount,
        })
        .from(paymentTemplatesTable)
        .orderBy(sql`${paymentTemplatesTable.usageCount} DESC`)
        .limit(5),
    ]);

    return {
      ...basicStats,
      recentQrCodes: recentQrCodes[0]?.count ?? 0,
      topTemplates,
    };
  } catch (error) {
    console.error('Error getting detailed stats:', error);
    throw error;
  }
};

/**
 * Cached version of detailed stats
 */
export const getDetailedStats = unstable_cache(
  calculateDetailedStats,
  ['detailed-platform-stats'],
  {
    revalidate: 900, // 15 minutes - longer cache for more expensive query
  }
);

/**
 * Invalidate stats cache when data changes
 * Call this after creating users, QR codes, or templates
 */
export async function invalidateStatsCache(): Promise<void> {
  const { revalidateTag } = await import('next/cache');
  revalidateTag('platform-stats');
  revalidateTag('detailed-platform-stats');
}

/**
 * Formats a number for display with proper Slovak locale formatting
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('sk-SK').format(num);
}

/**
 * Formats currency for display with proper Slovak locale formatting
 */
export function formatCurrency(amount: string): string {
  const numAmount = Number.parseFloat(amount);
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(numAmount);
}

/**
 * Format large numbers with proper units (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}
