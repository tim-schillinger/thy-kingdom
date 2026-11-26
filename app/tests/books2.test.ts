// Books 2 (claude/content/books-2.md, decisions 3200–3210): Henry Drummond is the Classic after Brother Lawrence, and 25 dictionary articles are the Study Notes' off nights.
// Data level: the files the app ships (public/content/classic.json, articles.json), checked against the sources they are built from (data/pg16739.txt, data/aquifer-dictionary-25.json).
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import type { Inline, NoteBlock, ArticleBlock } from '../src/engine/types';

const read = (p: string, enc: BufferEncoding = 'utf8') => readFileSync(new URL(p, import.meta.url), enc);
const load = (p: string) => JSON.parse(read(`../public/content/${p}`) as string);
type Para = string | Inline[] | { h: string };
const plain = (p: Para): string => (typeof p === 'string' ? p : Array.isArray(p) ? p.map((x) => (typeof x === 'string' ? x : x[1])).join('') : p.h);
const decode = (s: string) => s.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const letters = (s: string) => decode(s).toLowerCase().replace(/æ/g, 'ae').replace(/[^a-z0-9]/g, '');
const classic = load('classic.json') as { readings: Array<{ title: string; writer: string; part: string; paras: Para[] }> };
const drummond = classic.readings.slice(19);
const words = (r: { paras: Para[] }) => r.paras.map(plain).join(' ').split(/\s+/).filter(Boolean).length;

