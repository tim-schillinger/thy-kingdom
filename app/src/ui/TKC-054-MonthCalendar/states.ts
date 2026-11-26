import type { MonthCalendarProps, CalDay } from './MonthCalendar';
export const ID = 'TKC-054', NAME = 'MonthCalendar', VERSION = '0.2';
// October 2026 starts on a Thursday (lead 4); today is Wed Oct 14; the range ends next week (Sat Oct 24 here, then faded).
const oct = (f: (n: number) => Partial<CalDay>): CalDay[] => Array.from({ length: 31 }, (_, k) => ({ n: k + 1, ...f(k + 1) }));
const walk = oct((n) => ({ mark: n <= 13 ? (n % 3 === 0 ? 'one' : n % 7 === 0 ? undefined : 'both') : undefined, today: n === 14, out: n > 24 }));
const date = oct((n) => ({ today: n === 14, pick: n === 12, out: n > 14 }));
export const STATES: Array<{ name: string; props: MonthCalendarProps }> = [
  { name: 'walk, October', props: { month: 'October 2026', lead: 4, days: walk, nextOff: false } },
  { name: 'walk, end of range', props: { month: 'October 2026', lead: 4, days: walk, nextOff: true } },
  { name: 'walk, a day pressed', props: { month: 'October 2026', lead: 4, days: walk.map((d) => d.n === 6 ? { ...d, show: 'pressed' as const } : d) } },
  { name: 'walk, a day focused', props: { month: 'October 2026', lead: 4, days: walk.map((d) => d.n === 6 ? { ...d, show: 'focus' as const } : d) } },
  { name: 'date, picked day', props: { kind: 'date', month: 'October 2026', lead: 4, days: date, nextOff: true } },
  { name: 'date, today picked', props: { kind: 'date', month: 'October 2026', lead: 4, days: date.map((d) => ({ ...d, pick: d.n === 14 })), nextOff: true } },
];
