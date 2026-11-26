// The 67 read sheets and the five Check-In anchors (frame-lock-4a, 4b, 4c; first-time clarity, Build 1f, Nov 10, 2026).
// Every verse is read back against the app's own Bible files, in both Bibles (A18, A22, B3): a stored quote is the verse's own words, in order, never narration,
// never a psalm title, and never a stray quote mark. The words are 1–3 words and no sheet text carries a semicolon (voice.md §4).
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { CHECKIN, ANCHOR_MEANING } from '../src/copy';
import { LISTS, type CheckIn, type Ref } from '../src/engine/types';
import { anchorQuote } from '../src/engine/anchor';
import { chaptersOf } from '../src/engine/refs';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const sheets = load('sheets.json');
const book = (t: 'web' | 'kjv', b: string): string[][] => load(`bible/${t}/${b}.json`).ch;
const verseText = (t: 'web' | 'kjv', r: Ref) => chaptersOf(r, (c) => book(t, r.b)[c - 1].length).flatMap(({ c, from, to }) => book(t, r.b)[c - 1].slice(from - 1, to)).join(' ');
const norm = (s: string) => s.toLowerCase().replace(/\[|\]|¶/g, '').replace(/\s+/g, ' ').trim();
/** The stored words are a run of fragments split by "…", each found in the verse text, in order. */
function readsWhole(stored: string, whole: string) {
  const hay = norm(whole); let at = 0;
  for (const f of stored.split('…').map((x) => norm(x)).filter(Boolean)) { const i = hay.indexOf(f, at); if (i < 0) return `"${f}" is not in the verse from position ${at}`; at = i + f.length; }
  return '';
}
const CI: CheckIn[] = ['burnt', 'grain', 'peace', 'sin', 'trespass'];
const all = [...CI.flatMap((c) => sheets.checkin[c].items.map((x: any) => ({ id: `${c}/${x.word}`, ...x }))), ...sheets.lists.map((x: any) => ({ id: `list/${x.name}`, ...x }))];

describe('the sheets match the app\'s words', () => {
  it('60 Check-In sheets in the order of the words on each Check-In, and 7 list sheets in the order of the lists', () => {
    for (const c of CI) { expect(sheets.checkin[c].items.length).toBe(12); expect(sheets.checkin[c].items.map((x: any) => x.word)).toEqual(CHECKIN[c].areas); }
    expect(sheets.lists.map((x: any) => x.name)).toEqual(LISTS.map((x) => x.name));
    expect(all.length).toBe(67);
  });
  it('every word is 1–3 words (1698–1701); every sheet has a line, three ways, and no semicolon or straight apostrophe', () => {
    for (const x of all) {
      if (x.word) expect(x.word.split(' ').length, x.id).toBeLessThanOrEqual(3);
      expect(x.a.length, x.id).toBeGreaterThan(20); expect(x.b.length, x.id).toBe(3);
      for (const t of [x.a, ...x.b]) { expect(t, x.id).not.toMatch(/;/); expect(t, x.id).not.toMatch(/'|"/); }
    }
  });
});

describe('every sheet verse reads whole in both Bibles', () => {
  for (const t of ['web', 'kjv'] as const) it(`${t}: the quoted words are the verse's own, in order`, () => {
    for (const x of all) {
      const q = x[t] as string;
      expect(readsWhole(q, verseText(t, x.ref)), `${x.id} (${t}): ${q}`).toBe('');
      expect(q, x.id).not.toMatch(/[“”‘]|^A (Psalm|Song)|¶|\[|\]/);
      expect(/[.!?…]$/.test(q), `${x.id} (${t}) ends mid-sentence with no mark: ${q}`).toBe(true);
      expect(q, x.id).not.toMatch(/^(And he answering said|He answered|Then he said)/i);
    }
  });
});

describe('the five Check-In anchors read whole in both Bibles', () => {
  const usfm = (s: string): Ref => { const [b, cv] = s.split(' '); const [c, v] = cv.split(':'); return { b, c: +c, v: +v }; };
  for (const t of ['web', 'kjv'] as const) it(`${t}: the quote line is the verse's own words and never starts on narration`, () => {
    for (const c of CI) {
      const r = usfm(CHECKIN[c].anchor), whole = verseText(t, r).replace(/\[|\]|¶/g, '').trim();
      const q = anchorQuote(whole, CHECKIN[c].quote?.[t]), body = q.replace(/^“|…”$/g, '');
      expect(readsWhole(body, whole), `${c} (${t}): ${q}`).toBe('');
      expect(q, `${c} (${t})`).not.toMatch(/^“(And he answering said|He answered)/i);
      expect(body.length, `${c} (${t}) quote too short: ${q}`).toBeGreaterThan(24);
    }
  });
  it('All of Me stores its quote per Bible, through "mind…" (1679); Giving and Fairness carry a meaning line (1714, 1721)', () => {
    expect(CHECKIN.burnt.quote!.web.endsWith('with all your mind…”')).toBe(true);
    expect(CHECKIN.burnt.quote!.kjv.endsWith('with all thy mind…”')).toBe(true);
    expect(Object.keys(ANCHOR_MEANING).sort()).toEqual(['grain', 'trespass']);
  });
});

describe('the Bible files carry no stray headings', () => {
  it('Psalm 119 has no Hebrew letter heading (ALEPH … TAV) at the start or end of a verse, in either Bible (Nov 10)', () => {
    for (const tr of ['web', 'kjv'] as const) book(tr, 'PSA')[118].forEach((v, k) => expect(v, `${tr} Psalm 119:${k + 1}`).not.toMatch(/(^|\s)[A-Z]{3,6}(\sAND\s[A-Z]{3,6})?\s*$|^[A-Z]{3,6}\s/));
  });
});
