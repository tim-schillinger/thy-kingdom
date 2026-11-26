// The quote-mark rule for verses the app picks (frame-lock-2 §6, 589): where a World English verse opens or closes with a quote mark
// that has no partner inside the picked verse, drop only that mark. No word changes. The King James text carries none.
export function stripLoneQuotes(t: string, trans: 'web' | 'kjv'): string {
  if (trans !== 'web') return t;
  const n = (ch: string) => t.split(ch).length - 1;
  if (t.startsWith('“') && n('“') > n('”')) t = t.slice(1);
  if (t.endsWith('”') && n('”') > n('“')) t = t.slice(0, -1);
  if (t.startsWith('‘') && !t.includes('’')) t = t.slice(1);
  if (t.endsWith('’') && !t.includes('‘') && !/\w’\w/.test(t.slice(0, -1))) t = t.slice(0, -1);
  return t;
}
