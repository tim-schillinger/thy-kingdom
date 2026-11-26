import type { StreakProps } from './Streak';
export const ID = 'TKC-026', NAME = 'Streak', VERSION = '0.3';
export const STATES: Array<{ name: string; props: StreakProps }> = [
  { name: 'chip, below 2 days', props: { days: 1 } }, { name: 'chip, 12-day streak', props: { days: 12, stage: 1 } }, { name: 'chip, 1,000-day streak', props: { days: 1000, stage: 4 } },
  { name: 'chip, pressed', props: { days: 12, stage: 1, show: 'pressed' } }, { name: 'chip, focus', props: { days: 12, stage: 1, show: 'focus' } },
  { name: 'badge, 3 days', props: { kind: 'badge', days: 3 } }, { name: 'badge, 13 days', props: { kind: 'badge', days: 13, stage: 1 } }, { name: 'badge, 365 days', props: { kind: 'badge', days: 365, stage: 4 } },
  { name: 'card, 23 days, longest 30', props: { kind: 'card', days: 23, stage: 2, longest: 30 } }, { name: 'card, 56 days, longest yet', props: { kind: 'card', days: 56, stage: 2, longest: 56 } },
  { name: 'card, below 2, a longest', props: { kind: 'card', days: 1, stage: 2, longest: 30 } }, { name: 'card, first day (Rachel)', props: { kind: 'card', days: 1, stage: 0 } },
];
