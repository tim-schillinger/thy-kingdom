import type { ActionBarProps } from './ActionBar';
export const ID = 'TKC-003', NAME = 'ActionBar', VERSION = '0.9';
// 0.7 (571, 572): the primary names where it goes, then an arrow; Back and Skip are 52 px pills with a 1.5 px ink-2 edge (A12).
export const STATES: Array<{ name: string; props: ActionBarProps }> = [
  { name: 'step 1 (Skip · Proverb →)', props: { back: false, to: 'Proverb' } },
  { name: 'steps 2–6 (Back · Skip · Bible Reading →)', props: { to: 'Bible Reading' } },
  { name: 'inside a multi-part step (Question 2 →)', props: { to: 'Question 2' } },
  { name: 'step 7 (Complete Morning Walk)', props: { next: 'Complete Morning Walk' } },
  { name: 'last step, others still open (Still Open →)', props: { to: 'Still Open' } },
  { name: 'read ahead (Back · Proverb →)', props: { skip: false, to: 'Proverb' } },
  { name: 'name-night foot', props: { below: 'Complete Evening Walk' } },
  { name: 'completion foot (Amen)', props: { foot: 'completion', next: 'Amen', sub: 'Complete Day' } },
  { name: 'two-button foot', props: { foot: 'two', next: 'Go to Morning Walk', below: 'Back to Today' } },
  { name: 'Walk Complete foot (Back to Today)', props: { foot: 'completion', next: 'Back to Today' } },
  { name: '200% stacked (Bible Reading →)', props: { to: 'Bible Reading', stacked: true } },
  { name: '200% stacked (Complete Evening Walk)', props: { next: 'Complete Evening Walk', stacked: true } },
  { name: 'Next pressed', props: { to: 'Bible Reading', show: { which: 'next', state: 'pressed' } } },
  { name: 'Back focus', props: { to: 'Bible Reading', show: { which: 'back', state: 'focus' } } },
  { name: 'Skip focus', props: { to: 'Bible Reading', show: { which: 'skip', state: 'focus' } } },
];
