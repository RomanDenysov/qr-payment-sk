'use client';

import { useCallback } from 'react';

/**
 * Custom hook for invalidating stats cache from client components
 * Use this when you create/update/delete users, QR codes, or templates
 */
export function useStatsInvalidation() {
  const invalidateStats = useCallback(async () => {
    try {
      // Import the server action dynamically to avoid SSR issues
      const { invalidateStatsCache } = await import('@/app/actions/stats');
      await invalidateStatsCache();
    } catch (error) {
      console.error('Failed to invalidate stats cache:', error);
    }
  }, []);

  return { invalidateStats };
}

/**
 * Helper function to be called from server actions
 * when data that affects stats is modified
 */
export async function invalidateStatsFromServer() {
  try {
    const { invalidateStatsCache } = await import('@/app/actions/stats');
    await invalidateStatsCache();
  } catch (error) {
    console.error('Failed to invalidate stats cache from server:', error);
  }
}

// Re-export formatting utilities for convenience
export {
  formatNumber,
  formatCurrency,
  formatLargeNumber,
} from '@/lib/format-utils';
