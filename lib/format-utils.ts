import { validateIBAN } from 'ngx-iban-validator';

/**
 * Formats a number for display with proper Slovak locale formatting
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('sk-SK').format(num);
}

/**
 * Formats currency for display with proper Slovak locale formatting
 */
export function formatCurrency(amount: string | undefined | null): string {
  if (!amount || amount === '') {
    return '€0.00';
  }

  const numAmount = Number.parseFloat(amount);
  if (Number.isNaN(numAmount)) {
    return '€0.00';
  }

  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR',
  }).format(numAmount);
}

/**
 * Format large numbers with proper units (K, M, B)
 */
export function formatLargeNumber(num: number | undefined | null): string {
  // Handle undefined/null values gracefully
  if (num === undefined || num === null || Number.isNaN(num)) {
    return '0';
  }

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

/**
 * Validates any IBAN format and checksum using ngx-iban-validator
 * @param iban - IBAN string (with or without spaces)
 * @returns true if valid IBAN
 */
export function validateIbanChecksum(iban: string): boolean {
  if (!iban) return false;

  const cleanIban = iban.replace(/\s+/g, '').toUpperCase();
  const validationResult = validateIBAN(cleanIban);

  // The library returns null for valid IBANs, or an object with errors for invalid ones
  return validationResult === null;
}

/**
 * Validates Slovak IBAN format and checksum using ngx-iban-validator
 * @param iban - IBAN string (with or without spaces)
 * @returns true if valid Slovak IBAN
 */
export function validateSlovakIban(iban: string): boolean {
  if (!iban) return false;

  // Clean IBAN by removing spaces
  const cleanIban = iban.replace(/\s+/g, '').toUpperCase();

  // Check if it's a Slovak IBAN (SK + 22 digits = 24 total)
  if (!/^SK\d{22}$/.test(cleanIban)) {
    return false;
  }

  // Use the library to validate IBAN checksum
  const validationResult = validateIBAN(cleanIban);

  // The library returns null for valid IBANs, or an object with errors for invalid ones
  return validationResult === null;
}

/**
 * Convert euros to cents for database storage
 * @param euros - Amount in euros (e.g., 25.50)
 * @returns Amount in cents (e.g., 2550)
 */
export function eurosToCents(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Convert cents to euros for display
 * @param cents - Amount in cents (e.g., 2550)
 * @returns Amount in euros (e.g., 25.50)
 */
export function centsToEuros(cents: number): number {
  return cents / 100;
}

/**
 * Format amount from cents to currency string
 * @param cents - Amount in cents
 * @param locale - Locale for formatting (default: 'sk-SK')
 * @returns Formatted currency string (e.g., "25,50 €")
 */
export function formatAmountFromCents(cents: number, locale = 'sk-SK'): string {
  const euros = centsToEuros(cents);
  return formatCurrency(euros.toString());
}
