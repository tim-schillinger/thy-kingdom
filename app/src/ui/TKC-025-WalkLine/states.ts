import type { WalkLineProps } from './WalkLine';
export const ID = 'TKC-025', NAME = 'WalkLine', VERSION = '0.3';
export const STATES: Array<{ name: string; props: WalkLineProps }> = [
  { name: 'done', props: { walk: 'Morning Walk', mark: 'done', line: '7 of 7 done' } },
  { name: 'part done', props: { walk: 'Morning Walk', mark: 'part', line: '3 of 7 done' } },
  { name: 'not started', props: { walk: 'Evening Walk', mark: 'open', line: '0 of 7 done' } },
  { name: 'future day', props: { walk: 'Evening Walk', mark: 'none', line: 'You can start it tomorrow' } },
  { name: 'future day · weekday', props: { walk: 'Morning Walk', mark: 'none', line: 'You can start it Friday' } },
  { name: 'future day · date', props: { walk: 'Morning Walk', mark: 'none', line: 'You can start it Wed, Oct 21' } },
  { name: 'pressed', props: { walk: 'Morning Walk', mark: 'done', line: '7 of 7 done', show: 'pressed' } },
  { name: 'focus', props: { walk: 'Morning Walk', mark: 'done', line: '7 of 7 done', show: 'focus' } },
];
