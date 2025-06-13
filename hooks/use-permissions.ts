'use client';

import { useEffect, useState } from 'react';

export interface Permissions {
  canCreateTemplate: boolean;
  canDuplicateTemplate: boolean;
  canShareTemplate: boolean;
  canCollaborate: boolean;
  canExportAnalytics: boolean;
  canUseAPI: boolean;
  canCustomizeBranding: boolean;
}

export interface UsageTracking {
  templates: {
    current: number;
    limit: number;
    remaining: number;
  };
  qrCodes: {
    current: number;
    limit: number;
    remaining: number;
  };
}

// Mock permissions based on plan
export function usePermissions(
  plan: 'starter' | 'business' | 'professional' = 'starter'
) {
  const [permissions, setPermissions] = useState<Permissions>({
    canCreateTemplate: false,
    canDuplicateTemplate: false,
    canShareTemplate: false,
    canCollaborate: false,
    canExportAnalytics: false,
    canUseAPI: false,
    canCustomizeBranding: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const permissionMap: Record<string, Permissions> = {
        starter: {
          canCreateTemplate: true, // 1 template allowed
          canDuplicateTemplate: false,
          canShareTemplate: false,
          canCollaborate: false,
          canExportAnalytics: false,
          canUseAPI: false,
          canCustomizeBranding: false,
        },
        business: {
          canCreateTemplate: true,
          canDuplicateTemplate: true,
          canShareTemplate: true,
          canCollaborate: false,
          canExportAnalytics: true,
          canUseAPI: false,
          canCustomizeBranding: true,
        },
        professional: {
          canCreateTemplate: true,
          canDuplicateTemplate: true,
          canShareTemplate: true,
          canCollaborate: true,
          canExportAnalytics: true,
          canUseAPI: true,
          canCustomizeBranding: true,
        },
      };

      setPermissions(permissionMap[plan]);
      setIsLoading(false);
    }, 1000);
  }, [plan]);

  return { permissions, isLoading };
}

// Mock usage tracking
export function useUsageTracking(
  plan: 'starter' | 'business' | 'professional' = 'starter'
) {
  const [usage, setUsage] = useState<UsageTracking>({
    templates: { current: 0, limit: 1, remaining: 1 },
    qrCodes: { current: 0, limit: 50, remaining: 50 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const usageMap: Record<string, UsageTracking> = {
        starter: {
          templates: { current: 1, limit: 1, remaining: 0 },
          qrCodes: { current: 23, limit: 50, remaining: 27 },
        },
        business: {
          templates: { current: 3, limit: 5, remaining: 2 },
          qrCodes: { current: 234, limit: 1000, remaining: 766 },
        },
        professional: {
          templates: { current: 8, limit: -1, remaining: -1 },
          qrCodes: { current: 1247, limit: -1, remaining: -1 },
        },
      };

      setUsage(usageMap[plan]);
      setIsLoading(false);
    }, 1000);
  }, [plan]);

  return { usage, isLoading };
}

// Mock upgrade flow
export function useUpgradeFlow() {
  const handleUpgrade = (plan: 'business' | 'professional') => {
    console.log(`Upgrading to ${plan} plan...`);
    // Here you would integrate with Stripe or your payment provider
    alert(`Redirecting to ${plan} plan upgrade...`);
  };

  return { handleUpgrade };
}
