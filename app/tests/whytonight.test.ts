// The words of "Why [n] Tonight" and the one failed-reading message (3230, 3232–3238, 3236). Data level: the copy file only.
import { describe, it, expect } from 'vitest';
import { whyTonight, READING_FAILED } from '../src/copy';
const first = (list: number, d: number, pool: number, added: number) => whyTonight(list, d, pool, added).body.split(' Each night')[0];
describe('whyTonight', () => {
  it('one on the list', () => {
    expect(first(3, 14, 1, 0)).toContain('You have 1 leader, so you pray for them.');
    expect(first(6, 14, 1, 0)).toContain('You have 1 request, so you pray about it.');
  });
  it('someone added to a list that had people (3234, 3237)', () => {
    expect(first(3, 14, 5, 1)).toContain('You have 5 leaders, plus 1 you added tonight, so you pray for all 6.');
    expect(first(3, 14, 1, 1)).toContain('plus 1 you added tonight, so you pray for both.');
    expect(first(6, 14, 5, 1)).toContain('so you pray about all 6.');
  });
  it('an empty list with someone added keeps the noun and the date rule (3238)', () => {
    const t = whyTonight(3, 14, 0, 1).body;
    expect(t).toContain('You added 1 leader tonight, so you pray for them.');
    expect(t).toContain('Each night, the date sets the number');
    expect(t.startsWith('Tonight is the 14th, so you can pray for up to 14 people. You added 1 leader tonight, so you pray for them.')).toBe(true);   // 3250: the date sentence opens it
    expect(whyTonight(6, 14, 0, 1).body).toContain('You added 1 request tonight, so you pray about it.');
  });
  it('more people than the date keeps its approved shape (1817)', () => {
    expect(first(2, 3, 8, 1)).toContain('so you pray for 3 of your 8 neighbors, plus the 1 you added tonight.');
  });
  it('never "bring them" or "bring it" (3232, 3233)', () => {
    for (const a of [[6, 14, 1, 0], [6, 14, 0, 1], [6, 3, 8, 1], [6, 20, 3, 2]]) expect(whyTonight(...(a as [number, number, number, number])).body).not.toMatch(/so you bring/);
  });
});
describe('a reading that did not open', () => {
  it('is one message that says what happened, what may be wrong, and the way on', () => {
    expect(READING_FAILED).toBe('This reading didn’t open. The app’s copy of it may be missing or out of date. Try again to reload it, or skip this step for now.');
  });
});
