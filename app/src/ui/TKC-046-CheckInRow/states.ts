import type { CheckInRowProps } from './CheckInRow';
export const ID = 'TKC-046', NAME = 'CheckInRow', VERSION = '0.1.2';
export const STATES: Array<{ name: string; props: CheckInRowProps }> = [
  { name: 'open', props: { name: 'Giving', status: 'open' } }, { name: 'open, pressed', props: { name: 'Giving', status: 'open', show: 'pressed' } }, { name: 'open, focus', props: { name: 'Giving', status: 'open', show: 'focus' } },
  { name: 'done', props: { name: 'Relationships', status: 'done' } }, { name: 'skipped', props: { name: 'Relationships', status: 'skipped' } },
];
