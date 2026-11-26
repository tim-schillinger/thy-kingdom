import type { ComingUpProps } from './ComingUp';
export const ID = 'TKC-027', NAME = 'ComingUp', VERSION = '0.2';
const EW = { title: 'Evening Walk', when: 'Tonight starting at 6 pm · Last hour of your day', onChange: () => {} };
export const STATES: Array<{ name: string; props: ComingUpProps }> = [
  { name: 'one row', props: { rows: [EW] } },
  { name: 'Dec 31: three rows, rarest first', props: { rows: [{ title: 'Fairness', when: 'Thu, Dec 31 · Last hour of the year' }, { title: 'Character', when: 'Thu, Dec 31 · Last hour of the quarter' }, { title: 'Relationships', when: 'Thu, Dec 31 · Last hour of the month' }] } },
  { name: 'more than three (Show More)', props: { rows: [EW, { title: 'Giving', when: 'Tomorrow · Last hour of the week' }, { title: 'Bible Song', when: 'Tomorrow · Luke 1:46–55' }, { title: 'Relationships', when: 'Sat, Oct 31 · Last hour of the month' }] } },
  { name: 'extra proverbs (3 chapters)', props: { rows: [{ title: 'Extra Proverbs', when: 'This month · 3 chapters', notThisMonth: true }] } },
  { name: 'extra proverbs (1 chapter)', props: { rows: [{ title: 'Extra Proverbs', when: 'This month · 1 chapter', notThisMonth: true }] } },
  { name: 'Why It Matters › pressed', props: { rows: [EW], show: { i: 0, state: 'pressed' } } },
  { name: 'Why It Matters › focus', props: { rows: [EW], show: { i: 0, state: 'focus' } } },
];
STATES.push({ name: 'Show More opened (Show Less)', props: { ...STATES[2].props, expanded: true } });
