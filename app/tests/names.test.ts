// The Name and Attribute nights, the 52 Meditate runs, Psalm 119's letters and the King James marks (Build 7a; frame-lock-5-names-2 §D3).
// Engine and data level: read through meditationFor, the door the screen uses. A failure names the day.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { planFor, meditationFor } from '../src/engine/plan';
import { noParagraphMarks } from '../src/data/content';
import { chaptersOf } from '../src/engine/refs';
import { emptyHerData, type Content, type Ref } from '../src/engine/types';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const content: Content = {
  cal: load('calendars.json'), classic: load('classic.json'), articles: load('articles.json'), books: load('books.json').order,
  nations: Object.fromEntries(load('nations.json').list.map((n: any) => [n.id, n])), facts: load('nation-facts.json').list, factsSource: load('nation-facts.json').sourceLine, medkey: load('meditation-key.json'), sheets: load('sheets.json'), hymns: load('hymns.json'), hymnStories: load('hymn-stories.json').stories, hymnAudio: load('hymn-audio.json'),
};
const days = Object.entries(content.cal.days);
const bibles = new Map<string, string[][]>();
const book = (t: string, b: string) => { const k = `${t}/${b}`; if (!bibles.has(k)) bibles.set(k, load(`bible/${t}/${b}.json`).ch); return bibles.get(k)!; };
const text = (t: 'web' | 'kjv', r: Ref) => chaptersOf(r, (c) => book(t, r.b)[c - 1].length).flatMap(({ c, from, to }) => book(t, r.b)[c - 1].slice(from - 1, to)).join(' ');
const nights = days.filter(([, d]) => d.night).map(([k, d]) => [k, d.night!] as const);
const runs = days.filter(([, d]) => d.run);
const refsOf = (): Array<[string, Ref]> => [
  ...days.map(([k, d]) => [`week ${k}`, d.weekVerse!] as [string, Ref]),
  ...nights.map(([k, n]) => [`night ${k}`, n.verse] as [string, Ref]),
  ...[...new Map(runs.map(([, d]) => [d.run!.run, d.run!])).values()].map((r) => [`run ${r.run}`, r.verse] as [string, Ref]),
];

describe('the 53 Name and Attribute nights', () => {
  it('27 names and 26 attributes, each on the calendar word it was written for', () => {
    expect(nights.length).toBe(53);
    expect(nights.filter(([, n]) => n.kind === 'name').length).toBe(27);
    expect(nights.filter(([, n]) => n.kind === 'attribute').length).toBe(26);
  });
  it('Dec 17 is a Name night by date; Dec 16, Dec 18 and Jan 2 are runs (781)', () => {
    expect(content.cal.days['12-17'].night).toMatchObject({ kind: 'name', word: 'Jesus' });
    for (const k of ['12-16', '12-18', '01-02']) expect(content.cal.days[k].night, k).toBeUndefined();
  });
  it('May 28 shows Isaiah 40:26 and keeps the Author\'s Is 40:6; Jun 11 shows Jude 24–25 (783)', () => {
    expect(content.cal.days['05-28'].night).toMatchObject({ verse: { b: 'ISA', c: 40, v: 26 }, authorRef: 'Is 40:6' });
    expect(content.cal.days['06-11'].night!.verse).toMatchObject({ b: 'JUD', c: 1, v: 24, v2: 25 });
  });
  it('a night shows its own verse, never the week\'s, and exactly one run or one night holds every day', () => {
    const bad: string[] = [];
    for (const [k, d] of days) {
      if (!!d.night === !!d.run) bad.push(`${k}: a night and a run (or neither)`);
      const m = meditationFor(content, `2027-${k}`);
      if (!m?.verse) bad.push(`${k}: no verse`); else if (JSON.stringify(m.verse) === JSON.stringify(d.weekVerse)) bad.push(`${k}: the Memorize verse`);
    }
    expect(bad).toEqual([]);
  });
  it('no picked verse has a standalone "Yah" or a "Selah", in either Bible (1741)', () => {
    const bad: string[] = [];
    for (const [where, r] of refsOf()) for (const t of ['web', 'kjv'] as const) { const x = text(t, r); if (/\bYah\b/.test(x) || /\bSelah\b/.test(x)) bad.push(`${where} ${t}`); }
    expect(bad).toEqual([]);
  });
  it('no verse is picked twice across the weeks, the nights and the runs (Revelation 22:13 on Jan 1 and Dec 31 and Matthew 11:28 in the Oct 9–15 week and Meditate run 1 are the two named exceptions; 3010 a, 3358 C)', () => {
    const seen = new Map<string, string>(); const dup: string[] = [];
    const picks = refsOf().filter(([w]) => !w.startsWith('week ')); const weeks = new Map<string, Ref>();
    for (const [w, r] of refsOf()) if (w.startsWith('week ')) weeks.set(JSON.stringify(r), r);
    for (const [where, r] of [...[...weeks.values()].map((r) => [`week ${r.b} ${r.c}:${r.v}`, r] as [string, Ref]), ...picks]) {
      for (const { c, from, to } of chaptersOf(r, (n) => book('web', r.b)[n - 1].length)) for (let v = from; v <= to; v++) {
        const key = `${r.b} ${c}:${v}`; const was = seen.get(key);
        if (was && !(key === 'REV 22:13' && was.startsWith('night 01-01') && where.startsWith('night 12-31')) && !(key === 'MAT 11:28' && was === 'week MAT 11:28' && where === 'run 1')) dup.push(`${key}: ${was} and ${where}`);
        seen.set(key, where);
      }
    }
    expect(dup).toEqual([]);
  });
  it('every Name night has a mark: Hebrew letters (Alpha and Omega, Greek letters); a King James line only where one is written (11, Yahweh Nissi among them)', () => {
    const names = nights.filter(([, n]) => n.kind === 'name');
    for (const [k, n] of names) expect(n.mark, k).toMatch(k === '01-01' ? /^Α$/ : k === '12-31' ? /^Ω$/ : /^[א-ת ]+$/);
    expect(names.filter(([, n]) => n.bibleNote?.kjv).length).toBe(11);
    expect(content.cal.days['09-10'].night!.bibleNote?.kjv).toBeTruthy();
    for (const [, n] of nights.filter(([, n]) => n.kind === 'attribute')) expect(n.mark).toBeUndefined();
  });
  it('no title on screen holds a bracket or a slash, and no team word reaches a screen ("Misc", "Wk/", a code like Y-Rohi) (1883, frame-lock-7 R13)', () => {
    const bad: string[] = [];
    for (const [k] of days) {
      const m = meditationFor(content, `2027-${k}`)!; const shown = m.question === 'all' ? m.title : `This week: ${m.title}`;
      if (/[()/]/.test(shown)) bad.push(`${k}: ${shown}`);
      if (/\bMisc\b|\bWk\b|Wk\/|\b[A-Z]-[A-Z][a-z]+\b|\bO-[A-Z]|\bAM \d/.test(shown)) bad.push(`${k}: team word in "${shown}"`);
    }
    expect(bad).toEqual([]);
  });
});

