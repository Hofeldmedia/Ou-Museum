import { track } from '@vercel/analytics';

export function trackEvent(name: string, data = {}) {
  track(name, data);
}
