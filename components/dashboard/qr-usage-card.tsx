'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/format-utils';
import { SUBSCRIPTION_PRICE_CENTS, TOPUP_PRICE_CENTS } from '@/lib/qr-limits';
import type { getUserDashboardStats } from '@/lib/qr-limits';
import { AlertCircle, Crown, TrendingUp, Zap } from 'lucide-react';

interface QrUsageCardProps {
  stats: Awaited<ReturnType<typeof getUserDashboardStats>>;
  onUpgrade?: () => void;
  onSubscribe?: () => void;
}

export function QrUsageCard({
  stats,
  onUpgrade,
  onSubscribe,
}: QrUsageCardProps) {
  const { usage, guidance } = stats;

  const progressPercentage =
    usage.monthlyQrLimit > 0
      ? (usage.qrCodesUsedThisMonth / usage.monthlyQrLimit) * 100
      : 0;

  const resetDate = new Date(usage.limitResetDate || new Date());
  const daysUntilReset = Math.ceil(
    (resetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  // Get next upgrade details
  const nextLimit = usage.nextLimit;
  const additionalQrCodes = nextLimit ? nextLimit - usage.monthlyQrLimit : 0;
  const costPerQr =
    additionalQrCodes > 0 ? TOPUP_PRICE_CENTS / 100 / additionalQrCodes : 0;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-semibold text-lg">QR Code Usage</CardTitle>
        <div className="flex items-center space-x-2">
          {usage.isSubscriber ? (
            <Badge
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <Crown className="mr-1 h-3 w-3" />
              Subscriber
            </Badge>
          ) : (
            <Badge variant="secondary">Free Plan</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Overview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">This month</span>
            <span className="font-medium">
              {usage.qrCodesUsedThisMonth} / {usage.monthlyQrLimit} QR codes
            </span>
          </div>

          <Progress value={progressPercentage} className="h-2" />

          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>{usage.remaining} remaining</span>
            <span>Resets in {daysUntilReset} days</span>
          </div>
        </div>

        {/* Warning for low usage */}
        {usage.isNearLimit && !usage.hasExceededLimit && (
          <div className="flex items-center space-x-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-amber-800 text-sm">
              You're running low on QR codes. Consider upgrading.
            </span>
          </div>
        )}

        {/* Exceeded limit */}
        {usage.hasExceededLimit && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 text-sm">
              You've reached your monthly limit. Upgrade to generate more QR
              codes.
            </span>
          </div>
        )}

        <Separator />

        {/* Upgrade Options */}
        {!usage.isSubscriber && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Upgrade Options</h4>

            {/* Top-up Option */}
            {usage.canUpgrade && nextLimit && (
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900 text-sm">
                        One-time upgrade
                      </p>
                      <p className="text-blue-700 text-xs">
                        +{additionalQrCodes} QR codes (
                        {formatCurrency(costPerQr.toString())} per QR)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-900 text-sm">
                      {formatCurrency((TOPUP_PRICE_CENTS / 100).toString())}
                    </p>
                    <Button size="sm" onClick={onUpgrade} className="mt-1">
                      Upgrade
                    </Button>
                  </div>
                </div>

                {/* First upgrade bonus */}
                {usage.topUpCount === 0 && (
                  <p className="text-center text-green-600 text-xs">
                    🎉 First upgrade gets you 100 bonus QR codes!
                  </p>
                )}
              </div>
            )}

            {/* Subscription Option */}
            <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900 text-sm">
                    Monthly subscription
                  </p>
                  <p className="text-purple-700 text-xs">
                    500+ QR codes + advanced features
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-900 text-sm">
                  {formatCurrency((SUBSCRIPTION_PRICE_CENTS / 100).toString())}
                  /month
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onSubscribe}
                  className="mt-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Guidance */}
        {guidance.reasoning && (
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-gray-600 text-xs">
              💡 <strong>Recommendation:</strong> {guidance.reasoning}
            </p>
          </div>
        )}

        {/* Purchase History Summary */}
        {usage.totalSpentOnTopups > 0 && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground text-xs">
              Total spent on upgrades:{' '}
              {formatCurrency((usage.totalSpentOnTopups / 100).toString())}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
