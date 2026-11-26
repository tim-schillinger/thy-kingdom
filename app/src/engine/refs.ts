// Passage references for display: "Psalm 97", "Luke 8, Matthew 13", "Revelation 4:6–5:13". En dash in ranges.
import type { Content, Ref } from './types';

export function formatRef(content: Content, r: Ref): string {
  const book = content.books.find((b) => b.id === r.b)!;
  const multi = r.c2 !== undefined && r.c2 !== r.c && r.v === undefined;
  const name = r.b === 'PSA' && !multi ? book.one : book.name;
  if (r.v === undefined) return r.c2 && r.c2 !== r.c ? `${name} ${r.c}–${r.c2}` : `${name} ${r.c}`;
  if (r.v2 === undefined && r.c2 !== undefined) return `${name} ${r.c}:${r.v}–${r.c2}`; // to the end of chapter c2
  if (r.v2 === undefined) return `${name} ${r.c}:${r.v}`;
  // The week's and the Name day's verses are {b, c, v, v2}: a run inside one chapter, c2 left out (frame-lock-2 §6)
  return (r.c2 ?? r.c) === r.c ? `${name} ${r.c}:${r.v}–${r.v2}` : `${name} ${r.c}:${r.v}–${r.c2}:${r.v2}`;
}
export const formatRefs = (content: Content, refs: Ref[]) => refs.map((r) => formatRef(content, r)).join(', ');

/** Each chapter a reference covers, with its verse range inside that chapter. */
export function chaptersOf(r: Ref, chapterLength: (c: number) => number): { c: number; from: number; to: number }[] {
  const last = r.c2 ?? r.c;
  const out = [];
  for (let c = r.c; c <= last; c++) {
    const len = chapterLength(c);
    const from = c === r.c && r.v ? r.v : 1;
    const to = c === last && r.v2 ? r.v2 : (c === r.c && r.v && r.c2 === undefined ? r.v : len);
    out.push({ c, from, to: Math.min(to, len) });
  }
  return out;
}

/** Parse a key reference as the Author writes it ("1 Kg 8:27", "Heb. 11:27", "REV 22:13") into a Ref. */
const KEY_BOOKS: Record<string, string> = {
  'Jer': 'JER', 'Rom': 'ROM', 'Deut': 'DEU', 'Ps': 'PSA', 'James': 'JAS', '1 Jn': '1JN', 'Jonah': 'JON', 'Lam': 'LAM', '2 Pet': '2PE',
  'Is': 'ISA', 'Rev': 'REV', 'Jn': 'JHN', '1 Kg': '1KI', 'Hab': 'HAB', 'Job': 'JOB', 'Prov': 'PRO', '1 Tim': '1TI', 'Jude': 'JUD', 'Heb': 'HEB',
  'REV': 'REV', 'MRK': 'MRK',
};
export function parseKeyRef(s: string): Ref | null {
  const m = s.replace('.', '').match(/^(\d?\s?[A-Za-z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!m) return null;
  const b = KEY_BOOKS[m[1].trim()];
  if (!b) return null;
  if (m[1].trim() === 'Jude') return { b, c: 1, v: +m[2] }; // "Jude 25": one chapter
  const r: Ref = { b, c: +m[2] };
  if (m[3]) r.v = +m[3];
  if (m[4]) { r.c2 = r.c; r.v2 = +m[4]; }
  return r;
}
