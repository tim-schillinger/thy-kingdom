import type { PrayerKeyProps } from './PrayerKey';
export const ID = 'TKC-044', NAME = 'PrayerKey', VERSION = '0.2';
const T = 'Tonight, pray for 3 neighbors and select what you ask God for.';
export const STATES: Array<{ name: string; props: PrayerKeyProps }> = [
  { name: 'count line and Learn More', props: { text: T } }, { name: 'pressed', props: { text: T, show: 'pressed' } }, { name: 'focus', props: { text: T, show: 'focus' } },
  { name: 'one person', props: { text: 'Tonight, pray for 1 neighbor and select what you ask God for.' } },
  { name: 'Saturday', props: { text: 'Tonight, bring 2 requests to God and select what you ask Him for.' } },
];
