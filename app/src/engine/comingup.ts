// Coming Up (TKC-027 F, coming-up.md, 724): information only, on today's screen.
import { type CivilDate, fmtClock, addDays, daysBetween, fmtShort, isLastOfMonth, isQuarterEnd, isYearEnd, isLeapDay, weekday, month, year, daysInMonth } from './dates';
import type { Content, HerData } from './types';
import { proverbFor } from './plan';
import { formatRefs } from './refs';

export interface ComingUpRow { kind: 'evening' | 'giving' | 'relationships' | 'character' | 'fairness' | 'song' | 'proverbs' | 'leap'; title: string; when: string; date: CivilDate | null; rank: number; change?: boolean }

const RANK = { evening: 0, fairness: 1, character: 2, relationships: 3, giving: 4, song: 5, leap: 6, proverbs: 7 } as const;
const whenWord = (today: CivilDate, d: CivilDate) => (daysBetween(today, d) === 1 ? 'Tomorrow' : fmtShort(d));

/** Rows for Today on `today`. `beforeEvening`: the Evening Walk hasn't started leading yet (469). */
export function comingUp(content: Content, her: HerData, today: CivilDate, beforeEvening: boolean): ComingUpRow[] {
  const rows: ComingUpRow[] = [];
  if (beforeEvening) rows.push({ kind: 'evening', title: 'Evening Walk', when: `Tonight starting at ${fmtClock(her.settings.eveningStart)} · Last hour of your day`, date: today, rank: RANK.evening, change: true });
  // Moments start from tomorrow; tonight's check-in is already on the Check-In step (119).
  for (let i = 1; i <= 14; i++) {
    const d = addDays(today, i);
    const w = whenWord(today, d);
    if (isYearEnd(d) && i <= 14) rows.push({ kind: 'fairness', title: 'Fairness', when: `${w} · Last hour of the year`, date: d, rank: RANK.fairness });
    if (isQuarterEnd(d) && i <= 10) rows.push({ kind: 'character', title: 'Character', when: `${w} · Last hour of the quarter`, date: d, rank: RANK.character });
    if (isLastOfMonth(d) && i <= 5) rows.push({ kind: 'relationships', title: 'Relationships', when: `${w} · Last hour of the month`, date: d, rank: RANK.relationships });
    if (weekday(d) === 6 && i === 1) rows.push({ kind: 'giving', title: 'Giving', when: 'Tomorrow · Last hour of the week', date: d, rank: RANK.giving });
    if (i === 1 && !isLeapDay(d) && content.cal.days[d.slice(5)]?.song)
      rows.push({ kind: 'song', title: 'Bible Song', when: `Tomorrow · ${formatRefs(content, content.cal.days[d.slice(5)].psalm)}`, date: d, rank: RANK.song });
    // Leap day's row is v1 (455); the slot is here so it can't be missed.
  }
  // Extra Proverbs (580; was "Finish Proverbs"): a short month, until every extra is read or "Not This Month" (184, 724).
  const dim = daysInMonth(year(today), month(today));
  const monthKey = today.slice(0, 7);
  if (dim < 31 && her.reminders.notThisMonth !== monthKey) {
    const { extrasLeft } = proverbFor(her, today);
    if (extrasLeft > 0) rows.push({ kind: 'proverbs', title: 'Extra Proverbs', when: `This month · ${extrasLeft} ${extrasLeft === 1 ? 'chapter' : 'chapters'}`, date: null, rank: RANK.proverbs });
  }
  // Soonest first; on one date, the rarest first.
  return rows.sort((a, b) => (a.date ?? '9999').localeCompare(b.date ?? '9999') || a.rank - b.rank);
}
