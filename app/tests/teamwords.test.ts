// No team words on screen (frame-lock-7 R13, 1883 y; Layers pilot, Build 7b). Internal labels, calendar codes and build names must never reach a screen.
// Data level: it reads what the screens draw (the copy file, every Meditate title through the door the screen uses, the sheets, the Names), not the Bible text or the books.
// The list grows as found: add a pattern when a new team word reaches a screen.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import * as copy from '../src/copy';
import { meditationFor } from '../src/engine/plan';
import type { Content } from '../src/engine/types';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const content: Content = {
  cal: load('calendars.json'), classic: load('classic.json'), articles: load('articles.json'), books: load('books.json').order,
  nations: Object.fromEntries(load('nations.json').list.map((n: any) => [n.id, n])), facts: load('nation-facts.json').list, factsSource: load('nation-facts.json').sourceLine, medkey: load('meditation-key.json'), sheets: load('sheets.json'), hymns: load('hymns.json'), hymnStories: load('hymn-stories.json').stories, hymnAudio: load('hymn-audio.json'),
};
/** What must never be read by her: the calendar's own focus codes ("Misc", "Wk/J"), a component or build name, a team role. */
const TEAM: Array<[string, RegExp]> = [
  ['"Misc" (the calendar\'s code for an ordinary Meditate night)', /\bMisc\b/],
  ['"Wk/" (the calendar\'s code for a week)', /\bWk\/\w/],
  ['a component id (TKC-nnn)', /\bTKC-\d{3}\b/],
  ['a design-system doc name (frame-lock)', /frame-lock/i],
  ['"Builder" or "Watchman" (the team)', /\b(Builder|Watchman)\b/],
];
const strings = (v: unknown, path: string, out: Array<[string, string]> = []): Array<[string, string]> => {
  if (typeof v === 'string') out.push([path, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => strings(x, `${path}[${i}]`, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, `${path}.${k}`, out);
  return out;
};
const hits = (pool: Array<[string, string]>) => pool.flatMap(([where, s]) => TEAM.filter(([, re]) => re.test(s)).map(([why]) => `${where}: ${why}: "${s.slice(0, 80)}"`));

describe('no team words on screen (R13)', () => {
  it('the copy file carries none', () => {
    const pool = Object.entries(copy).flatMap(([k, v]) => typeof v === 'function' ? [] : strings(v, k));
    expect(pool.length).toBeGreaterThan(200);
    expect(hits(pool)).toEqual([]);
  });
  it('every Meditate title the screen draws, on every day, carries none', () => {
    const days = Object.keys(content.cal.days);
    const titles: Array<[string, string]> = [];
    for (const d of days) { const m = meditationFor(content, `2027-${d}`); if (m) titles.push([`meditate title ${d}`, m.night ? m.title : `This week: ${m.title}`]); }
    expect(titles.length).toBeGreaterThan(300);
    expect(hits(titles)).toEqual([]);
  });
  it('the sheets and the Names carry none', () => {
    const pool = [...strings(content.sheets, 'sheets'), ...strings(load('meditation-key.json'), 'meditation-key')];
    expect(pool.length).toBeGreaterThan(300);
    expect(hits(pool)).toEqual([]);
  });
  it('the check itself catches what it should', () => {
    expect(hits([['x', 'This week: Misc']]).length).toBe(1);
    expect(hits([['x', 'Wk/J']]).length).toBe(1);
    expect(hits([['x', 'This week: the words of Jesus']]).length).toBe(0);
  });
});
