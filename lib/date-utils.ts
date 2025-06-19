import {
  addDays,
  addMonths,
  endOfMonth,
  format,
  isValid,
  parseISO,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns';
import { sk } from 'date-fns/locale';

/**
 * Date utility functions using date-fns
 * Centralized date operations for consistency across the application
 */

// Period calculations for rate limiting and analytics
export const getPeriodBoundaries = (
  window: '7d' | '30d',
  baseDate = new Date()
) => {
  switch (window) {
    case '7d':
      return {
        start: subDays(baseDate, 7),
        end: baseDate,
        reset: addDays(baseDate, 7),
      };
    case '30d':
      return {
        start: startOfMonth(baseDate),
        end: baseDate,
        reset: addMonths(startOfMonth(baseDate), 1),
      };
    default:
      throw new Error(`Unsupported window: ${window}`);
  }
};

// Monthly analytics helpers
export const getMonthlyBoundaries = (baseDate = new Date()) => {
  const currentMonthStart = startOfMonth(baseDate);
  const lastMonth = subMonths(baseDate, 1);

  return {
    currentMonth: {
      start: currentMonthStart,
      end: baseDate,
    },
    lastMonth: {
      start: startOfMonth(lastMonth),
      end: endOfMonth(lastMonth),
    },
    nextReset: addMonths(currentMonthStart, 1),
  };
};

// Formatting helpers for Slovak locale
export const formatDateSlovak = (date: Date | string, formatString = 'PP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';

  return format(dateObj, formatString, { locale: sk });
};

export const formatDateTimeSlovak = (date: Date | string) => {
  return formatDateSlovak(date, 'PPp');
};

export const formatDateShortSlovak = (date: Date | string) => {
  return formatDateSlovak(date, 'dd.MM.yyyy');
};

// Common date ranges for analytics
export const getAnalyticsRanges = (baseDate = new Date()) => ({
  today: {
    start: startOfMonth(baseDate),
    end: baseDate,
  },
  last30Days: {
    start: subDays(baseDate, 30),
    end: baseDate,
  },
  last7Days: {
    start: subDays(baseDate, 7),
    end: baseDate,
  },
  thisMonth: {
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate),
  },
  lastMonth: {
    start: startOfMonth(subMonths(baseDate, 1)),
    end: endOfMonth(subMonths(baseDate, 1)),
  },
});

// Validation helpers
export const isValidDateString = (dateString: string): boolean => {
  return isValid(parseISO(dateString));
};

export const safeParseDateString = (dateString: string): Date | null => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};
