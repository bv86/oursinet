'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

/**
 * A hook that tracks page views in a Next.js app.
 *
 * This is particularly useful for tracking client-side navigation in Next.js
 * since the GoogleAnalytics component only tracks the initial page load.
 * @param title - The title of the page to be tracked.
 */
export function usePageTracking(title: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create URL from pathname and search params
    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Track page view
    trackPageView(title, url);
  }, [pathname, searchParams, title]);
}
