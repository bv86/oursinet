// Google Analytics and tracking configuration

import { sendGAEvent } from '@next/third-parties/google';
import { getEnvString } from './utils';

export const GA_MEASUREMENT_ID = getEnvString(
  'GA_MEASUREMENT_ID',
  'G-XXXXXXXXXX'
);

// Utility functions for tracking custom events

export const trackPageView = (title: string, url: string) => {
  sendGAEvent('event', 'page_view', {
    page_title: title,
    page_location: url,
  });
};

/**
 * Track a custom event in Google Analytics
 * @param action - The action name
 * @param options - Optional parameters for the event
 */
export const trackEvent = (action: string, options?: object) => {
  sendGAEvent('event', action, options || {});
};
