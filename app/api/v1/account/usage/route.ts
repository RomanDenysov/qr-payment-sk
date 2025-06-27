import { auth } from '@/lib/auth';
import { checkUserUsageLimit, getUserUsageStats } from '@/lib/rate-limits';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

// GET endpoint for usage statistics
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Get usage statistics
    const [usageLimit, usageStats] = await Promise.all([
      checkUserUsageLimit(),
      getUserUsageStats(),
    ]);

    return NextResponse.json({
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
      return NextResponse.json(
        {
          error: rateLimitError.message,
          code: rateLimitError.code,
        },
        { status: rateLimitError.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
