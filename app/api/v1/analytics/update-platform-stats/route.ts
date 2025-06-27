import { updatePlatformStats } from '@/lib/analytics/internal';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to update platform statistics
 * This can be called by cron jobs or manually for testing
 *
 * POST /api/v1/analytics/update-platform-stats
 */
export async function POST(request: NextRequest) {
  try {
    // Simple security: check for auth header or API key
    const authHeader = request.headers.get('authorization');
    const apiKey = request.headers.get('x-api-key');

    // In development, allow without auth for testing
    if (process.env.NODE_ENV === 'production' && !authHeader && !apiKey) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      );
    }

    // Update platform stats
    await updatePlatformStats();

    return NextResponse.json({
      success: true,
      message: 'Platform statistics updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to update platform stats:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update platform statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET method for testing/status check
 */

// biome-ignore lint/suspicious/useAwait: <explanation>
export async function GET() {
  return NextResponse.json({
    endpoint: 'Analytics Platform Stats Update',
    method: 'POST',
    description: 'Updates daily platform statistics',
    usage: 'curl -X POST /api/v1/analytics/update-platform-stats',
  });
}
