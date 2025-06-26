'use server';

import {
  getUserDashboardStats,
  getUserQrUsage,
  processSubscriptionPurchase,
  processTopUpPurchase,
} from '@/lib/qr-limits';

import { revalidatePath } from 'next/cache';

// Get user's QR usage and dashboard stats
export const getUserQrDashboardStats = async (userId: string) => {
  const stats = await getUserDashboardStats(userId);

  return stats;
};

// Mock purchase action for development (replace with Stripe integration)
export const purchaseQrTopUp = async (
  userId: string,
  mockPurchase: boolean
) => {
  // TODO: In production, integrate with Stripe for actual payment processing
  // For now, simulate successful payment
  if (!mockPurchase) {
    throw new Error('Only mock purchases are supported in development');
  }

  // Check current usage to ensure user can still upgrade
  const currentUsage = await getUserQrUsage(userId);

  if (!currentUsage.canUpgrade) {
    throw new Error('Cannot upgrade - already at maximum QR limit');
  }

  // Process the top-up purchase
  const result = await processTopUpPurchase(userId, 'mock_payment_intent_dev');

  if (!result.success) {
    throw new Error(result.error || 'Failed to process top-up purchase');
  }

  // Revalidate relevant pages
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/generator');

  return result;
};

// Mock subscription action for development (replace with Stripe integration)
export const purchaseSubscription = async (
  userId: string,
  mockPurchase: boolean
) => {
  // In production, this would include Stripe subscription details
  if (!mockPurchase) {
    throw new Error('Only mock purchases are supported in development');
  }

  // TODO: In production, integrate with Stripe for actual subscription management
  // For now, simulate successful subscription
  if (!mockPurchase) {
    throw new Error('Only mock purchases are supported in development');
  }

  // Check if user is already a subscriber
  const currentUsage = await getUserQrUsage(userId);

  if (currentUsage.isSubscriber) {
    throw new Error('User is already a subscriber');
  }

  // Process the subscription purchase
  const result = await processSubscriptionPurchase(
    userId,
    'mock_subscription_dev'
  );

  if (!result.success) {
    throw new Error(result.error || 'Failed to process subscription');
  }

  // Revalidate relevant pages
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/generator');

  return result;
};

// Get user's current QR usage (for real-time updates)
export const getCurrentQrUsage = async (userId: string) => {
  const usage = await getUserQrUsage(userId);

  return usage;
};

// Admin action to reset user's monthly usage (for testing/support)
export const resetUserMonthlyUsage = async (
  userId: string,
  targetUserId: string
) => {
  // TODO: Add admin role checking here
  // For now, users can only reset their own usage

  if (targetUserId !== userId) {
    throw new Error('Unauthorized - can only reset your own usage');
  }

  const { resetUserMonthlyUsage } = await import('@/lib/qr-limits');
  await resetUserMonthlyUsage(targetUserId);

  // Revalidate relevant pages
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/generator');

  return { userId: targetUserId };
};

// Type exports for frontend usage
export type QrDashboardStatsResult = Awaited<
  ReturnType<typeof getUserQrDashboardStats>
>;
export type QrTopUpResult = Awaited<ReturnType<typeof purchaseQrTopUp>>;
export type SubscriptionResult = Awaited<
  ReturnType<typeof purchaseSubscription>
>;
export type CurrentUsageResult = Awaited<ReturnType<typeof getCurrentQrUsage>>;
