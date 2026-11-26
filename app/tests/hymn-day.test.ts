import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { hymnFor, writerLine, storyFor, isFirstSunday } from '../src/engine/hymns';
import type { Content } from '../src/engine/types';

const hymns = JSON.parse(readFileSync(new URL('../public/content/hymns.json', import.meta.url), 'utf8'));
const c = { hymns } as unknown as Content;
const d = (m: number, day: number, y = 2026) => `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}` as any;

describe('the hymn of the day (Build 7g)', () => {
  it('finds the day\'s hymn, leap day included', () => {
    expect(String(hymnFor(c, d(1, 1)).n)).toBe('1');
    expect(String(hymnFor(c, d(11, 14)).n)).toBe('69');
    expect(String(hymnFor(c, d(2, 29, 2028)).n)).toBe('92');
  });
  it('says translated by / about / name alone in plain words (115)', () => {
    expect(writerLine({ writer: 'tr. Catherine Winkworth', year: 1863 })).toBe('translated by Catherine Winkworth, 1863');
    expect(writerLine({ writer: 'X, tr. Y', year: 'c. 820' })).toBe('X, translated by Y, about 820');
    expect(writerLine({ writer: 'Jean-Baptiste Faure, tr.', year: null })).toBe('Jean-Baptiste Faure, tr.');
    expect(writerLine({ writer: 'A B', year: 1826 })).toBe('A B, 1826');
  });
  it('makes the first Sunday of each month the Doxology, and no other day (3163 a, 3164, 3165)', () => {
    const sundays = [d(1, 4), d(2, 1), d(3, 1), d(4, 5), d(5, 3), d(6, 7), d(7, 5), d(8, 2), d(9, 6), d(10, 4), d(11, 1), d(12, 6)];
    for (const day of sundays) { expect(isFirstSunday(day)).toBe(true); expect(hymnFor(c, day).title).toBe('Praise God, from Whom All Blessings Flow'); }
    for (const day of [d(11, 8), d(11, 2), d(11, 7), d(12, 5)]) { expect(isFirstSunday(day)).toBe(false); expect(hymnFor(c, day).title).not.toBe('Praise God, from Whom All Blessings Flow'); }
    const h = hymnFor(c, d(11, 1));
    expect(writerLine(h)).toBe('Thomas Ken, 1695');
    expect(h.stanzas).toHaveLength(1); expect(h.stanzas[0]).toHaveLength(4); expect(h.refrain).toEqual([]);
    const story = storyFor({ hymnStories: {} } as unknown as Content, h);
    expect(story).toHaveLength(554); expect(story.startsWith('Thomas Ken wrote these four lines')).toBe(true);
  });
});
