import type { ProverbsExtrasProps } from './ProverbsExtras';
export const ID = 'TKC-037', NAME = 'ProverbsExtras', VERSION = '0.2 (no States build: rule, then your eye)';
export const STATES: Array<{ name: string; props: ProverbsExtrasProps }> = [
  { name: 'several left (3, February)', props: { kind: 'offer', left: 3, next: 5, monthName: 'February', days: 28 } }, { name: 'after a tap (2)', props: { kind: 'offer', left: 2, next: 6, monthName: 'February', days: 28 } },
  { name: 'one left (November)', props: { kind: 'offer', left: 1, next: 5, monthName: 'November', days: 30 } }, { name: 'one left, longest button', props: { kind: 'offer', left: 1, next: 31, monthName: 'September', days: 30 } },
  { name: 'on pace (1 extra)', props: { kind: 'row' } }, { name: 'on pace (3 extras)', props: { kind: 'row', extras: 3 } }, { name: 'finished', props: { kind: 'row', finished: true } },
  { name: 'button focus', props: { kind: 'offer', left: 3, next: 5, monthName: 'February', days: 28, show: { which: 'button', state: 'focus' } } }, { name: '✕ pressed', props: { kind: 'offer', left: 3, next: 5, monthName: 'February', days: 28, show: { which: 'x', state: 'pressed' } } },
];
