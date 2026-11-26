// planFor(date, her): what a date holds (1361). Pure: the same inputs always give the same plan.
import {
  type CivilDate, dom, month, year, weekday, monthDay, daysInMonth, isLastOfMonth, isQuarterEnd, isYearEnd, isLeapDay,
} from './dates';
import type { CalendarDay, CheckIn, Content, HerData, Night, Person, Ref } from './types';
import { CHECKIN_ORDER } from './types';
import { answeredIds } from './people';

export interface MeditationPlan {
  focus: string;                 // as the calendar writes it ("Jesus", "Y-Tsidkenu", "Wk/J", "Omega"); never shown
  kind: 'words' | 'works' | 'name' | 'attribute';
  title: string;                 // "the words of Jesus" (after "This week: "), "Yahweh Tsidkenu · Lord Our Righteousness", "Pure"
  question: number | 'all';      // 1–6 one a day; names and attributes offer all six (441)
  verse: Ref | null;             // the night's own verse (a Name or Attribute night's, or the run's); never the Memorize verse
  backup?: Ref;
  night?: Night;                 // the Name or Attribute night's words (frame-lock-5-names-2); the plate reads them
}
export interface DayPlan {
  date: CivilDate;
  bonus: boolean;                // Feb 29: no calendar row; content designed in v1 (1363)
  day: CalendarDay | null;
  weekday: number;
  proverbChapter: number | null; // running place in short months (edit log, Oct 5)
  proverbExtrasLeft: number;     // extras still available this month
  checkIns: CheckIn[];           // tonight's, rarest first (108)
  list: number;                  // prayer list: the weekday picks it
  prayerCount: number;           // up to the day of the month (KEY DOC Act 5 How)
  meditation: MeditationPlan | null;
}

export function checkInsFor(date: CivilDate): CheckIn[] {
  const on = new Set<CheckIn>(['burnt']);
  if (weekday(date) === 6) on.add('grain');
  if (isLastOfMonth(date)) on.add('peace');
  if (isQuarterEnd(date)) on.add('sin');
  if (isYearEnd(date)) on.add('trespass');
  return CHECKIN_ORDER.filter((c) => on.has(c));
}

const dayIndex = (md: string) => Math.round((Date.UTC(2027, +md.slice(0, 2) - 1, +md.slice(3)) - Date.UTC(2027, 0, 1)) / 86400000);

/** Tonight's Meditate: a Name or Attribute night by its date (753), else the week's run (one passage, one question a night). */
export function meditationFor(content: Content, date: CivilDate): MeditationPlan | null {
  const d = content.cal.days[monthDay(date)];
  if (!d?.meditation) return null;
  if (d.night) {
    const n = d.night;
    return { focus: d.meditation, kind: n.kind, title: n.plain ? `${n.word} · ${n.plain}` : n.word, question: 'all', verse: n.verse, backup: n.backup, night: n };
  }
  const r = d.run;
  if (!r) return null;
  return { focus: d.meditation, kind: r.kind === 'works' ? 'works' : 'words', title: r.title, question: dayIndex(monthDay(date)) - dayIndex(r.from) + 1, verse: r.verse, backup: r.backup };
}

/** The Proverb chapter in short months: the day of the month plus extras read earlier this month (edit log, Oct 5). */
export function proverbFor(her: HerData, date: CivilDate): { chapter: number; extrasLeft: number } {
  const dim = daysInMonth(year(date), month(date));
  const monthStart = `${date.slice(0, 8)}01`;
  const extrasBefore = her.dayMarks.filter((m) => m.step === 'am.proverb.extra' && m.date >= monthStart && m.date < date).length;
  const extrasToday = her.dayMarks.filter((m) => m.step === 'am.proverb.extra' && m.date === date).length;
  const chapter = Math.min(31, dom(date) + extrasBefore);
  const extrasLeft = dim >= 31 ? 0 : Math.max(0, 31 - dim - extrasBefore - extrasToday);
  return { chapter, extrasLeft };
}

/** Which of the Classic's readings is tonight's: the night's place in the year, round and round, until the next book arrives (Books 2, 1403). Null on the leap day. */
export function classicNight(content: Content, date: CivilDate): number | null {
  if (isLeapDay(date)) return null;
  const i = Object.keys(content.cal.days).indexOf(monthDay(date));
  return i < 0 ? null : i % content.classic.readings.length;
}

