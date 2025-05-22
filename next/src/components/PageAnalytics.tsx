'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { usePageTracking } from '@/hooks/usePageTracking';

interface PageAnalyticsProps {
  /**
   * Unique identifier for the page or content
   * Could be a slug, ID, or other identifier
   */
  contentId: string;

  /**
   * Type of content (article, page, product, etc.)
   */
  contentType: string;

  /**
   * Category of the content
   */
  category?: string;

  /**
   * Additional tags to track with this page view
   */
  tags?: string[];
}

/**
 * Component to enhance page tracking with additional metadata
 *
 * Use this component in page templates where you need more detailed analytics,
 * such as blog posts, product pages, or landing pages.
 *
 * @example
 * <PageAnalytics
 *   contentId={post.slug}
 *   contentType="blog"
 *   category={post.category}
 *   tags={post.tags}
 * />
 */
export function PageAnalytics({ contentId, contentType }: PageAnalyticsProps) {
  // Use the basic page tracking
  usePageTracking(`${contentType} - ${contentId}`);

  const pathname = usePathname();

  // Track enhanced page view once when component mounts
  useEffect(() => {
    // Track time spent on page when component unmounts
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent > 5) {
        // Only track if spent more than 5 seconds
        trackEvent('time_on_page', { value: timeSpent });
      }
    };
  }, [pathname, contentId, contentType]);

  return null; // This component doesn't render anything
}
