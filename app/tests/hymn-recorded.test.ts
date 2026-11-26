// The year of hymns with a recording (3-6d, frame-lock-13 §4 A, §8): a fixed 366-day table built from hymns.json.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { hymnFor, recordedYear, trackFor, isFirstSunday } from '../src/engine/hymns';
import type { Content } from '../src/engine/types';

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const c = { hymns: read('../public/content/hymns.json'), hymnAudio: read('../public/content/hymn-audio.json') } as unknown as Content;
const table = recordedYear(c);
const calendar = c.hymns.days;
const MDS = Object.keys(calendar);
const d = (md: string, y = 2026) => `${y}-${md}` as any;

describe('the recorded year', () => {
  it('names a recorded hymn with a track on every one of the 366 dates', () => {
    expect(Object.keys(table).length).toBe(366);
    expect(Object.keys(table).sort()).toEqual([...MDS].sort());
    for (const md of MDS) {
      const h = c.hymns.hymns.find((x) => String(x.n) === table[md]);
      expect(h, `${md} names a hymn the file lacks`).toBeTruthy();
      expect(trackFor(c, h!), `${md} (hymn ${table[md]}) has no recording`).not.toBeNull();
    }
  });
  it('is the 27 recorded hymns in the hymnal\'s order, one a day from Jan 1, around again; Joy to the World is outside the turn and sings Dec 12 and Dec 25', () => {
    const order = c.hymns.hymns.filter((h) => h.recorded && String(h.n) !== '31').map((h) => String(h.n));
    expect(order.length).toBe(27);
    expect(table['01-01']).toBe(order[0]); expect(table['01-02']).toBe(order[1]); expect(table['01-28']).toBe(order[0]);
    expect(table['12-12']).toBe('31'); expect(table['12-25']).toBe('31');
    expect(MDS.filter((md) => table[md] === '31')).toEqual(['12-12', '12-25']);
    expect(table['02-29']).toBeTruthy();
  });
  it('never gives the same hymn on two days in a row, and never within 13 days (Joy to the World: 13 days apart)', () => {
    const seq = MDS; // calendar order
    for (let i = 0; i < seq.length; i++) for (let k = 1; k < 13; k++) { const j = i + k; if (j < seq.length) expect(table[seq[i]], `${seq[i]} and ${seq[j]}`).not.toBe(table[seq[j]]); }
    for (const x of Object.values(table)) expect(x).toBeTruthy();
  });
  it('matches the calendar on Jan 1, Jul 23, Nov 2 and Dec 12 only', () => {
    expect(MDS.filter((md) => String(table[md]) === String(calendar[md]))).toEqual(['01-01', '07-23', '11-02', '12-12']);
  });
  it('today, Nov 25: The Lord Is My Shepherd; the calendar\'s hymn has no recording', () => {
    expect(hymnFor(c, d('11-25'), true).title).toBe('The Lord Is My Shepherd');
    expect(trackFor(c, hymnFor(c, d('11-25')))).toBeNull();
  });
  it('first Sundays keep the Doxology, with its recording, in both years', () => {
    expect(isFirstSunday(d('11-01'))).toBe(true);
    for (const rec of [false, true]) { const h = hymnFor(c, d('11-01'), rec); expect(h.title).toBe('Praise God, from Whom All Blessings Flow'); expect(trackFor(c, h)?.file).toBe('1-20.mp3'); }
  });
  it('the calendar\'s own year is unchanged when she has not chosen recordings', () => {
    expect(String(hymnFor(c, d('01-01')).n)).toBe('1'); expect(String(hymnFor(c, d('11-14')).n)).toBe('69');
  });
});