/** T25 (3489 y): the Classic keyed by her own place. A night already marked done shows what she read (the mark's value). Any other night shows her next reading: one past the reading on the mark she made most recently, round the books, or the first reading if none. Marks made before this build carry no value and read as the date rule showed them. */
export function classicPlace(content: Content, her: HerData, date: CivilDate): number {
  const n = content.classic.readings.length;
  const read = (m: { date: CivilDate; value?: string | number }) => typeof m.value === 'number' ? m.value : (classicNight(content, m.date) ?? 0);
  const done = her.dayMarks.filter((m) => m.step === 'pm.classic' && m.state === 'done');
  const mine = done.find((m) => m.date === date);
  if (mine) return read(mine) % n;
  if (!done.length) return 0;
  const last = done.reduce((a, b) => (b.at > a.at ? b : a));
  return (read(last) + 1) % n;
}

/** Which season of the Bible's year a date falls in (3488 A; the four lines in copy.ts WHERE_YOU_ARE). Checked against calendars.json: Old Testament Jan 2 to Sep 30, the four books about Jesus Oct 1 to Nov 15, Acts and the letters Nov 16 to Dec 27, Revelation Dec 28 to 31. */
export function readingSeason(date: CivilDate): 'ot' | 'jesus' | 'church' | 'rev' | null {
  const md = monthDay(date);
  if (md === '01-01') return null;
  if (md < '10-01') return 'ot';
  if (md < '11-16') return 'jesus';
  if (md < '12-28') return 'church';
  return 'rev';
}

/** The "where you are" line on the Bible Reading (3488 A, 3492 y): shown until she has marked the Bible Reading done on 3 days (any days). Never on Jan 1, never on a day that has not come. Null when it does not show. */
export function whereYouAre(her: HerData, date: CivilDate, ahead: boolean): 'ot' | 'jesus' | 'church' | 'rev' | null {
  if (ahead) return null;
  const days = new Set(her.dayMarks.filter((m) => m.step === 'am.reading' && m.state === 'done').map((m) => m.date));
  return days.size >= 3 ? null : readingSeason(date);
}

export function planFor(content: Content, her: HerData, date: CivilDate): DayPlan {
  const bonus = isLeapDay(date);
  const day = bonus ? null : content.cal.days[monthDay(date)] ?? null;
  const prov = bonus ? null : proverbFor(her, date);
  return {
    date, bonus, day, weekday: weekday(date),
    proverbChapter: prov?.chapter ?? null, proverbExtrasLeft: prov?.extrasLeft ?? 0,
    checkIns: checkInsFor(date), list: weekday(date), prayerCount: dom(date),
    meditation: bonus ? null : meditationFor(content, date),
  };
}

// ---------- Prayer part 3: who comes up tonight ----------
/** A day mark `pm.prayer.joined.<personId>` puts a person on tonight's list as an added-tonight row (272). */
export const JOINED = 'pm.prayer.joined.';
function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

/** Who is on a list before tonight: the people the rotation chooses from (not removed, not answered, added before tonight). */
export function poolFor(her: HerData, date: CivilDate, list: number): Person[] {
  const answered = answeredIds(her);
  return her.people.filter((p) => p.list === list && !p.removed && !answered.has(p.id) && p.added < date);
}
/** Up to N people from tonight's list (N = the day of the month), chosen by rotation: shuffled, the most recently
 *  prayed-for to the back, fixed for the night (260, 353). People added tonight join at the end (271). */
export function peopleTonight(her: HerData, date: CivilDate, list: number, count: number): { person: Person; addedTonight: boolean }[] {
  const answered = answeredIds(her);
  const pool = poolFor(her, date, list);
  const last = new Map<string, string>();
  for (const m of her.prayerMarks) if (m.date < date && m.asks.length && (last.get(m.personId) ?? '') < m.date) last.set(m.personId, m.date);
  pool.sort((a, b) => (last.get(a.id) ?? '').localeCompare(last.get(b.id) ?? '') || hash(date + a.id) - hash(date + b.id));
  const chosen = pool.slice(0, Math.min(count, pool.length)).map((person) => ({ person, addedTonight: false }));
  // People added tonight on this list, then anyone who joined tonight's prayer from another list ("Pray for Marcus Tonight", or added here to another list): the last rows (271, 272).
  const joined = new Map(her.dayMarks.filter((m) => m.date === date && m.step.startsWith(JOINED)).map((m) => [m.step.slice(JOINED.length), m.at]));
  const live = (p: Person) => !p.removed && !answered.has(p.id) && !chosen.some((c) => c.person.id === p.id);
  const here = her.people.filter((p) => p.list === list && p.added === date && !joined.has(p.id) && live(p));
  const away = her.people.filter((p) => joined.has(p.id) && live(p)).sort((a, b) => joined.get(a.id)! - joined.get(b.id)!);
  const tonight = [...here, ...away].map((person) => ({ person, addedTonight: true }));
  return [...chosen, ...tonight];
}

export const refBooks = (refs: Ref[]) => [...new Set(refs.map((r) => r.b))];
