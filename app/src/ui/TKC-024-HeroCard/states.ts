import type { HeroCardProps } from './HeroCard';
export const ID = 'TKC-024', NAME = 'HeroCard', VERSION = '0.4';
const M = { walk: 'Morning Walk' as const, time: 'First hour of your day' };
const E = { walk: 'Evening Walk' as const, time: 'Last hour of your day' };
export const STATES: Array<{ name: string; props: HeroCardProps }> = [
  { name: 'morning · not started', props: { ...M, purpose: 'Start your day listening to God.', count: '0 of 7 done', button: 'Start Your Walk', next: 'Next: Sing' } },
  { name: 'morning · in progress', props: { ...M, count: '3 of 7 done', button: 'Continue Your Walk', next: 'Next: Proverb' } },
  { name: 'evening · not started', props: { ...E, purpose: 'End your day with God, praying for others.', count: '0 of 7 done', button: 'Start Your Walk', next: 'Next: Turn to God' } },
  { name: 'evening · in progress', props: { ...E, count: '4 of 7 done', button: 'Continue Your Walk', next: 'Next: Prayer' } },
  { name: 'past day (no time label)', props: { walk: 'Morning Walk', purpose: 'Start your day listening to God.', count: '0 of 7 done', button: 'Start Your Walk', next: 'Next: Sing' } },
  { name: 'longest button', props: { ...M, count: '4 of 7 done', button: 'Continue Your Walk', next: 'Next: Bible Reading' } },
  { name: 'See Steps pressed', props: { ...M, count: '3 of 7 done', button: 'Continue Your Walk', next: 'Next: Proverb', show: { which: 'see', state: 'pressed' } } },
  { name: 'See Steps focus', props: { ...M, count: '3 of 7 done', button: 'Continue Your Walk', next: 'Next: Proverb', show: { which: 'see', state: 'focus' } } },
  { name: 'button pressed', props: { ...M, purpose: 'Start your day listening to God.', count: '0 of 7 done', button: 'Start Your Walk', next: 'Next: Sing', show: { which: 'button', state: 'pressed' } } },
];
