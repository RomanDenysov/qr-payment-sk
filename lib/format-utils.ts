/**
 * Formats a number for display with proper Slovak locale formatting
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('sk-SK').format(num);
}

/**
 * Formats currency for display with proper Slovak locale formatting
 */
export function formatCurrency(amount: string): string {
  const numAmount = Number.parseFloat(amount);
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(numAmount);
}

/**
 * Format large numbers with proper units (K, M, B)
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}
