'use server';

import { getUser } from '@/app/actions/users';
import db from '@/db';
import { userConsentTable } from '@/db/schema';
import { nextjsCookieUtils } from '@/lib/cookie-consent/manager';
import type { ConsentPreferences } from '@/lib/cookie-consent/types';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

/**
 * Enhanced server action to save cookie consent preferences
 * - Saves to cookies for immediate access (existing behavior)
 * - Optionally saves to database for authenticated users (cross-device sync)
 * - Maintains audit trail for compliance
 */
export async function saveConsentPreferences(preferences: ConsentPreferences) {
  try {
    // Always save to cookies first (existing behavior)
    await nextjsCookieUtils.saveConsentToServer(preferences);

    // Get current user (if authenticated)
    const user = await getUser();

    // If user is authenticated, also save to database
    if (user?.id) {
      const headersList = await headers();
      const ipAddress =
        headersList.get('x-forwarded-for') ||
        headersList.get('x-real-ip') ||
        'unknown';
      const userAgent = headersList.get('user-agent') || 'unknown';

      // Insert new consent record (audit trail approach)
      await db.insert(userConsentTable).values({
        userId: user.id,
        necessary: preferences.necessary,
        functionality: preferences.functionality,
        analytics: preferences.analytics,
        marketing: preferences.marketing,
        ipAddress,
        userAgent,
      });

      console.log(`✅ Saved consent to database for user ${user.id}`);
    } else {
      console.log('ℹ️ Anonymous user - consent saved to cookies only');
    }

    // Revalidate relevant pages to reflect new consent state
    revalidatePath('/');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Failed to save consent preferences:', error);
    return {
      success: false,
      error: 'Failed to save consent preferences',
    };
  }
}

/**
 * Load consent preferences with database fallback
 * 1. Try cookies first (faster)
 * 2. If user is logged in and no cookies, check database
 */
export async function loadConsentPreferences() {
  try {
    // First, try loading from cookies (existing behavior)
    const cookieConsent = await nextjsCookieUtils.loadConsentFromServer();

    if (cookieConsent) {
      return {
        success: true,
        source: 'cookies',
        data: cookieConsent,
      };
    }

    // If no cookies and user is authenticated, try database
    const user = await getUser();

    if (user?.id) {
      const latestConsent = await db
        .select()
        .from(userConsentTable)
        .where(eq(userConsentTable.userId, user.id))
        .orderBy(desc(userConsentTable.createdAt))
        .limit(1);

      if (latestConsent.length > 0) {
        const dbConsent = latestConsent[0];

        // Convert database format to cookie format
        const consentData = {
          hasConsented: true,
          consentDate: dbConsent.consentDate.toISOString(),
          preferences: {
            necessary: dbConsent.necessary,
            functionality: dbConsent.functionality,
            analytics: dbConsent.analytics,
            marketing: dbConsent.marketing,
          },
          version: dbConsent.version,
        };

        // Also set cookies for faster future access
        await nextjsCookieUtils.saveConsentToServer(consentData.preferences);

        return {
          success: true,
          source: 'database',
          data: consentData,
        };
      }
    }

    return {
      success: true,
      source: 'none',
      data: null,
    };
  } catch (error) {
    console.error('Failed to load consent preferences:', error);
    return {
      success: false,
      error: 'Failed to load consent preferences',
      data: null,
    };
  }
}

/**
 * Get user's consent history (for account settings page)
 */
export async function getUserConsentHistory() {
  try {
    const user = await getUser();

    if (!user?.id) {
      return {
        success: false,
        error: 'User not authenticated',
        data: [],
      };
    }

    const consentHistory = await db
      .select()
      .from(userConsentTable)
      .where(eq(userConsentTable.userId, user.id))
      .orderBy(desc(userConsentTable.createdAt));

    return {
      success: true,
      data: consentHistory,
    };
  } catch (error) {
    console.error('Failed to get consent history:', error);
    return {
      success: false,
      error: 'Failed to get consent history',
      data: [],
    };
  }
}

/**
 * Server action to clear all consent data
 * Clears both cookies and database records
 */
export async function clearConsentPreferences() {
  try {
    // Clear cookies (existing behavior)
    await nextjsCookieUtils.deleteServerCookie('cookie-consent');

    // Also clear any analytics/marketing cookies
    await nextjsCookieUtils.deleteServerCookie('_ga');
    await nextjsCookieUtils.deleteServerCookie('_ga_*');
    await nextjsCookieUtils.deleteServerCookie('_fbp');
    await nextjsCookieUtils.deleteServerCookie('_gcl_au');

    // If user is authenticated, mark database records as withdrawn
    const user = await getUser();

    if (user?.id) {
      // Don't delete records (audit trail), just mark as withdrawn
      await db
        .update(userConsentTable)
        .set({
          withdrawnDate: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userConsentTable.userId, user.id));

      console.log(`✅ Marked consent as withdrawn for user ${user.id}`);
    }

    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Failed to clear consent preferences:', error);
    return {
      success: false,
      error: 'Failed to clear consent preferences',
    };
  }
}
