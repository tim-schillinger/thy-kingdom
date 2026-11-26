// The hymn of the day (Build 7g; claude/content/hymns-year.md, approved Nov 14, 2026). One a day from the same 366-day table every year, Feb 29 included.
import { monthDay, weekday, dom, type CivilDate } from './dates';
import { DOXOLOGY } from '../copy';
import type { Content, Hymn, Hymns, HymnTrack } from './types';

/** The first Sunday of a month: a Sunday on the 1st to the 7th (1426). */
export const isFirstSunday = (date: CivilDate) => weekday(date) === 0 && dom(date) <= 7;

/** The year of hymns with a recording (3-6d, frame-lock-13 §4 A, 439 y): the recorded hymns in the hymnal's order, one a day from Jan 1 and around again, on the same 366-day table every year (Feb 29 included).
 *  Joy to the World (hymn 31) is left out of the turning order, so there is no Christmas hymn in July (3045), and sings on Dec 12 and Dec 25; those two days do not move the turn. Built once from hymns.json, never stored. */
const JOY = '31', JOY_DAYS = ['12-12', '12-25'], DIM = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const recordedMemo = new WeakMap<Hymns, Record<string, string>>();
export function recordedYear(content: Content): Record<string, string> {
  const hit = recordedMemo.get(content.hymns); if (hit) return hit;
  const turn = content.hymns.hymns.filter((h) => h.recorded && String(h.n) !== JOY).map((h) => String(h.n));
  const table: Record<string, string> = {}; let i = 0;
  DIM.forEach((n, m) => { for (let d = 1; d <= n; d++) { const md = `${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; if (JOY_DAYS.includes(md)) table[md] = JOY; else table[md] = turn[i++ % turn.length]; } });
  recordedMemo.set(content.hymns, table); return table;
}

/** The day's hymn; the calendar's table holds every date and every date names a hymn (tests/hymns.test.ts), so a miss is a broken file and says which day. `recorded`: she chose Hymns With a Recording (frame-lock-13), so the day's hymn comes from the recorded year and every day has a player. The one function every screen reads, so none shows the calendar's hymn while Sing shows another. */
export function hymnFor(content: Content, date: CivilDate, recorded = false): Hymn {
  if (isFirstSunday(date)) return DOXOLOGY as unknown as Hymn;   // 3163 a: an ordinary Sing morning with the Doxology as its song
  const md = monthDay(date), n = recorded ? recordedYear(content)[md] : content.hymns.days[md];
  const h = content.hymns.hymns.find((x) => String(x.n) === n);
  if (!h) throw new Error(`hymns.json has no hymn for ${md}`);
  return h;
}

/** "The Writer": the hymn's short story (Build 7j; claude/content/hymn-stories.md, approved Nov 14, 2026). Every hymn in the year has one (tests/hymn-stories.test.ts), so a miss is a broken file and says which hymn. */
export function storyFor(content: Content, h: Pick<Hymn, 'n'>): string {
  if (h.n === DOXOLOGY.n) return DOXOLOGY.story;
  const s = content.hymnStories[String(h.n)];
  if (!s) throw new Error(`hymn-stories.json has no story for hymn ${h.n}`);
  return s;
}

/** The line under the words, in plain words (115): "Name, year". "tr." reads "translated by" and "c." or "~" read "about"; a hymn with no year shows the name alone (3046, 3104).
 *  Where the translator is unnamed ("Jean-Baptiste Faure, tr.") the table's words stay. */
export function writerLine(h: Pick<Hymn, 'writer' | 'year'>): string {
  const who = h.writer.replace(/^tr\. /, 'translated by ').replace(/, tr\. /, ', translated by ');
  const when = typeof h.year === 'string' ? h.year.replace(/^(c\.|~)\s*/, 'about ') : h.year;
  return when == null || when === '' ? who : `${who}, ${when}`;
}

/** The day's recording, or null (3-5p, frame-lock-9): 28 hymns carry a LibriVox mark ("LibriVox Vol. 2, track 7") and the Doxology on first Sundays is Vol. 1, track 20 (3374 y).
 *  Every recording plays; none is checked against the words (381 replaced 3373). A hymn with no mark, or a mark with no track, has no player (828). */
export function trackFor(content: Content, h: Pick<Hymn, 'n' | 'recorded'>): HymnTrack | null {
  const key = h.n === DOXOLOGY.n ? '1-20' : (() => { const m = /^LibriVox Vol\. (\d), track (\d+)$/.exec(h.recorded ?? ''); return m ? `${m[1]}-${m[2].padStart(2, '0')}` : null; })();
  return key ? content.hymnAudio?.tracks[key] ?? null : null;
}
/** Seconds as "2:45" (minutes, then two digits of seconds); the length is cut down, not rounded, as LibriVox shows it (5:03 stays 5:03). */
export const fmtTime = (sec: number) => { const s = Math.max(0, Math.floor(sec)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
