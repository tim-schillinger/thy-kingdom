// The year of hymns (Build 7g; claude/content/hymns-year.md, approved Nov 14, 2026; brief claude/prompts/hymns-year.md).
// Data level: reads the file the app ships (public/content/hymns.json) and the source it is built from (data/hymns.json). A failure names the hymn or the day.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const shipped = JSON.parse(read('../public/content/hymns.json'));
const source = JSON.parse(read('../../data/hymns.json'));
/** As the file is: `refrain` is [] when a hymn has none; `year` is a number, a short text ("c. 820", "12th century") or null; a day's value is the hymn's number as text. */
type Hymn = { n: number | string; title: string; firstLine: string; writer: string; year: number | string | null; stanzas: string[][]; refrain: string[]; recorded: string | null };
const hymns: Hymn[] = shipped.hymns;
const days: Record<string, string> = shipped.days;
const byN = new Map(hymns.map((h) => [String(h.n), h]));

/** Christmas hymns run Dec 12–31, one a day, in the book's order (3045). 48 sits in the book's Nativity section but runs in the rotation. */
const CHRISTMAS = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51];
/** Out of the year, by the brief's skip test (§2), the evening and night rule (3044), the sections left out (3040) and the Creator's answers (3091, 3092). */
const SKIPPED = [6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 25, 26, 79, 102, 109, 117, 118, 138, 140, 143, 144, 146, 147, 148, 162, 163, 164, 165, 166, 168, 177, 182, 183, 184, 186, 187, 188, 189, 199, 201, 211, 217, 223, 224, 228, 232, 233, 234, 235, 236, 237,
  ...[...Array(16).keys()].map((i) => 120 + i).filter((n) => n !== 122 && n !== 126), ...[...Array(13).keys()].map((i) => 149 + i)];
/** No year shown (3104, 3109; 192 by 3146): the writer line shows the name alone. The other blanks were filled by the hymn-story batches (3131–3150, 3151–3153). */
const NO_YEAR = [37, 39, 57, 179, 192, 204, 216];

describe('the year of hymns: the file', () => {
  it('the shipped file is the source file, built by tools/build_content.py', () => { expect(shipped).toEqual(source); });
  it('161 hymns, each number once; 77b is the short hymn between 77 and 78', () => {
    expect(hymns.length).toBe(161);
    expect(byN.size).toBe(161);
    expect(byN.has('77b')).toBe(true);
    expect(byN.has('77')).toBe(true);
  });
  it('every hymn has a title, a first line and a writer', () => {
    for (const h of hymns) for (const k of ['title', 'firstLine', 'writer'] as const) expect(typeof h[k] === 'string' && h[k].trim().length > 0, `hymn ${h.n} ${k}`).toBe(true);
  });
  it('no empty stanza, no empty line, no "…" or "..." anywhere in the words or the refrain (brief §4.3)', () => {
    for (const h of hymns) {
      expect(h.stanzas.length, `hymn ${h.n} stanzas`).toBeGreaterThan(0);
      for (const [i, st] of h.stanzas.entries()) { expect(st.length, `hymn ${h.n} stanza ${i + 1}`).toBeGreaterThan(0); for (const l of st) expect(l.trim().length, `hymn ${h.n} stanza ${i + 1} line`).toBeGreaterThan(0); }
      expect(Array.isArray(h.refrain), `hymn ${h.n} refrain is a list`).toBe(true);
      for (const l of h.refrain) expect(l.trim().length, `hymn ${h.n} refrain line`).toBeGreaterThan(0);
      const all = [...h.stanzas.flat(), ...h.refrain, h.title, h.firstLine].join('\n');
      expect(all, `hymn ${h.n}`).not.toMatch(/…|\.\.\./);
    }
  });
  it('598 stanzas in all (counted at P8c), 43 hymns with a refrain', () => {
    expect(hymns.reduce((n, h) => n + h.stanzas.length, 0)).toBe(598);
    expect(hymns.filter((h) => h.refrain.length > 0).length).toBe(43);
  });
  it('154 hymns have a year, 7 do not (3104, 3109, 3146); 149 years are numbers and 5 are text (3102, 3141); 28 have a LibriVox mark', () => {
    const blank = hymns.filter((h) => h.year == null).map((h) => Number(h.n));
    expect(blank.sort((a, b) => a - b)).toEqual(NO_YEAR);
    for (const h of hymns) if (typeof h.year === 'number') expect(Number.isInteger(h.year), `hymn ${h.n} year`).toBe(true);
    expect(hymns.filter((h) => typeof h.year === 'number').length).toBe(149);
    expect(hymns.filter((h) => typeof h.year === 'string').map((h) => [h.n, h.year])).toEqual([[55, 'c. 820'], [62, 'c. 750'], [100, '12th century'], [103, '12th century'], [114, 'c. 1704']]);
    expect(hymns.filter((h) => h.recorded).length).toBe(28);
  });
});

describe('the year of hymns: the 366 days', () => {
  const keys = Object.keys(days);
  it('every date Jan 1 to Dec 31 has a hymn, Feb 29 included, and no other key', () => {
    const want: string[] = [];
    for (let m = 1; m <= 12; m++) for (let d = 1; d <= new Date(Date.UTC(2028, m, 0)).getUTCDate(); d++) want.push(`${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    expect(want.length).toBe(366);
    expect([...keys].sort()).toEqual(want);
  });
  it('every day names a hymn the file holds', () => { for (const k of keys) expect(byN.has(days[k]), `day ${k} names hymn ${days[k]}`).toBe(true); });
  it('Christmas hymns fall only on Dec 12–31, one a day, in the book\'s order, ending Dec 31 (3045)', () => {
    const xmas = new Set(CHRISTMAS.map(String));
    for (const k of keys) { const isX = xmas.has(String(days[k])); const inWindow = k >= '12-12'; expect(isX, `day ${k} hymn ${days[k]}`).toBe(inWindow); }
    expect(Array.from({ length: 20 }, (_, i) => String(days[`12-${12 + i}`]))).toEqual(CHRISTMAS.map(String));
    expect(days['12-25']).toBe('44');
  });
  it('no hymn the skip test left out appears on any day, and none is in the file (3040, 3043, 3044, 3091)', () => {
    const used = new Set(keys.map((k) => String(days[k])));
    for (const n of SKIPPED) { expect(used.has(String(n)), `skipped hymn ${n} on a day`).toBe(false); expect(byN.has(String(n)), `skipped hymn ${n} in the file`).toBe(false); }
  });
  it('the rest of the year runs in the book\'s order, looping from Jan 1; each rotation hymn lands 2 or 3 times (141 hymns)', () => {
    const order = hymns.map((h) => String(h.n)).filter((n) => !CHRISTMAS.map(String).includes(n));
    expect(order.length).toBe(141);
    const run = keys.filter((k) => k < '12-12').sort();
    expect(run.length).toBe(346);
    run.forEach((k, i) => expect(String(days[k]), `day ${k}`).toBe(order[i % order.length]));
    for (const n of order) { const c = run.filter((k) => String(days[k]) === n).length; expect(c >= 2 && c <= 3, `hymn ${n} lands ${c} times`).toBe(true); }
  });
  it('the approved table\'s spot checks: Jan 1 is hymn 1, Feb 29 is hymn 92, Nov 14 is hymn 69, Dec 11 is hymn 96, Dec 31 is hymn 51', () => {
    expect([days['01-01'], days['02-29'], days['11-14'], days['12-11'], days['12-31']]).toEqual(['1', '92', '69', '96', '51']);
  });
});
