// Walks, days, streaks and Open Days, worked out from her day marks; never stored (1169, 1362).
import { type CivilDate, addDays, isLeapDay } from './dates';
import type { Content, DayMark, HerData, StepId, Walk } from './types';
import { EVENING, MORNING } from './types';

export type StepState = 'done' | 'skipped' | 'open';
export type WalkState = 'done' | 'part' | 'open';

export function markIndex(marks: DayMark[]) {
  const m = new Map<string, DayMark>();
  for (const x of marks) m.set(`${x.date}|${x.step}`, x);
  return m;
}
type Idx = ReturnType<typeof markIndex>;

export const stepState = (idx: Idx, date: CivilDate, step: StepId): StepState =>
  (idx.get(`${date}|${step}`)?.state as StepState) ?? 'open';
export const stepsOf = (walk: Walk) => (walk === 'morning' ? MORNING : EVENING);
export const walkCounts = (idx: Idx, date: CivilDate, walk: Walk) => {
  const s = stepsOf(walk).map((st) => stepState(idx, date, st));
  return { touched: s.filter((x) => x !== 'open').length, states: s };
};
/** A walk is finished when every step is done or skipped (IA decision 3, 12). */
export function walkState(idx: Idx, date: CivilDate, walk: Walk): WalkState {
  const { touched } = walkCounts(idx, date, walk);
  return touched === 7 ? 'done' : touched > 0 ? 'part' : 'open';
}
export const dayFinished = (idx: Idx, date: CivilDate) => walkState(idx, date, 'morning') === 'done' && walkState(idx, date, 'evening') === 'done';
export const nextOpenStep = (idx: Idx, date: CivilDate, walk: Walk): StepId | null => stepsOf(walk).find((s) => stepState(idx, date, s) === 'open') ?? null;

/** Where a step's main button goes (frame-lock-8 L1, L2; 3178 y, 3179 a). The next step after this one that is still open, skipping any already done or skipped.
 *  Past the last open step: steps still open behind her → 'still' (the Still Open page); none → 'complete' (Walk Complete, or Day Complete).
 *  `review` is true when she is looking again at a step she has already handled: with nothing open anywhere, Next walks the order (i + 1) so she can read back through a finished walk. */
export type NextStop = { step: number } | { end: 'still' | 'complete' };
export function nextStop(steps: StepId[], idx: Idx, date: CivilDate, i: number, review: boolean): NextStop {
  const open = steps.map((s, k) => (k !== i && stepState(idx, date, s) === 'open' ? k : -1)).filter((k) => k >= 0);
  const after = open.find((k) => k > i);
  if (after !== undefined) return { step: after };
  if (open.length) return { end: 'still' };
  return review && i < steps.length - 1 ? { step: i + 1 } : { end: 'complete' };
}

/** Each day back from `from` that counts: finished, or Feb 29 left open (1363: never breaks a streak). */
function runBack(idx: Idx, from: CivilDate, first: CivilDate): { n: number; start?: CivilDate } {
  let n = 0, start: CivilDate | undefined;
  for (let d = from; d >= first; d = addDays(d, -1)) {
    if (dayFinished(idx, d)) { n++; start = d; }
    else if (isLeapDay(d)) continue; // bridges, adds nothing
    else break;
  }
  return { n, start };
}

/** `start` is the first day of the current streak (3-5u: a streak that reaches back past where it began when she last looked has joined an older one, 1144). */
export interface Streaks { current: number; longest: number; start?: CivilDate }
/** Current streak: back from today if today is finished, else from yesterday (an unfinished today breaks nothing yet). */
export function streaks(her: HerData, today: CivilDate, idx = markIndex(her.dayMarks)): Streaks {
  const first = her.reminders.firstDay;
  if (!first) return { current: 0, longest: 0 };
  const cur = dayFinished(idx, today) ? runBack(idx, today, first) : runBack(idx, addDays(today, -1), first);
  const current = cur.n;
  let longest = 0, run = 0;
  for (let d = first; d <= today; d = addDays(d, 1)) {
    if (dayFinished(idx, d)) { run++; longest = Math.max(longest, run); }
    else if (isLeapDay(d)) continue;
    else if (d < today) run = 0;
  }
  return { current, longest: Math.max(longest, current), start: cur.start };
}

/** The plant's stage, earned for good and never shrinking (1146, 1156): from the longest streak. */
export const plantStage = (longest: number) => (longest >= 365 ? 4 : longest >= 100 ? 3 : longest >= 30 ? 2 : longest >= 7 ? 1 : 0);
export const MILESTONES = [7, 30, 100, 365];

/** What Progress shows (3-5t). `tiles` are in the page's fixed order (1149). */
export interface ProgressNow { current: number; stage: number; tiles: number[]; /** the streak's first day, and the day she looked (3-5u; absent in what older builds stored) */ start?: CivilDate; on?: CivilDate }
/** What moves on Progress, from what she saw last time (1165: the page moves only on gains; after a break, nothing moves).
 *  `fromCurrent` and `fromStage` are where the number and the milestones start; `tileFrom[i]` is null for a count that did not grow. */
