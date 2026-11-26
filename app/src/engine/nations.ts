// Nation words for the Kingdom rows and the nation page (TKC-041 F, TKC-016 F). Pure, no UI.
import type { Content, Nation, NationFacts } from './types';

const grouped = (n: number) => n.toLocaleString('en-US');
const oneDecimal = (n: number) => { const r = Math.round(n * 10) / 10; return Number.isInteger(r) ? String(r) : r.toFixed(1); };

/** "About 2.4 million": under 10,000 to the nearest 100, under 1 million to the nearest 10,000, under 10 million to one decimal, under 1 billion to the nearest million, above that one decimal (TKC-041 F). */
export function roundPeople(n: number): string {
  if (n < 10_000) return `About ${grouped(Math.round(n / 100) * 100)}`;
  if (n < 1_000_000) return `About ${grouped(Math.round(n / 10_000) * 10_000)}`;
  if (n < 10_000_000) return `About ${oneDecimal(n / 1_000_000)} million`;
  if (n < 1_000_000_000) return `About ${Math.round(n / 1_000_000)} million`;
  return `About ${oneDecimal(n / 1_000_000_000)} billion`;
}

/** The row's second line: region · population ("Southern Africa · About 2.4 million people"), showing whatever exists. Empty when nothing does. */
export function nationLine(f?: NationFacts): string {
  return [f?.region, f?.population ? `${roundPeople(f.population)} people` : undefined].filter(Boolean).join(' · ');
}

/** Tonight's nations, in the calendar's order, each with its facts (the calendar's ids; an id the nation list lacks is skipped). */
export function nationsFor(c: Content, ids: string[]): Array<{ nation: Nation; facts?: NationFacts }> {
  return ids.filter((id) => c.nations[id]).map((id) => ({ nation: c.nations[id], facts: c.facts[id] }));
}

/** The spot on the placeholder globe: the facts' hand-placed sample if there is one, else a plain placement from latitude and longitude, else none (TKC-042 E "missing map data"). */
export function spotFor(n: Nation, f?: NationFacts): { x: number; y: number } | null {
  if (f?.at) return f.at;
  if (!n.latlng) return null;
  const [lat, lng] = n.latlng;
  return { x: Math.max(-0.8, Math.min(0.8, (lng / 180) * 0.8)), y: Math.max(-0.8, Math.min(0.8, (-lat / 90) * 0.8)) };
}

/** The nation page's facts, only those we have, in the page's order (TKC-016 0.2.1). */
export function factRows(f?: NationFacts): Array<{ label: string; value: string }> {
  if (!f) return [];
  return [
    f.region && { label: 'Region', value: f.region },
    f.capital && { label: 'Capital', value: f.capital },
    f.population && { label: 'Population', value: roundPeople(f.population) },
    f.language && { label: 'Main language', value: f.language },
  ].filter(Boolean) as Array<{ label: string; value: string }>;
}
