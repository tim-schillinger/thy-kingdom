import type { WeekStripProps, Day } from './WeekStrip';
import type { Mark } from '../TKC-021-StatusMark/StatusMark';
export const ID = 'TKC-023', NAME = 'WeekStrip', VERSION = '0.3';
const L = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const wk = (marks: Mark[], today: number, viewed?: number): Day[] => marks.map((m, i) => ({ date: String(11 + i), long: `${L[i]}, October ${11 + i}`, mark: m, today: i === today, viewed: i === viewed, future: i > today }));
export const STATES: Array<{ name: string; props: WeekStripProps }> = [
  { name: 'Wednesday, done Sun–Tue', props: { days: wk(['done', 'done', 'done', 'none', 'none', 'none', 'none'], 3) } },
  { name: 'part done and still open', props: { days: wk(['done', 'open', 'part', 'part', 'none', 'none', 'none'], 3) } },
  { name: 'first week (no marks before first use)', props: { days: wk(['none', 'none', 'none', 'none', 'none', 'none', 'none'], 2) } },
  { name: 'viewing Tuesday', props: { days: wk(['done', 'done', 'open', 'none', 'none', 'none', 'none'], 3, 2) } },
  { name: 'Saturday, all done', props: { days: wk(['done', 'done', 'done', 'done', 'done', 'done', 'done'], 6) } },
  { name: 'today pressed', props: { days: wk(['done', 'done', 'done', 'none', 'none', 'none', 'none'], 3), show: { i: 3, state: 'pressed' } } },
  { name: 'a day pressed', props: { days: wk(['done', 'done', 'done', 'none', 'none', 'none', 'none'], 3), show: { i: 1, state: 'pressed' } } },
  { name: 'a day focus', props: { days: wk(['done', 'done', 'done', 'none', 'none', 'none', 'none'], 3), show: { i: 5, state: 'focus' } } },
];
