'use server';

import db from '@/db';
import {
  paymentTemplatesTable,
  qrGenerationsTable,
  usersTable,
} from '@/db/schema';
import { centsToEuros } from '@/lib/format-utils';
import { unstable_cache } from '@/lib/unstable-cache';
import { and, count, eq, sum } from 'drizzle-orm';

// ##################################################################
// Platform-wide Statistics
// ##################################################################

export type PlatformStats = {
  totalUsers: number;
  totalQrCodes: number;
  averageRevenue: string;
};

type StatsResponse = {
  success: boolean;
  data: PlatformStats | null;
  error: string | null;
};

const getCurrentPlatformStats = async (): Promise<StatsResponse> => {
  try {
    const [totalUsers, qrStats] = await Promise.all([
      db.select({ count: count() }).from(usersTable),
      db
        .select({
          totalQrCodes: count(),
          totalRevenue: sum(qrGenerationsTable.amount),
        })
        .from(qrGenerationsTable),
    ]);

    const totalQrCodes = qrStats[0]?.totalQrCodes || 0;
    const totalRevenue = Number(qrStats[0]?.totalRevenue || 0);
    const averageRevenue = totalQrCodes > 0 ? totalRevenue / totalQrCodes : 0;

    const platformStats: PlatformStats = {
      totalUsers: totalUsers[0]?.count || 0,
      totalQrCodes,
      averageRevenue: centsToEuros(averageRevenue).toString(),
    };

    return {
      success: true,
      data: platformStats,
      error: null,
    };
  } catch (error) {
    console.error('Error getting homepage stats:', error);
    return {
      success: false,
      data: null,
      error: 'Failed to get homepage statistics',
    };
  }
};

export const getPlatformStatsAction = unstable_cache(
  async () => await getCurrentPlatformStats(),
  ['homepage-stats-v2'],
  {
    revalidate: 600, // 10 minutes
  }
);

// ##################################################################
// User-specific Statistics
// ##################################################################

export type UserStats = {
  totalQrCodes: number;
  averageRevenue: number; // In cents
  totalTemplates: number;
};

const _getUserStats = async (userId: string): Promise<UserStats> => {
  try {
    const [qrStats, templateStats] = await Promise.all([
      db
        .select({
          totalQrCodes: count(),
          totalRevenue: sum(qrGenerationsTable.amount),
        })
        .from(qrGenerationsTable)
        .where(eq(qrGenerationsTable.userId, userId)),
      db
        .select({ totalTemplates: count() })
        .from(paymentTemplatesTable)
        .where(
          and(
            eq(paymentTemplatesTable.userId, userId),
            eq(paymentTemplatesTable.isActive, true)
          )
        ),
    ]);

    const totalQrCodes = qrStats[0]?.totalQrCodes || 0;
    const totalRevenue = Number(qrStats[0]?.totalRevenue || 0);
    const averageRevenue = totalQrCodes > 0 ? totalRevenue / totalQrCodes : 0;

    return {
      totalQrCodes,
      averageRevenue: Math.round(averageRevenue), // in cents
      totalTemplates: templateStats[0]?.totalTemplates || 0,
    };
  } catch (error) {
    console.error('Failed to get user stats:', error);
    return {
      totalQrCodes: 0,
      averageRevenue: 0,
      totalTemplates: 0,
    };
  }
};

const getCachedUserStats = unstable_cache(
  async (userId: string) => {
    return _getUserStats(userId);
  },
  ['user-stats-v1'],
  {
    revalidate: 300, // 5 minutes
  }
);

export const getUserStatsAction = async (userId: string) => {
  return await getCachedUserStats(userId);
};
