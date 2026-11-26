// The three books (C1, decisions 1400–1404): the bundled files hold what the plan says, and leave out what 1404 leaves out.
import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import { classicNight } from '../src/engine/plan';
import type { Content, StudyNote, DigSection, NoteBlock } from '../src/engine/types';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const ids: string[] = load('books.json').order.map((b: { id: string }) => b.id);
const notes = (b: string): Record<string, StudyNote[]> => load(`notes/${b}.json`).ch;
const dig = (b: string): Record<string, DigSection[]> => load(`dig/${b}.json`).ch;
const text = (bs: NoteBlock[]): string => bs.map((b) => (b[0] === 'p' ? b[1].map((x) => (typeof x === 'string' ? x : x[1])).join('') : b[1].map((it) => text(it)).join(' '))).join(' ');
const LEFT_OUT: Array<[string, number, number, number]> = [['GEN', 1, 26, 28], ['ROM', 1, 18, 32], ['ROM', 13, 1, 7], ['EPH', 5, 21, 33], ['1TI', 2, 8, 15], ['TIT', 2, 3, 5], ['1PE', 3, 1, 7], ['MRK', 10, 2, 12], ['MAT', 5, 31, 32], ['MAT', 19, 3, 12], ['LUK', 16, 18, 18], ['1CO', 7, 10, 11]];
const touches = (b: string, c: number, v: number[]) => LEFT_OUT.some(([lb, lc, a, z]) => lb === b && lc === c && v[0] <= z && v[1] >= a);

describe('the three books', () => {
  it('every Bible book has a notes file and a commentary file', () => { for (const b of ids) { expect(existsSync(new URL(`../public/content/notes/${b}.json`, import.meta.url)), b).toBe(true); expect(existsSync(new URL(`../public/content/dig/${b}.json`, import.meta.url)), b).toBe(true); } });
  it('rule 16: Romans 12:1 has a note, Luke 8:1–3 has its section, the First Letter opens as the writer wrote it', () => {
    expect(notes('ROM')['12'].some((n) => n.v[0] === 1)).toBe(true);
    expect(dig('LUK')['8'].find((s) => s.v[0] === 1 && s.v[1] === 3)?.t).toMatch(/^We are here told what Christ made the constant business of his life/);
    const c = load('classic.json');
    expect(c.readings).toHaveLength(39);   // Brother Lawrence's 19, then Henry Drummond's 20 (Books 2)
    expect(c.readings[4].part).toBe('First Letter');
    expect(c.readings[4].paras[0]).toMatch(/^Since you desire so earnestly that I should communicate to you the method/);
  });
  it('the passages 1404 and 738 leave out are out of the notes and the commentary, and the Bible text stays', () => {
    for (const [b, c, a, z] of LEFT_OUT) {
      for (const n of notes(b)[String(c)] ?? []) expect(touches(b, c, n.v), `${b} ${c}:${n.v}`).toBe(false);
      for (const s of dig(b)[String(c)] ?? []) expect(touches(b, c, s.v), `${b} ${c}:${s.v}`).toBe(false);
      const bible = load(`bible/web/${b}.json`).ch[c - 1];
      expect(bible[a - 1] && bible[z - 1], `${b} ${c}:${a}–${z} in the Bible file`).toBeTruthy();
    }
  });
  it('no note or section is empty; no markup or stray bracket reaches the words', () => {
    for (const b of ids) {
      for (const [c, ns] of Object.entries(notes(b))) for (const n of ns) { const t = text(n.b); expect(t.trim().length, `${b} ${c}:${n.v}`).toBeGreaterThan(0); expect(t, `${b} ${c}:${n.v}`).not.toMatch(/<[a-z/]|&nbsp;|&amp;/); }
      for (const [c, ss] of Object.entries(dig(b))) for (const s of ss) { expect(s.t.length, `${b} ${c}:${s.v}`).toBeGreaterThan(20); expect(s.t, `${b} ${c}:${s.v}`).not.toMatch(/<[a-z/]|&[a-z]+;/); }
    }
  });
  it('Exodus 36 is the one chapter without study notes (the plan said 37; the file says 36)', () => {
    const missing: string[] = [];
    for (const b of load('books.json').order as Array<{ id: string; chapters: number }>) for (let c = 1; c <= b.chapters; c++) if (!notes(b.id)[String(c)]) missing.push(`${b.id} ${c}`);
    expect(missing).toEqual(['EXO 36']);
  });
  it('the Classic: 4 conversations then 15 letters, whole, with no Gutenberg marks and no editor footnotes', () => {
    const c = load('classic.json');
    expect(c.readings.slice(0, 4).map((r: { part: string }) => r.part)).toEqual(['First Conversation', 'Second Conversation', 'Third Conversation', 'Fourth Conversation']);
    expect(c.readings[18].part).toBe('Fifteenth Letter');
    for (const r of c.readings.slice(0, 19)) { const t = r.paras.join(' '); expect(t, r.part).not.toMatch(/_|\[\d+\]|NOTES:|\*\*\*|PROJECT GUTENBERG/i); expect(r.paras.length, r.part).toBeGreaterThan(1); expect(r.title, r.part).toBe('The Practice of the Presence of God'); expect(r.writer, r.part).toBe('Brother Lawrence (1614–1691)'); }
    expect(c.readings[18].paras.at(-1)).toMatch(/Yours, &c\.$/);
  });
  it('the start-date test (A13): any night of any year gets a reading, the leap day gets none, the 365 nights cycle through all 39', () => {
    const content = { cal: load('calendars.json'), classic: load('classic.json') } as unknown as Content;
    const seen = new Set<number>();
    for (const md of Object.keys(content.cal.days)) { const n = classicNight(content, `2027-${md}`); expect(n).not.toBeNull(); seen.add(n!); }
    expect(seen.size).toBe(39);
    expect(classicNight(content, '2028-02-29')).toBeNull();
    expect(classicNight(content, '2026-01-01')).toBe(0);
  });
  it('size budget: the notes and commentary stay near what the plan measured (5.2 MB and 3.6 MB raw)', () => {
    let n = 0, d = 0; for (const b of ids) { n += readFileSync(new URL(`../public/content/notes/${b}.json`, import.meta.url)).length; d += readFileSync(new URL(`../public/content/dig/${b}.json`, import.meta.url)).length; }
    expect(n).toBeLessThan(5.6e6); expect(d).toBeLessThan(3.9e6);
  });
});
