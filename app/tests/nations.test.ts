// Nation words and the facts file's contract (engine/nations.ts, public/content/nation-facts.json, tools/build_nation_facts.py).
// Whatever the pipeline writes must satisfy these, so a real Wikidata pull drops in without touching the app.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { roundPeople, nationLine, factRows, spotFor } from '../src/engine/nations';

const load = (f: string) => JSON.parse(readFileSync(new URL(`../public/content/${f}`, import.meta.url), 'utf8'));
const nations: Array<{ id: string; latlng: [number, number] | null }> = load('nations.json').list;
const facts = load('nation-facts.json');

describe('roundPeople (TKC-041 F)', () => {
  it.each([[8449, 'About 8,400'], [450_000, 'About 450,000'], [455_858, 'About 460,000'], [2_410_338, 'About 2.4 million'], [3_000_000, 'About 3 million'],
    [203_080_756, 'About 203 million'], [1_400_000_000, 'About 1.4 billion']])('%i is %s', (n, s) => expect(roundPeople(n)).toBe(s));
});
describe('what a row and a page show', () => {
  it('a row shows what exists', () => {
    expect(nationLine({ region: 'Southern Africa', population: 2_400_000 })).toBe('Southern Africa · About 2.4 million people');
    expect(nationLine({ region: 'Southern Africa' })).toBe('Southern Africa');
    expect(nationLine({ population: 450_000 })).toBe('About 450,000 people');
    expect(nationLine(undefined)).toBe('');
  });
  it('a page leaves out a fact it lacks, never "Unknown"', () => {
    expect(factRows({ region: 'South America', language: 'Portuguese' }).map((r) => r.label)).toEqual(['Region', 'Main language']);
    expect(factRows(undefined)).toEqual([]);
    expect(factRows({ capital: 'Gaborone', language: 'Setswana' }).find((r) => r.label === 'Main language')?.value).toBe('Setswana');
  });
  it('the spot: the facts\' own, else from latitude and longitude, else none', () => {
    expect(spotFor({ id: 'X', name: 'X', author: 'X', iso: null, num: null, latlng: [0, 0] }, { at: { x: 0.1, y: 0.2 } })).toEqual({ x: 0.1, y: 0.2 });
    const s = spotFor({ id: 'X', name: 'X', author: 'X', iso: null, num: null, latlng: [-22, 24] })!;
    expect(s.x).toBeGreaterThan(0); expect(s.y).toBeGreaterThan(0);
    expect(spotFor({ id: 'X', name: 'X', author: 'X', iso: null, num: null, latlng: null })).toBeNull();
  });
});
describe('nation-facts.json contract', () => {
  const ids = new Set(nations.map((n) => n.id));
  it('has a source line and a list', () => { expect(typeof facts.sourceLine).toBe('string'); expect(facts.sourceLine.length).toBeGreaterThan(0); expect(typeof facts.list).toBe('object'); });
  it('every entry is a nation we have, with well-formed fields', () => {
    for (const [id, f] of Object.entries<any>(facts.list)) {
      expect(ids.has(id), id).toBe(true);
      if (f.region !== undefined) expect(typeof f.region).toBe('string');
      if (f.capital !== undefined) expect(typeof f.capital).toBe('string');
      if (f.population !== undefined) { expect(Number.isFinite(f.population)).toBe(true); expect(f.population).toBeGreaterThan(0); }
      if (f.language !== undefined) { expect(typeof f.language).toBe('string'); expect(f.language.length).toBeGreaterThan(0); }
      if (f.at !== undefined) { expect(Math.abs(f.at.x)).toBeLessThanOrEqual(1); expect(Math.abs(f.at.y)).toBeLessThanOrEqual(1); }
    }
  });
});
