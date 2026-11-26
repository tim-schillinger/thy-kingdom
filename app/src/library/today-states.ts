// Today's states for the library page: the props the screen file passes in each fixture (data/stories.ts FIXTURES),
// written out so the library needs no engine or calendar data. Copy and dates match the approved phones.
import type { TodayViewProps } from '../ui/patterns/Today';
type P = Omit<TodayViewProps, 'children'>;
const L = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const week = (month: string, first: number, today: number, marks: Array<'done' | 'part' | 'open' | 'none'>, roll?: number) =>
  ({ days: marks.map((mark, i) => { const n = first + i, d = roll && n > roll ? n - roll : n; return { date: String(d), long: `${L[i]}, ${month} ${d}`, mark, today: i === today, future: i > today }; }) });
const none = Array(7).fill('none');
const M = { walk: 'Morning Walk' as const, time: 'First hour of your day' }, E = { walk: 'Evening Walk' as const, time: 'Last hour of your day' };
export const TODAY: Array<{ name: string; note: string; props: P }> = [
  { name: 'Morning, first open', note: 'Ray, Tue Oct 13, 7:05 am. Against the Guide Studio’s Today.', props: { wash: 'dawn', dateLine: 'Tuesday, October 13', title: 'Today', streak: 1,
    week: week('October', 11, 2, none), startHere: { onGo: () => {}, onClose: () => {} },
    hero: { ...M, purpose: 'Start your day listening to God.', count: '0 of 7 done', button: 'Start Your Walk', next: 'Next: Sing' }, walks: [],
    comingUp: [{ title: 'Evening Walk', when: 'Tonight starting at 6 pm · Last hour of your day', onChange: () => {} }] } },
  { name: 'Between walks', note: 'Ray, Wed Oct 14, 6:48 am. No approved phone: built by 487 (388).', props: { wash: 'dawn', dateLine: 'Wednesday, October 14', title: 'Today', streak: 1,
    week: week('October', 11, 3, ['none', 'none', 'none', 'part', 'none', 'none', 'none']),
    verse: { label: 'This Week’s Verse', verse: 'For the Son of Man also came not to be served, but to serve, and to give his life as a ransom for many.', reference: 'Mark 10:45', translation: 'World English Bible' },
    walks: [{ key: 'm', walk: 'Morning Walk', mark: 'done', line: '7 of 7 done' }], comingUp: [{ title: 'Evening Walk', when: 'Tonight starting at 6 pm · Last hour of your day', onChange: () => {} }] } },
  { name: 'Evening leads, morning done', note: 'Sat Oct 24, 9:45 pm, a backup due. Against the Settings Studio’s Today.', props: { wash: 'dusk', dateLine: 'Saturday, October 24', title: 'Today', streak: 1,
    week: week('October', 18, 6, ['none', 'none', 'none', 'none', 'none', 'none', 'part']),
    hero: { ...E, purpose: 'End your day with God, praying for others.', count: '0 of 7 done', button: 'Start Your Walk', next: 'Next: Turn to God' },
    walks: [{ key: 'm', walk: 'Morning Walk', mark: 'done', line: '7 of 7 done' }], backup: { onGo: () => {}, onClose: () => {} }, comingUp: [] } },
  { name: 'Finished · Ray', note: 'Wed Oct 14, 9:41 pm, his first day. Against F18.', props: { wash: 'dusk', dateLine: 'Wednesday, October 14', title: 'Today', streak: 1,
    week: week('October', 11, 3, ['none', 'none', 'none', 'done', 'none', 'none', 'none']),
    walks: [{ key: 'm', walk: 'Morning Walk', mark: 'done', line: '7 of 7 done' }, { key: 'e', walk: 'Evening Walk', mark: 'done', line: '7 of 7 done' }], readAhead: () => {}, comingUp: [] } },
  { name: 'Finished · Joan', note: 'Thu Dec 31, 9:53 pm. Against F18 (which shows 34 days; the stories say 35).', props: { wash: 'dusk', dateLine: 'Thursday, December 31', title: 'Today', streak: 35,
    week: { days: [27, 28, 29, 30, 31, 1, 2].map((d, i) => ({ date: String(d), long: `${L[i]}, ${i < 5 ? 'December' : 'January'} ${d}`, mark: (i < 5 ? 'done' : 'none') as 'done' | 'none', today: i === 4, future: i > 4 })) },
    walks: [{ key: 'm', walk: 'Morning Walk', mark: 'done', line: '7 of 7 done' }, { key: 'e', walk: 'Evening Walk', mark: 'done', line: '7 of 7 done' }],
    backup: { onGo: () => {}, onClose: () => {} }, readAhead: () => {}, comingUp: [{ title: 'Bible Song', when: 'Tomorrow · Exodus 15:1–21' }] } },
];
