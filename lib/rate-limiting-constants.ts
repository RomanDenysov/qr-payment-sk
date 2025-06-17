// Rate limits configuration
export const RATE_LIMITS = {
  anonymous: { limit: 10, window: '7d' }, // 10 QR codes per week
  free: { limit: 150, window: '30d' }, // 150 QR codes per month
  starter: { limit: 500, window: '30d' }, // 500 QR codes per month
  professional: { limit: -1, window: '30d' }, // Unlimited
} as const;

export type PlanType = keyof typeof RATE_LIMITS;

// Usage status interface
export interface UsageStatus {
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
  plan: PlanType;
  resetDate: Date;
}