describe('the 52 Meditate runs', () => {
  it('52 runs of six nights, one passage each, the question counting 1 to 6 (Feb 29 has no row)', () => {
    const by = new Map<number, string[]>();
    for (const [k, d] of runs) by.set(d.run!.run, [...(by.get(d.run!.run) ?? []), k]);
    expect(by.size).toBe(52);
    for (const [n, ks] of by) { expect(ks.length, `run ${n}`).toBe(6); ks.forEach((k, i) => expect(meditationFor(content, `2027-${k}`)!.question, k).toBe(i + 1)); }
  });
  it('the titles are the decided plain lines (1899, 1900, 1901)', () => {
    const t = (k: string) => content.cal.days[k].run!.title;
    expect(t('01-02')).toBe('the words of Jesus'); expect(t('01-23')).toBe('words from Moses'); expect(t('01-09')).toBe('what God made');
    expect(t('05-08')).toBe('how God leads'); expect(t('08-28')).toBe('how Jesus saves'); expect(t('12-25')).toBe('God sets things right');
    expect(t('01-16')).toBe('words from Asaph, a temple singer'); expect(t('06-26')).toBe('words from the prophet Obadiah'); expect(t('12-11')).toBe('words from Jude, a brother of James');
  });
  it('the Sweep\'s changes are in: Obadiah 1:3–4, backups Haggai 1:13 and Habakkuk 3:2 (1981, 1983, 1984)', () => {
    expect(content.cal.days['06-26'].run).toMatchObject({ verse: { b: 'OBA', c: 1, v: 3, v2: 4 }, backup: { b: 'OBA', c: 1, v: 15 } });
    expect(content.cal.days['08-21'].run!.backup).toEqual({ b: 'HAG', c: 1, v: 13 });
    expect(content.cal.days['07-31'].run!.backup).toEqual({ b: 'HAB', c: 3, v: 2 });
  });
});

describe('Psalm 119\'s letters', () => {
  const h = (t: string) => load(`bible/${t}/PSA.json`).h['119'] as Record<string, string>;
  it('both Bibles hold 22 headings at verses 1, 9 … 169, and the calendar names the 22 Hebrew letters in order', () => {
    for (const t of ['web', 'kjv']) expect(Object.keys(h(t)).map(Number).sort((a, b) => a - b)).toEqual(Array.from({ length: 22 }, (_, i) => 1 + 8 * i));
    expect(content.cal.letters.map((l) => l.glyph).join('')).toBe('אבגדהוזחטיכלמנסעפצקרשת');
  });
  it('the spellings: the King James "Vau" and "Schin", the World English "Vav" and "Sin and Shin" (792)', () => {
    expect(h('kjv')['41']).toBe('VAU'); expect(h('kjv')['161']).toBe('SCHIN'); expect(h('web')['41']).toBe('VAV'); expect(h('web')['161']).toBe('SIN AND SHIN');
  });
});

describe('no paragraph mark shows in a King James reading (3007)', () => {
  it('the mark goes and no word changes', () => {
    expect(noParagraphMarks('¶ Come unto me, all ye that labour')).toBe('Come unto me, all ye that labour');
    const bad: string[] = [];
    for (const f of ['GEN', 'PSA', 'MAT', 'JHN', 'ISA']) for (const ch of book('kjv', f)) for (const v of ch) { const o = noParagraphMarks(v); if (o.includes('¶') || o.replace(/\s+/g, ' ').trim() !== v.replace(/¶/g, '').replace(/\s+/g, ' ').trim()) bad.push(v.slice(0, 40)); }
    expect(bad).toEqual([]);
  });
});
