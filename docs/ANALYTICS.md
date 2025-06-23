# Analytics System

Simple analytics system for tracking platform and user statistics without complexity.

## Overview

Instead of calculating statistics on-demand (which is slow and loses historical data), we use dedicated analytics tables that store pre-computed metrics.

## Tables

### Platform Statistics (`platform_stats`)
- **Purpose**: Daily platform-wide metrics
- **Updated**: Once per day via cron job
- **Contains**: Total users, QR codes, templates, revenue + daily increments

### Daily User Statistics (`daily_user_stats`)
- **Purpose**: Individual user activity by day
- **Updated**: Real-time as users perform actions
- **Contains**: QR codes generated, templates created/used, revenue

## Usage

### Tracking User Activity

```typescript
import { trackUserActivity } from '@/lib/analytics';

// Track when user generates QR code
await trackUserActivity(userId, {
  qrCodesGenerated: 1,
  revenue: 2550, // 25.50 EUR in cents
});

// Track when user creates template
await trackUserActivity(userId, {
  templatesCreated: 1,
});
```

### Getting Platform Stats

```typescript
import { getPlatformStatsLatest } from '@/lib/analytics';

const stats = await getPlatformStatsLatest();
console.log(`Total QR codes: ${stats.totalQrCodes}`);
```

### Getting User Stats

```typescript
import { getUserStatsAnalytics } from '@/lib/analytics';

// Get user stats for current month
const stats = await getUserStatsAnalytics(
  userId, 
  '2024-12-01', 
  '2024-12-31'
);
```

## Benefits

- **Performance**: No expensive COUNT queries
- **Historical Data**: Full timeline preserved 
- **Scalability**: Pre-computed stats scale infinitely
- **Reliability**: Analytics failures don't break main features

## Daily Jobs

### Update Platform Stats

Run this once per day to update platform statistics:

```bash
curl -X POST /api/v1/analytics/update-platform-stats
```

Or set up a cron job:
```bash
# At 1 AM every day
0 1 * * * curl -X POST https://your-domain.com/api/v1/analytics/update-platform-stats
```

## Using Date-fns

The system uses date-fns for all date operations:

```typescript
import { format } from 'date-fns';

// Format date for database
const today = format(new Date(), 'yyyy-MM-dd');

// Use existing utilities
import { getMonthlyBoundaries } from '@/lib/date-utils';
```

## Migration

When switching from calculation-based to analytics-based stats:

1. **Keep old functions** for fallback during transition
2. **Gradually migrate** components to use new analytics
3. **Verify data accuracy** before fully switching over
4. **Remove old stats** once analytics are proven reliable

## Components Updated

- `app/actions/stats.ts` - Platform stats from analytics tables
- `app/actions/dashboard.ts` - User stats with analytics fallback  
- `app/actions/qr-codes.ts` - Automatic activity tracking
- `components/dashboard/stats-labels.tsx` - Uses new analytics
- `app/(website)/components/stats.tsx` - Uses new analytics

## Future Enhancements

- Clerk webhook integration for accurate user counts
- Redis caching for frequently accessed stats
- Analytics dashboard with charts and trends
- Export functionality for data analysis 