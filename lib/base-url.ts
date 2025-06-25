import { env } from '@/env';

/**
 * Get the base URL for the application
 * Works in all environments: client, server, edge runtime
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (if set)
 * 2. VERCEL_URL (Vercel deployments)
 * 3. Localhost (development)
 */
export function getBaseUrl(): string {
  // Browser should use relative path
  if (typeof window !== 'undefined') {
    return '';
  }

  // User-defined URL (highest priority)
  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL;
  }

  // Vercel URL (production/preview)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development fallback
  return 'http://localhost:3000';
}

/**
 * Get absolute URL for any path
 * @param path - Path to append to base URL (with or without leading slash)
 */
export function getAbsoluteUrl(path = ''): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
}

/**
 * Get base URL for static assets (images, etc.)
 * Useful for email templates and meta tags
 */
export function getStaticUrl(assetPath = ''): string {
  return getAbsoluteUrl(`/static/${assetPath.replace(/^\//, '')}`);
}

/**
 * Get canonical URL for SEO
 * @param path - Page path
 */
export function getCanonicalUrl(path = ''): string {
  return getAbsoluteUrl(path);
}