/** `join` (3-5u, TKC-026 H): finishing or skipping open days (1144) joined two streaks, or carried the last one on to today: the streak now reaches back past the day it began when she last looked (past the day she looked, when she had no streak then). A day added at the end never does. */
export interface ProgressGain { any: boolean; streak: boolean; stage: boolean; join: boolean; fromCurrent: number; fromStage: number; tileFrom: Array<number | null> }
export function progressGain(seen: ProgressNow | undefined, now: ProgressNow): ProgressGain {
  const was: ProgressNow = seen ?? { current: 0, stage: 0, tiles: now.tiles.map(() => 0) };
  const streak = now.current > was.current, stage = now.stage > was.stage;
  const tileFrom = now.tiles.map((n, i) => (n > (was.tiles[i] ?? 0) ? (was.tiles[i] ?? 0) : null));
  const join = streak && !!now.start && (was.current > 0 ? !!was.start && now.start < was.start : !!was.on && now.start < was.on);
  return { any: streak || stage || tileFrom.some((t) => t !== null), streak, stage, join, fromCurrent: streak ? was.current : now.current, fromStage: stage ? was.stage : now.stage, tileFrom };
}
/** The header's right words on Milestones (TKC-056 D): days to the next one never earned, counted on today's streak; "Next: 100 days" at no streak; "All four reached". */
export function milestoneFar(current: number, longest: number): string {
  const next = MILESTONES.find((m) => m > longest);
  if (next === undefined) return 'All four reached';
  if (current < 1) return `Next: ${next} days`;
  const d = next - current;
  return d === 1 ? '1 day to ' + next : `${d} days to ${next}`;
}

export interface OpenDay { date: CivilDate; left: string }
/** Every day since her first day, before today, with a walk still open and not cleared; newest first (1143, 1151). */
export function openDays(her: HerData, today: CivilDate, idx = markIndex(her.dayMarks)): OpenDay[] {
  const first = her.reminders.firstDay;
  if (!first) return [];
  const out: OpenDay[] = [];
  for (let d = addDays(today, -1); d >= first; d = addDays(d, -1)) {
    if (isLeapDay(d) || dayFinished(idx, d) || idx.get(`${d}|day.cleared`)) continue;
    const m = walkState(idx, d, 'morning'), e = walkState(idx, d, 'evening');
    const left = m !== 'done' && e !== 'done'
      ? (m === 'part' ? 'The rest of the Morning Walk, and the Evening Walk' : e === 'part' ? 'The Morning Walk, and the rest of the Evening Walk' : 'Both walks')
      : m !== 'done' ? (m === 'part' ? 'The rest of the Morning Walk' : 'The Morning Walk') : (e === 'part' ? 'The rest of the Evening Walk' : 'The Evening Walk');
    out.push({ date: d, left });
  }
  return out;
}

/** What the streak would be if every listed open day were finished (Open Days' join line, 1161). */
export function streakIfFinished(her: HerData, today: CivilDate, days: CivilDate[]): number {
  const extra: DayMark[] = [];
  for (const d of days) for (const s of [...MORNING, ...EVENING]) extra.push({ key: `${d}|${s}`, date: d, step: s, state: 'skipped', at: 0 });
  const idx = markIndex([...extra, ...her.dayMarks]);
  return streaks(her, today, idx).current;
}

/** Skip marks every untouched step skipped, so the days count (1144); returns the marks added, for Undo. */
export function skipDays(her: HerData, days: CivilDate[], at: number): DayMark[] {
  const idx = markIndex(her.dayMarks);
  const added: DayMark[] = [];
  for (const d of days) for (const s of [...MORNING, ...EVENING])
    if (stepState(idx, d, s) === 'open') added.push({ key: `${d}|${s}`, date: d, step: s, state: 'skipped', at });
  return added;
}
/** Clear keeps the days open on the calendar but takes them off Open Days (1144). */
export const clearDays = (days: CivilDate[], at: number): DayMark[] =>
  days.map((d) => ({ key: `${d}|day.cleared`, date: d, step: 'day.cleared', state: 'set', at }));

// ---------- The four tiles (1149, 1169) ----------
export function tiles(her: HerData, content: Content) {
  const prayed = new Set(her.prayerMarks.filter((m) => m.asks.length).map((m) => `${m.date}|${m.personId}`)).size;
  const idx = markIndex(her.dayMarks);
  let nations = 0, chapters = 0;
  const dates = new Set(her.dayMarks.map((m) => m.date));
  for (const d of dates) {
    const day = content.cal.days[d.slice(5)];
    if (!day) continue;
    if (idx.get(`${d}|pm.prayer.kingdom`)?.state === 'done') nations += day.nations.length;
    for (const [step, refs] of [['am.psalm', day.psalm], ['am.proverb', day.proverb], ['am.reading', day.reading]] as const)
      if (stepState(idx, d, step) === 'done') for (const r of refs) chapters += (r.c2 ?? r.c) - r.c + 1;
  }
  const answered = her.answered.filter((a) => !a.removed).length;
  return { prayed, nations, chapters, answered };
}
