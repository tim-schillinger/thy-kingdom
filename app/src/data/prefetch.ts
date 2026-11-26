// Load before she asks (motion-lock §5.1, A2): when Today shows, every Bible book the day's two walks need is already loading,
// so a step opens with its text there. After the evening starts, tomorrow morning's books load too.
import type { CivilDate } from '../engine/dates';
import { addDays } from '../engine/dates';
import { planFor, type DayPlan } from '../engine/plan';
import { CHECKIN, PRAYER } from '../copy';
import { getContent, prefetchBooks } from './content';
import type { HerData } from '../engine/types';

/** The standing verses the steps read from the Bible (Ask to Hear, Turn to God, Friday, nation night, Day Complete), as book ids. */
const FIXED = ['PSA', 'MAT', 'REV'];

export function booksFor(plan: DayPlan): string[] {
  const d = plan.day, out = new Set<string>(FIXED);
  if (d) {
    for (const r of [...d.psalm, ...d.proverb, ...d.reading]) out.add(r.b);
    if (d.weekVerse) out.add(d.weekVerse.b);
  }
  const mv = plan.meditation?.verse; if (mv) out.add(mv.b);
  out.add('PRO');
  const id = (k: string) => k.trim().split(/\s+/)[0];   // the copy's keys are "LUK 10:27": the book id first
  for (const c of plan.checkIns) out.add(id(CHECKIN[c].anchor));
  for (const a of PRAYER.anchors) out.add(id(a));
  return [...out];
}

export function prefetchDay(date: CivilDate, her: HerData, eveningNow: boolean) {
  const c = getContent(), trans = her.sources.bible;
  prefetchBooks(trans, booksFor(planFor(c, her, date)));
  if (eveningNow) prefetchBooks(trans, booksFor(planFor(c, her, addDays(date, 1))));
}
