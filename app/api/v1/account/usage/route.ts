import { checkUserUsageLimit, getUserUsageStats } from '@/lib/rate-limiting';
import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// GET endpoint for usage statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return Response.json(
        {
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Get usage statistics
    const [usageLimit, usageStats] = await Promise.all([
      checkUserUsageLimit(userId),
      getUserUsageStats(userId),
    ]);

    return Response.json({
      success: true,
      data: {
        current: {
          used: usageLimit.used,
          limit: usageLimit.limit,
          remaining: usageLimit.remaining,
          plan: usageLimit.plan,
          resetDate: usageLimit.resetDate.toISOString(),
        },
        monthlyTrend: usageStats.monthlyTrend,
      },
    });
  } catch (error) {
    console.error('Usage check error:', error);

    // Handle rate limit errors
    if (error instanceof Error && 'code' in error && 'statusCode' in error) {
      const rateLimitError = error as Error & {
        code: string;
        statusCode: number;
      };
      return Response.json(
        {
          error: rateLimitError.message,
          code: rateLimitError.code,
        },
        { status: rateLimitError.statusCode }
      );
    }

    return Response.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
