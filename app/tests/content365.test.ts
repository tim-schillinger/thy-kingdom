// The 365-day content test (Unit 0, decision 1656): every day of the year holds what the app will ask for, read through planFor,
// the same door the screens use. Engine level, no browser. A failure names the day (MM-DD), the part and the reference.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { planFor } from '../src/engine/plan';
import { chaptersOf, formatRef } from '../src/engine/refs';
import { emptyHerData, type Content, type Ref } from '../src/engine/types';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const content: Content = {
  cal: load('calendars.json'), classic: load('classic.json'), articles: load('articles.json'), books: load('books.json').order,
  nations: Object.fromEntries(load('nations.json').list.map((n: any) => [n.id, n])), facts: load('nation-facts.json').list, factsSource: load('nation-facts.json').sourceLine, medkey: load('meditation-key.json'), sheets: load('sheets.json'), hymns: load('hymns.json'), hymnStories: load('hymn-stories.json').stories, hymnAudio: load('hymn-audio.json'),
};
const TRANSLATIONS = ['web', 'kjv'] as const;
const bibles = new Map<string, string[][]>();
const book = (t: string, b: string): string[][] => {
  const key = `${t}/${b}`;
  if (!bibles.has(key)) bibles.set(key, load(`bible/${t}/${b}.json`).ch);
  return bibles.get(key)!;
};

/** Why a reference does not resolve to text in this Bible, or null when every verse it names has words. */
function problem(t: string, r: Ref): string | null {
  let chs: string[][];
  try { chs = book(t, r.b); } catch { return `no ${t} file for ${r.b}`; }
  if (!r.c || r.c > chs.length) return `${t} ${r.b} has no chapter ${r.c}`;
  if (r.c2 && r.c2 > chs.length) return `${t} ${r.b} has no chapter ${r.c2}`;
  const words: string[] = [];
  for (const { c, from, to } of chaptersOf(r, (n) => chs[n - 1].length)) {
    const verses = chs[c - 1].slice(from - 1, to);
    if (verses.length === 0 || verses.length < to - from + 1) return `${t} ${r.b} ${c} has no verses ${from}–${to}`;
    // The WEB leaves out the verses the oldest manuscripts lack (Acts 8:37, Luke 17:36): an empty verse inside a longer passage is the Bible's own text.
    // A passage must still have words, and a reference to one verse must have that verse.
    if (from === to && !verses[0]?.trim()) return `${t} ${r.b} ${c}:${from} is empty`;
    words.push(...verses);
  }
  return words.join(' ').replace(/\[|\]/g, '').trim() ? null : `${t} ${r.b} came back empty`;
}

// Any non-leap year gives every MM-DD the calendar holds; Feb 29 is checked in a leap year.
const YEAR = 2027;
const keys = Object.keys(content.cal.days).sort();
const dayOf = (k: string) => `${YEAR}-${k}`;

describe('the calendar holds a day for every date', () => {
  it('has exactly 365 days, Jan 1 to Dec 31, none missing', () => {
    const want: string[] = [];
    for (let d = new Date(Date.UTC(YEAR, 0, 1)); d.getUTCFullYear() === YEAR; d.setUTCDate(d.getUTCDate() + 1)) want.push(d.toISOString().slice(5, 10));
    expect(keys).toEqual(want);
  });
  it('Feb 29 has no calendar row and planFor says bonus', () => {
    const p = planFor(content, emptyHerData(), '2028-02-29');
    expect(p.bonus).toBe(true);
    expect(p.day).toBeNull();
    expect(content.cal.days['02-29']).toBeUndefined();
  });
});

describe('every day, read through planFor, resolves in both bundled Bibles', () => {
  const her = emptyHerData();
  it('psalm or song, Proverb, reading and study notes range all have text (WEB and KJV)', () => {
    const failures: string[] = [];
    for (const k of keys) {
      const plan = planFor(content, her, dayOf(k));
      if (plan.bonus || !plan.day) { failures.push(`${k}: planFor gave no day`); continue; }
      const parts: [string, Ref[]][] = [[plan.day.song ? 'song' : 'psalm', plan.day.psalm], ['proverb', plan.day.proverb], ['reading', plan.day.reading]];
      const st = plan.day.study;
      if (!('article' in st)) {
        if (!st.from) failures.push(`${k}: study has no starting chapter`);
        else {
          const [fb, fc] = st.from, [tb, tc] = st.to ?? st.from;
          parts.push(['study', fb === tb && tc !== fc ? [{ b: fb, c: fc, c2: tc }] : [{ b: fb, c: fc }, ...(fb !== tb ? [{ b: tb, c: tc }] : [])]]);
        }
      }
      for (const [part, refs] of parts) {
        if (!refs.length) failures.push(`${k}: ${part} is empty`);
        for (const r of refs) for (const t of TRANSLATIONS) { const why = problem(t, r); if (why) failures.push(`${k}: ${part} ${formatRef(content, r)}: ${why}`); }
      }
    }
    expect(failures).toEqual([]);
  });

  it("this week's verse resolves on all 365 days, and every night's own verse on the 53 Name and Attribute nights and the 312 ordinary nights", () => {
    const failures: string[] = []; let names = 0;
    for (const k of keys) {
      const plan = planFor(content, her, dayOf(k));
      const w = plan.day?.weekVerse;
      if (!w) failures.push(`${k}: no week's verse`);
      else for (const t of TRANSLATIONS) { const why = problem(t, w); if (why) failures.push(`${k}: week's verse ${formatRef(content, w)}: ${why}`); }
      const n = plan.meditation?.verse;
      if (!n) failures.push(`${k}: Meditate has no verse of its own`);
      else {
        if (plan.day?.night) names++;
        if (JSON.stringify(n) === JSON.stringify(w)) failures.push(`${k}: Meditate shows the Memorize verse`);
        for (const t of TRANSLATIONS) { const why = problem(t, n); if (why) failures.push(`${k}: Meditate verse ${formatRef(content, n)}: ${why}`); }
      }
    }
    expect(failures).toEqual([]);
    expect(names).toBe(53);
  });

  it('Meditate has a focus every day, and every nation id exists', () => {
    const failures: string[] = [];
    for (const k of keys) {
      const plan = planFor(content, her, dayOf(k));
      if (!plan.meditation?.focus) failures.push(`${k}: Meditate has no focus`);
      for (const id of plan.day?.nations ?? []) if (!content.nations[id]) failures.push(`${k}: nation ${id} is not in nations.json`);
    }
    expect(failures).toEqual([]);
  });
});
