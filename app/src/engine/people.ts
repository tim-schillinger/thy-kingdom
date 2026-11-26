// People on the lists: who is already on one (Add Person's notice, 272), tonight's list as a set, and the dates Pick a Day offers (406, 1033, 1040).
import { LISTS, type Answered, type HerData, type Person } from './types';
import { addDays, daysInMonth, month, year, type CivilDate } from './dates';

/** The person a typed name already is, by an exact match ignoring case and the spaces at the ends (TKC-020 E). First in the week's order when on two lists.
 *  None when the name is already in tonight's prayer: nothing to offer, the name is there. Requests (Saturday) have no names to match. */
export function onAList(her: HerData, typed: string, tonight: ReadonlySet<string>): Person | null {
  const n = typed.trim().toLowerCase(); if (!n) return null;
  const gone = answeredIds(her);
  const hits = her.people.filter((p) => !p.removed && !gone.has(p.id) && p.list < 6 && p.name.trim().toLowerCase() === n);
  if (!hits.length || hits.some((h) => tonight.has(h.id))) return null;
  return [...hits].sort((a, b) => a.list - b.list)[0];
}
/** Everyone with an answered record, a removed record too: Remove on a record hides the answer and the person stays off her list (the store's setAnswerRemoved; Undo brings both back). */
export const answeredIds = (her: HerData): Set<string> => new Set(her.answered.map((a) => a.personId));
export const listLine = (i: number) => `${LISTS[i].night} · ${LISTS[i].line}`;

/** The months Pick a Day shows, from the day she added the person to today, and the days in one of them that can be picked. */
export function monthsBetween(from: CivilDate, to: CivilDate): Array<{ y: number; m: number }> {
  const out: Array<{ y: number; m: number }> = [];
  for (let y = year(from), m = month(from); y < year(to) || (y === year(to) && m <= month(to)); m === 12 ? (y++, (m = 1)) : m++) out.push({ y, m });
  return out;
}
export const firstWeekday = (y: number, m: number) => new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
export const daysOf = (y: number, m: number) => daysInMonth(y, m);
export const dayKey = (y: number, m: number, d: number): CivilDate => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
export const clampDay = (d: CivilDate, from: CivilDate, to: CivilDate) => (d < from ? from : d > to ? to : d);
export { addDays };

/** Who is on a list now: not removed, not answered, the oldest first (the order she added them). */
export function peopleOn(her: HerData, i: number): Person[] {
  const gone = answeredIds(her);
  return her.people.map((p, n) => ({ p, n })).filter(({ p }) => p.list === i && !p.removed && !gone.has(p.id)).sort((a, b) => (a.p.added < b.p.added ? -1 : a.p.added > b.p.added ? 1 : a.n - b.n)).map(({ p }) => p);
}

/** The four orders a list can be shown in (TKC-048 0.2, 1107). Each list remembers its own (402); a list nobody has sorted is oldest first. */
export type SortKey = 'oldest' | 'newest' | 'az' | 'za';
export const SORT_KEYS: readonly SortKey[] = ['oldest', 'newest', 'az', 'za'];
export function orderOf(her: HerData, i: number): SortKey {
  const k = her.reminders.sortByList?.[i] as SortKey | undefined; return k && SORT_KEYS.includes(k) ? k : 'oldest';
}
const byName = (a: Person, b: Person) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
/** `people` arrive oldest first (peopleOn). A–Z and Z–A go by the name (Your Requests: the request, which is its name), and ties keep the oldest first. */
export function sortPeople(people: Person[], key: SortKey): Person[] {
  const base = [...people];
  if (key === 'oldest') return base;
  if (key === 'newest') return base.reverse();
  const idx = new Map(base.map((p, n) => [p.id, n]));
  return base.sort((a, b) => (key === 'az' ? byName(a, b) : byName(b, a)) || (idx.get(a.id)! - idx.get(b.id)!));
}
/** Who is on a list, in the order that list remembers. */
export const listPeople = (her: HerData, i: number): Person[] => sortPeople(peopleOn(her, i), orderOf(her, i));

/** Lists search (TKC-011 0.2, 1109, 1118): any part of a name or request, ignoring case, over every list and Answered. Those she is praying for come first
 *  (the Lists order, Sunday to Saturday, each list in its own remembered order), then answered prayers, newest first. A removed record never shows. */
const fold = (s: string) => s.toLowerCase().replace(/[\u2018\u2019]/g, "'");
export interface SearchHits { people: Person[]; answered: Answered[] }
export function searchLists(her: HerData, typed: string): SearchHits {
  const q = fold(typed.trim()); if (!q) return { people: [], answered: [] };
  const has = (...t: Array<string | undefined>) => t.some((x) => !!x && fold(x).includes(q));
  const people = LISTS.flatMap((_, i) => listPeople(her, i)).filter((p) => has(p.name, p.request));
  const answered = her.answered.filter((a) => !a.removed && has(a.name, a.request)).sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0));
  return { people, answered };
}
