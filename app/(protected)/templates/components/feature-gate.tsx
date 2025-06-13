'use client';

import { Skeleton } from '~/components/ui/skeleton';

interface FeatureGateProps {
  children: React.ReactNode;
  hasPermission: boolean;
  isLoading?: boolean;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  children,
  hasPermission,
  isLoading = false,
  fallback,
}: FeatureGateProps) {
  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
