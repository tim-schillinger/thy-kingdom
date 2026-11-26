// The week's verses and the quote-mark rule (frame-lock-2 §6; decisions 588–597, Build chat Nov 9, 2026).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { stripLoneQuotes } from '../src/engine/quotes';
import { chaptersOf } from '../src/engine/refs';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const cal = load('calendars.json');
const days = Object.entries(cal.days) as [string, any][];
const book = (t: 'web' | 'kjv', b: string): string[][] => load(`bible/${t}/${b}.json`).ch;
const text = (t: 'web' | 'kjv', r: any) => chaptersOf(r, (c) => book(t, r.b)[c - 1].length).flatMap(({ c, from, to }) => book(t, r.b)[c - 1].slice(from - 1, to)).join(' ').replace(/\[|\]/g, '');

describe('every day carries a week verse', () => {
  it('365 weekVerse, 53 nights, 312 run days, none empty in either Bible', () => {
    expect(days.filter(([, d]) => d.weekVerse).length).toBe(365);
    expect(days.filter(([, d]) => d.night).length).toBe(53);
    expect(days.filter(([, d]) => d.run).length).toBe(312);
    for (const [k, d] of days) for (const r of [d.weekVerse, d.night?.verse, d.run?.verse].filter(Boolean)) for (const t of ['web', 'kjv'] as const) expect(text(t, r).length, `${k} ${r.b} ${r.c}:${r.v}`).toBeGreaterThan(10);
  });
  it('a week is seven days: a six-day block and the single day after it (591 b); the first week runs Jan 1–8 (593)', () => {
    const sig = (d: any) => JSON.stringify(d.weekVerse);
    const runs: number[] = []; let n = 0, last = '';
    for (const [, d] of days) { if (sig(d) === last) n++; else { if (n) runs.push(n); n = 1; last = sig(d); } } runs.push(n);
    expect(runs[0]).toBe(8);
    expect(runs.slice(1, -1).every((x) => x === 7)).toBe(true);
  });
});

describe('the quote-mark rule', () => {
  const pick = (r: any) => stripLoneQuotes(text('web', r), 'web');
  const bal = (t: string) => ({ lead: t.startsWith('“') && t.split('“').length <= t.split('”').length, trail: t.endsWith('”') && t.split('”').length <= t.split('“').length });
  it('no chosen World English verse opens or closes with a mark that has no partner', () => {
    for (const [k, d] of days) for (const r of [d.weekVerse, d.night?.verse, d.run?.verse].filter(Boolean)) {
      const t = pick(r); const b = t.split('“').length - 1, c = t.split('”').length - 1;
      if (t.startsWith('“')) expect(b, `${k} ${r.b} ${r.c}:${r.v} opens unpartnered`).toBeLessThanOrEqual(c);
      if (t.endsWith('”')) expect(c, `${k} ${r.b} ${r.c}:${r.v} closes unpartnered`).toBeLessThanOrEqual(b);
    }
  });
  it('changes marks only, never a word', () => {
    for (const [, d] of days) { const raw = text('web', d.weekVerse); const out = stripLoneQuotes(raw, 'web'); expect(out.replace(/[“”‘’]/g, '')).toBe(raw.replace(/[“”‘’]/g, '')); expect(raw.length - out.length).toBeLessThanOrEqual(2); }
  });
  it('leaves the King James text alone', () => { expect(stripLoneQuotes('“x', 'kjv')).toBe('“x'); });
  it('drops the one stray mark on Leviticus 19:18 and Luke 6:27–28 (the examples in frame-lock-2)', () => {
    const lev = text('web', { b: 'LEV', c: 19, v: 18 }), luk = text('web', { b: 'LUK', c: 6, v: 27, v2: 28 });
    expect(stripLoneQuotes(lev, 'web').length).toBeLessThanOrEqual(lev.length);
    expect(stripLoneQuotes(luk, 'web').startsWith('“')).toBe(false);
  });
});

describe('Aug 26 (581): the second reference no longer ends before it begins', () => {
  it('Lamentations 3:37 to 5:22, and all 1,189 chapters come within the year', () => {
    expect(cal.days['08-26'].reading).toEqual([{ b: 'LAM', c: 3, v: 37, c2: 5, v2: 22 }]);
    const seen = new Set<string>();
    for (const [, d] of days) for (const r of [...d.reading, ...d.psalm, ...d.proverb] as any[]) for (let c = r.c; c <= (r.c2 ?? r.c); c++) seen.add(`${r.b} ${c}`);
    expect(seen.size).toBe(1189);
  });
});

describe('a verse run shows both numbers (Luke 6:27–28)', () => {
  it('formats {b, c, v, v2} with its run', async () => {
    const { formatRef } = await import('../src/engine/refs');
    const books = load('books.json').order;
    const content: any = { books };
    expect(formatRef(content, { b: 'LUK', c: 6, v: 27, v2: 28 })).toBe('Luke 6:27–28');
    expect(formatRef(content, { b: 'PSA', c: 8, v: 3, v2: 4 })).toBe('Psalm 8:3–4');
    expect(formatRef(content, { b: 'JHN', c: 3, v: 16, v2: 17 })).toBe('John 3:16–17');
  });
});
