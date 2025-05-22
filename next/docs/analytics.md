# Website Analytics Setup

This document explains how to set up and use the analytics features for tracking website traffic.

## Google Analytics 4 Setup

The website uses Google Analytics 4 (GA4) to track page views and user interactions.

### Configuration

1. Create a Google Analytics 4 property in your Google Analytics account
2. Get your Measurement ID (it starts with "G-")
3. Add the Measurement ID to your environment variables:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Important Note About Next.js App Router

Next.js App Router uses a hybrid rendering model with both Server and Client Components:

- **Server Components** - rendered on the server, cannot use hooks or browser APIs
- **Client Components** - rendered in the browser, can use hooks and access browser APIs

All analytics components need to be used from Client Components because they need browser APIs. Our wrapper components make it possible to use them inside Server Components.

### Features Implemented

- **Page view tracking**: Automatically tracks page views on initial page load
- **Client-side navigation tracking**: Tracks page views during client-side navigation
- **Search tracking**: Records when users perform searches
- **Pagination tracking**: Monitors pagination navigation
- **Time on page tracking**: For blog articles, tracks how long users spend on the page

## Usage

### Basic Page Tracking

Basic page view tracking is handled automatically by the `GoogleAnalytics` component in the root layout.

### Enhanced Page Tracking

For more detailed tracking on specific pages, use the `PageAnalyticsWrapper` component in Server Components:

```tsx
import { PageAnalyticsWrapper } from '@/components/PageAnalyticsWrapper';

export default function MyServerComponent() {
  return (
    <>
      <PageAnalyticsWrapper
        contentId="unique-page-id"
        contentType="page-type"
      />
      {/* Rest of your page content */}
    </>
  );
}
```

Or use `PageAnalytics` directly in Client Components:

```tsx
'use client';

import { PageAnalytics } from '@/components/PageAnalytics';

export default function MyClientComponent() {
  return (
    <>
      <PageAnalytics contentId="unique-page-id" contentType="page-type" />
      {/* Rest of your component content */}
    </>
  );
}
```

### Tracking Custom Events

To track custom interactions in Server Components, use the `EventTracker` component:

```tsx
import { EventTracker } from '@/components/EventTracker';
import { Button } from '@/components/ui/button';

export default function MyServerComponent() {
  return (
    <EventTracker action="download" category="resource" label="pricing-pdf">
      <Button>Download Pricing</Button>
    </EventTracker>
  );
}
```

You can also use the `trackEvent` function directly in client components:

```tsx
'use client';

import { trackEvent } from '@/lib/analytics';

function handleClick() {
  // Do something
  trackEvent('button_click', 'engagement', 'submit_form');
}
```

## Viewing Analytics Data

Access your analytics data in the Google Analytics dashboard:

1. Log in to [Google Analytics](https://analytics.google.com/)
2. Navigate to your property
3. Use the "Reports" section to view:
   - Real-time user activity
   - Page views by URL
   - User engagement metrics
   - Custom events
   - Traffic sources

## Custom Dimensions and Metrics

You can extend the analytics setup by configuring custom dimensions and metrics in your Google Analytics property. Update the `analytics.ts` file to include these when sending events.

## Privacy Considerations

- The implementation respects user privacy by:
  - Only collecting data from users who have consented to cookies (if you implement a cookie consent solution)
  - Not collecting personally identifiable information
  - Respecting Do Not Track browser settings

## Troubleshooting

If tracking doesn't appear to be working:

1. Check that your Measurement ID is correctly set in the environment variables
2. Use the Google Analytics Debugger browser extension to verify events are being sent
3. Check for JavaScript errors in the browser console
4. Verify that ad blockers aren't preventing the analytics scripts from loading

### Common Errors

#### Server Component Errors

If you see an error like this:

```
Error: `ssr: false` is not allowed with `next/dynamic` in Server Components
```

This means you're trying to use a Client Component feature in a Server Component. Solutions:

1. Convert your component to a Client Component by adding `'use client'` at the top
2. Use the appropriate wrapper component (like `PageAnalyticsWrapper` or `EventTrackerWrapper`)
3. Move the analytics code to a Client Component
