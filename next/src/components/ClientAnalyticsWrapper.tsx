'use client';

import { PageAnalytics } from './PageAnalytics';

// This wrapper exists to allow using PageAnalytics from Server Components
// without using dynamic imports with 'ssr: false'
export default function ClientAnalyticsWrapper({
  contentId,
  contentType,
  category,
  tags,
}: {
  contentId: string;
  contentType: string;
  category?: string;
  tags?: string[];
}) {
  return (
    <PageAnalytics
      contentId={contentId}
      contentType={contentType}
      category={category}
      tags={tags}
    />
  );
}
