// The quote line of a Check-In anchor (TKC-052, quote with reference): the verse's opening words, from the quoted words (never narration), cut where the sentence
// has a first stop, and "…". Giving, Relationships, Character and Fairness read whole in both Bibles with this cut (measured Nov 9, 2026). All of Me stores its quote
// per Bible (frame-lock-4a §2) because the cut lands on "And he answering said…" in King James. tests/sheets.test.ts opens every anchor in both Bibles.
export function anchorQuote(verse: string, stored?: string): string {
  if (stored) return stored;
  let t = verse.replace(/\[|\]/g, '');
  const q0 = t.indexOf('“'); if (q0 > -1 && q0 < 40) t = t.slice(q0 + 1);
  const m = t.match(/^(.{20,90}?[,;:.])\s/);
  return `“${(m ? m[1].replace(/[,;:]$/, '') : t)}…”`;
}
