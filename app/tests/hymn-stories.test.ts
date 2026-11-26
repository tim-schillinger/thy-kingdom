// "The Writer": a short, sourced story for each hymn (Build 7j; claude/content/hymn-stories.md and -2 to -8, approved Nov 14, 2026).
// Data level: the file the app will ship (public/content/hymn-stories.json), the source it is built from (data/hymn-stories.json), and the story rules a test can read.
// The sources stay in the Project docs; this file holds the text only. Nothing reads it on screen yet.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const shipped = JSON.parse(read('../public/content/hymn-stories.json')).stories as Record<string, string>;
const source = JSON.parse(read('../../data/hymn-stories.json')).stories as Record<string, string>;
const hymns: { n: number | string; recorded: string | null }[] = JSON.parse(read('../public/content/hymns.json')).hymns;
const nums = hymns.map((h) => String(h.n));

/** Text outside the double quotes: a Bible verse or a hymn line stays as written, so a rule about the app's own words reads only what is outside them. */
const outside = (t: string) => t.replace(/“[^”]*”/g, '“”');
/** Like outside, but a quote that ends in . ! or ? keeps that mark, since it can end the sentence ("...sought me.") */
const bare = (t: string) => t.replace(/“([^”]*)”/g, (_m, c: string) => '“' + (/[.!?]$/.test(c) ? c.slice(-1) : '') + '”');
/** Sentences, as the story rule counts them ("up to five short sentences"): a quoted line is part of its sentence, and initials and "St." do not end one. */
function sentences(t: string): number {
  const x = bare(t).replace(/\b([A-Z])\./g, '$1·').replace(/\b(St|Mr|Mrs|Dr|No)\./g, '$1·').replace('D.C.', 'D·C·').replace('U.S.', 'U·S·');
  return (x.match(/[.!?]”?(?=\s+[A-Z“]|$)/g) ?? []).length;
}

describe('the hymn stories: the file', () => {
  it('the shipped file is the source file, built by tools/build_content.py', () => { expect(shipped).toEqual(source); });
  it('161 stories, one for every hymn in the year and no other (77b included)', () => {
    expect(Object.keys(source).length).toBe(161);
    expect(Object.keys(source).sort()).toEqual([...nums].sort());
    expect(nums).toContain('77b');
  });
  it('the 28 recorded hymns all have a story (the lane began with them)', () => {
    const rec = hymns.filter((h) => h.recorded);
    expect(rec.length).toBe(28);
    for (const h of rec) expect(source[String(h.n)]?.length, `recorded hymn ${h.n}`).toBeGreaterThan(40);
  });
});

describe('the hymn stories: the story rules a test can read (hymn-stories.md, rules 1, 3, 4, 6; voice §4)', () => {
  const all = Object.entries(source);
  it('every story is plain text: no blank, no double space, no line break, no leading or trailing space', () => {
    for (const [n, t] of all) { expect(t, `hymn ${n}`).toBe(t.trim()); expect(t, `hymn ${n}`).not.toMatch(/\s{2,}|\n/); expect(t.length, `hymn ${n}`).toBeGreaterThan(100); }
  });
  it('rule 1: two to five sentences, and none runs past 600 characters (the longest today is 560)', () => {
    for (const [n, t] of all) { const s = sentences(t); expect(s >= 2 && s <= 5, `hymn ${n} has ${s} sentences`).toBe(true); expect(t.length, `hymn ${n} length`).toBeLessThanOrEqual(600); }
  });
  it('app copy has no semicolon (voice §4); the two Bible quotes that hold one (Isaiah 41:10 in 122, Isaiah 1:18 in 192) stay as written', () => {
    for (const [n, t] of all) expect(outside(t), `hymn ${n}`).not.toMatch(/;/);
    expect(all.filter(([, t]) => t.includes(';')).map(([n]) => n).sort()).toEqual(['122', '192']);
  });
  it('no "…" or "...", no dash used as a break, no "the original" (voice §4), no hymn number (3111: the app shows names only)', () => {
    for (const [n, t] of all) {
      expect(t, `hymn ${n}`).not.toMatch(/…|\.\.\.|—| - /);
      expect(t, `hymn ${n}`).not.toMatch(/\bthe original\b/i);
      expect(t, `hymn ${n}`).not.toMatch(/\b[Hh]ymns? (no\.|number|#)\s*\d|\bno\. \d/);
    }
  });
  it('every story ends a sentence, and its quotes are curly and in pairs, like the app\'s own lines (3157): no straight " or \' anywhere', () => {
    for (const [n, t] of all) {
      expect(t, `hymn ${n}`).toMatch(/[.!?]”?$/);
      expect(t, `hymn ${n}`).not.toMatch(/["']/);
      expect((t.match(/“/g) ?? []).length, `hymn ${n} quotes`).toBe((t.match(/”/g) ?? []).length);
    }
  });
  it('rule 3 (nothing about a writer\'s character) and rule 4 (no credit line) are read by the Creator in the sweep, not by this test; the file has no "Sources:" line or "Written by" credit', () => {
    for (const [n, t] of all) expect(t, `hymn ${n}`).not.toMatch(/\bSources?:|\bWords by\b|\bWritten by\b/);
  });
});
