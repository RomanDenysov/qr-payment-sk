'use server';

import db from '@/db';
import { paymentTemplatesTable, qrGenerationsTable } from '@/db/schema';
import { getMonthlyBoundaries } from '@/lib/date-utils';
import { protectedAction } from '@/lib/safe-action';
import { unstable_cache } from '@/lib/unstable-cache';
import { and, count, desc, eq, gte, lt } from 'drizzle-orm';
import { z } from 'zod';

export const getUserDashboardStats = protectedAction.action(
  async ({ ctx }: any) => {
    const { userId } = ctx;
    try {
      const { currentMonth, lastMonth } = getMonthlyBoundaries();

      const [currentMonthStats, lastMonthStats] = await Promise.all([
        db
          .select({ count: count() })
          .from(qrGenerationsTable)
          .where(
            and(
              eq(qrGenerationsTable.userId, userId),
              gte(qrGenerationsTable.generatedAt, currentMonth.start)
            )
          ),
        db
          .select({ count: count() })
          .from(qrGenerationsTable)
          .where(
            and(
              eq(qrGenerationsTable.userId, userId),
              gte(qrGenerationsTable.generatedAt, lastMonth.start),
              lt(qrGenerationsTable.generatedAt, lastMonth.end)
            )
          ),
      ]);

      const currentMonthQRs = currentMonthStats[0]?.count ?? 0;
      const lastMonthQRs = lastMonthStats[0]?.count ?? 0;

      const [totalQRsResult] = await db
        .select({ count: count() })
        .from(qrGenerationsTable)
        .where(eq(qrGenerationsTable.userId, userId));

      const [activeTemplatesResult] = await db
        .select({ count: count() })
        .from(paymentTemplatesTable)
        .where(
          and(
            eq(paymentTemplatesTable.userId, userId),
            eq(paymentTemplatesTable.isActive, true)
          )
        );

      const totalQRs = totalQRsResult?.count ?? 0;
      const activeTemplates = activeTemplatesResult?.count ?? 0;

      const growthPercentage =
        lastMonthQRs > 0
          ? ((currentMonthQRs - lastMonthQRs) / lastMonthQRs) * 100
          : // biome-ignore lint/nursery/noNestedTernary: <explanation>
            currentMonthQRs > 0
            ? 100
            : 0;

      return {
        currentMonthQRs,
        totalQRs,
        activeTemplates,
        growthPercentage: Math.round(growthPercentage * 100) / 100,
      };
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error('Error getting user dashboard stats:', error);
      return {
        currentMonthQRs: 0,
        totalQRs: 0,
        activeTemplates: 0,
        growthPercentage: 0,
      };
    }
  }
);

const getCachedRecentQRGenerations = unstable_cache(
  async (userId: string, limit: number) => {
    return await db.query.qrGenerationsTable.findMany({
      with: {
        template: true,
      },
      where: eq(qrGenerationsTable.userId, userId),
      orderBy: desc(qrGenerationsTable.generatedAt),
      limit: limit || 10,
    });
  },
  ['recent-qr-generations'],
  {
    revalidate: 60,
  }
);

export const getRecentQRGenerations = protectedAction
  .inputSchema(z.object({ limit: z.number() }))
  .action(async ({ parsedInput, ctx }: any) => {
    const { limit } = parsedInput;
    const { userId } = ctx;
    return await getCachedRecentQRGenerations(userId, limit);
  });

export const getCurrentUsageStats = protectedAction.action(
  async ({ ctx }: any) => {
    const { userId } = ctx;
    const { currentMonth, nextReset } = getMonthlyBoundaries();

    const [currentUsage] = await db
      .select({ count: count() })
      .from(qrGenerationsTable)
      .where(
        and(
          eq(qrGenerationsTable.userId, userId),
          gte(qrGenerationsTable.generatedAt, currentMonth.start)
        )
      );

    // TODO: Get actual plan from billing
    const plan = 'free';
    const limit = 150;

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
);

const getCachedUserTemplates = unstable_cache(
  async (userId: string) => {
    return await db.query.paymentTemplatesTable.findMany({
      where: and(
        eq(paymentTemplatesTable.userId, userId),
        eq(paymentTemplatesTable.isActive, true)
      ),
      orderBy: desc(paymentTemplatesTable.usageCount),
    });
  },
  ['user-templates'],
  {
    revalidate: 60,
  }
);

export const getUserTemplates = protectedAction.action(async ({ ctx }: any) => {
  const { userId } = ctx;
  return await getCachedUserTemplates(userId);
});