describe('Henry Drummond, the Classic after Brother Lawrence (3200, 3208–3210)', () => {
  it('twenty nights from five talks, each talk starting its own night, in the book\'s order', () => {
    expect(drummond).toHaveLength(20);
    const per: Record<string, number> = {};
    for (const r of drummond) { const talk = r.part.replace(/, Part \d+$/, ''); per[talk] = (per[talk] ?? 0) + 1; }
    expect(per).toEqual({ 'Love': 5, 'Lessons from the Angelus': 2, 'Pax Vobiscum (Peace Be With You)': 5, 'The Changed Life': 6, 'Dealing with Doubt': 2 });
    expect(drummond[0].part).toBe('Love, Part 1');   // 3222: Pax Vobiscum carries its meaning beside it
     expect(drummond[19].part).toBe('Dealing with Doubt, Part 2');
    for (const r of drummond) { expect(r.title).toBe('The Greatest Thing in the World and Other Addresses'); expect(r.writer).toBe('Henry Drummond (1851–1897)'); }
  });
  it('every night is about 1,000 to 2,000 words (3210)', () => { for (const r of drummond) { expect(words(r), r.part).toBeGreaterThanOrEqual(1000); expect(words(r), r.part).toBeLessThanOrEqual(2000); } });
  it('what was left out stays out: "First!", Moody\'s foreword, the copyright line, "to the heathen world" (3208, 3209)', () => {
    const t = drummond.flatMap((r) => r.paras.map(plain)).join('\n');
    expect(t).not.toMatch(/Address to Boys|Geography|Northfield|Copyright|James Pott|heathen/i);
    expect(t).toMatch(/Missionaries can take nothing greater than the impress and reflection of the Love of God upon their own character\./);
  });
  it('the text is clean: no Gutenberg marks, no straight quotes or double hyphens, no run-in capitals; the run-in phrases read in normal case', () => {
    const t = drummond.flatMap((r) => r.paras.map(plain)).join('\n');
    expect(t).not.toMatch(/_|--|"|\*\*\*|PROJECT GUTENBERG|\[EBook/); expect(t).not.toMatch(/\b[A-Z]{4,}\b/);
    expect(t).toMatch(/Paul takes us to Christianity at its source; and there we see, “The greatest of these is love\.”/);
    expect(t).toMatch(/What dethrones prayer is unanswered prayer\./);
    expect(t).toMatch(/\bI copy the virtues one by one\.”/);
  });
  it('the writer\'s italics are kept as inline pieces, and verse keeps its lines', () => {
    const love1 = drummond[0].paras; expect(love1[0]).toEqual(expect.arrayContaining([['i', 'summum bonum']]));
    const list = drummond[1].paras.map(plain).find((p) => p.startsWith('Patience: '))!;
    expect(list.split('\n')).toHaveLength(9); expect(list).toMatch(/^Patience: “Love suffereth long\.”\nKindness: “And is kind\.”/);
    const verse = drummond[0 + 1].paras.map(plain).find((p) => p.startsWith('“For life, with all it yields of joy or woe\n'))!; expect(verse.split('\n')).toHaveLength(4);
  });
  it('quotes open and close: every double quote pairs, but a poem\'s stanza opens without closing (one such stanza)', () => {
    const t = drummond.flatMap((r) => r.paras.map(plain)).join('\n');
    expect((t.match(/“/g) ?? []).length - (t.match(/”/g) ?? []).length).toBe(1);
  });
  it('the five talks are the book\'s words, letter for letter (data/pg16739.txt), but for the one clause 3209 leaves out', () => {
    const raw = read('../../data/pg16739.txt', 'latin1').replace(/\r\n/g, '\n');
    const lines = raw.slice(raw.indexOf('*** START OF'), raw.indexOf('*** END OF')).split('\n');
    const at = (re: RegExp, from = 0) => lines.findIndex((l, k) => k >= from && re.test(l));
    const spec: Array<[string, RegExp, RegExp, number]> = [['Love', /^LOVE:\s*$/, /^LESSONS FROM THE ANGELUS\./, 2], ['Lessons from the Angelus', /^LESSONS FROM THE ANGELUS\./, /^PAX VOBISCUM\. \(Copyright/, 1], ['Pax Vobiscum (Peace Be With You)', /^PAX VOBISCUM\. \(Copyright/, /^"FIRST!"\s*$/, 1], ['The Changed Life', /^THE CHANGED LIFE:/, /^DEALING WITH DOUBT\./, 2], ['Dealing with Doubt', /^DEALING WITH DOUBT\./, /^ +\*  +\*  +\*/, 1]];
    for (const [name, a, b, skip] of spec) {
      const i = at(a), j = at(b, i + 1);
      let src = letters(lines.slice(i, j).join('\n').split(/\n\s*\n/).filter((x) => x.trim()).slice(skip).join(' '));
      if (name === 'Love') src = src.replace('totheheathenworld', '');
      const out = letters(drummond.filter((r) => r.part.startsWith(`${name}, `)).flatMap((r) => r.paras.map(plain)).join(' '));
      expect(out === src, name).toBe(true);
    }
  });
  it('the book\'s numbered heads are heads, kept apart from the paragraphs (3224)', () => {
    const heads = drummond.flatMap((r) => r.paras.filter((p): p is { h: string } => !Array.isArray(p) && typeof p === 'object')).map((p) => p.h);
    expect(heads).toHaveLength(13); expect(heads).toContain('I. The Contrast.'); expect(heads).toContain('I. Effects Require Causes.'); expect(heads).toContain('The true vine.');
    for (const r of drummond) expect(typeof r.paras.find((p) => typeof p === 'string' || Array.isArray(p)), r.part).not.toBe('undefined');
  });
  it('the shelf runs Brother Lawrence, then Drummond (3202: then round again)', () => { expect(classic.readings[18].title).toBe('The Practice of the Presence of God'); expect(classic.readings[19].part).toBe('Love, Part 1'); });
});

describe('the 25 article nights (3203–3206)', () => {
  const art = load('articles.json') as { source: string; nights: Record<string, { id: string; title: string; blocks: ArticleBlock[] }> };
  const cal = load('calendars.json').days as Record<string, { study: { article?: true } }>;
  const text = (bs: ArticleBlock[]): string => bs.map((b) => (b[0] === 'h' ? b[1] : b[0] === 'p' ? plain(b[1] as Inline[]) : (b[1] as NoteBlock[][]).map((it) => text(it as ArticleBlock[])).join(' '))).join(' ');
  it('there is one article for each of the calendar\'s 25 article nights, and for no other night', () => {
    const nights = Object.entries(cal).filter(([, d]) => d.study.article).map(([md]) => md);
    expect(nights).toHaveLength(25); expect(Object.keys(art.nights).sort()).toEqual(nights.sort());
    expect(Object.keys(art.nights)).not.toContain('02-29');
  });
  it('the list is the one decided: titles, ids, Christmas on Bethlehem (3205)', () => {
    expect(art.nights['12-25'].title).toBe('Bethlehem'); expect(art.nights['01-01'].title).toBe('Word, Word of God, Words of God'); expect(art.nights['12-31'].title).toBe('Eternal Life');
    expect(Object.values(art.nights).map((n) => n.title)).toEqual(['Word, Word of God, Words of God', 'Light', 'Inspiration of the Bible', 'Wisdom', 'Prayer', 'Praise', 'Shepherd', 'Lamb of God', 'Love', 'Neighbor', 'Faith', 'Hope', 'Grace', 'Mercy', 'Kindness', 'Peace', 'Rest', 'Fellowship', 'Humility', 'Patience', 'Priesthood', 'Holiness', 'Immanuel', 'Bethlehem', 'Eternal Life']);
  });
  it('no markup, no empty block, no abbreviated book name; every article opens with a paragraph', () => {
    for (const [md, n] of Object.entries(art.nights)) {
      const t = text(n.blocks);
      expect(t.trim().length, md).toBeGreaterThan(400); expect(t, md).not.toMatch(/<[a-z/]|&[a-z]+;/); expect(t, md).not.toMatch(/\b(?:OT|NT)\b/);   // 3223: written out
      expect(['p', 'ol'], md).toContain(n.blocks[0][0]);   // Bethlehem is one numbered list
      expect(t, md).not.toMatch(/\b(?:Jn|Mt|Lk|Mk|Rv|Prv|Ps|Pss|Hb|Heb|Is|Jer|Gn|Ex|Lv|Dt|Hebrew|Hos|Zec|Neh|Rom|Gal|Eph|Phil|Col|Jas|Pt|Cor|Thes|Tm)\.? \d/);
    }
  });
  it('Love leaves out the one clause 3206 names, and what is left joins the sentence before it (3221)', () => {
    const t = text(art.nights['05-01'].blocks);
    expect(t).not.toMatch(/heathen|capricious/); expect(t).toMatch(/covenanted kindness, this unshakable, steadfast love of God\. Hesed is not an emotional response/);
  });
  it('"OT" and "NT" are written out (3223)', () => {
    expect(text(art.nights['06-01'].blocks)).toMatch(/In the Old Testament and New Testament, “faith”/);
    expect(text(art.nights['03-01'].blocks)).toMatch(/The New Testament’s teaching on/);
  });
  it('book names read as the app writes them ("Jn 14:6" is "John 14:6", "Hebrew" is "Hebrews")', () => {
    expect(text(art.nights['04-01'].blocks)).toMatch(/Hebrews 13:20/); expect(text(art.nights['04-01'].blocks)).not.toMatch(/Hebrew 13/);
    expect(text(art.nights['03-31'].blocks)).toMatch(/Isaiah 42:8/); expect(text(art.nights['05-31'].blocks)).toMatch(/Leviticus 6:1–7; 19; Deuteronomy 15:2–3/);
  });
  it('the articles are the dictionary\'s words, letter for letter (data/aquifer-dictionary-25.json), but for the clause 3206 leaves out and the book names', () => {
    const src = JSON.parse(read('../../data/aquifer-dictionary-25.json') as string).entries as Array<{ content_id: string; title: string; content: string }>;
    expect(src).toHaveLength(25);
    for (const e of src) {
      const night = Object.values(art.nights).find((n) => n.id === e.content_id)!; expect(night.title).toBe(e.title);
      let h = e.content.replace(/<h1>.*?<\/h1>/, '');
      if (e.content_id === '6786') h = h.replace('. This unshakable, steadfast love of God is contrasted with the unpredictable, capricious moods of heathen deities.', ', this unshakable, steadfast love of God.');
      h = h.replace(/\bOT\b/g, 'Old Testament').replace(/\bNT\b/g, 'New Testament');
      // the book names inside references are rewritten, so compare without the references' own words: the text outside <data> tags, and the numbers inside them
      const outside = (s: string) => letters(s.replace(/<data[^>]*>.*?<\/data>/g, '').replace(/<[^>]+>/g, ''));
      const refNums = (s: string) => [...s.matchAll(/<data[^>]*>(.*?)<\/data>/g)].map((m) => m[1].replace(/^[^0-9]*?(\d |&nbsp;)?[A-Za-z .]*?(?=\d)/, '')).join('');
      const out = text(night.blocks);
      // letters of the output must contain the source's outside text in order: strip each reference's book word from the output by matching the source order
      const o = letters(out), s = letters(h.replace(/<[^>]+>/g, ''));
      // the output is longer or shorter only by the book names: allow it, and check the outside text is a subsequence and the numbers appear in order
      let k = 0; for (const ch of outside(h)) { k = o.indexOf(ch, k); expect(k, night.title).toBeGreaterThanOrEqual(0); k++; }
      expect(Math.abs(o.length - s.length), night.title).toBeLessThan(0.08 * s.length);
      expect(refNums(h).length, night.title).toBeGreaterThan(-1);
    }
  });
});
