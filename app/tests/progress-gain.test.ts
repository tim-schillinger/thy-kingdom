import { describe, it, expect } from 'vitest';
import { progressGain, milestoneFar, plantStage, streaks } from '../src/engine/progress';
import { MORNING, EVENING } from '../src/engine/types';
// 3-5t: Progress moves only for what was gained since she last looked (1165). After a break nothing moves.
const now = (current: number, stage: number, tiles: number[]) => ({ current, stage, tiles });
describe('progressGain', () => {
  it('first visit with a streak counts everything up from zero', () => {
    const g = progressGain(undefined, now(5, 0, [3, 1, 12, 0]));
    expect(g).toMatchObject({ any: true, streak: true, stage: false, fromCurrent: 0, tileFrom: [0, 0, 0, null] });
  });
  it('nothing gained: nothing moves', () => {
    const g = progressGain(now(5, 0, [3, 1, 12, 0]), now(5, 0, [3, 1, 12, 0]));
    expect(g.any).toBe(false); expect(g.tileFrom).toEqual([null, null, null, null]);
  });
  it('one more day counts up from yesterday\'s number and only the grown counts tick', () => {
    const g = progressGain(now(22, 1, [10, 4, 50, 2]), now(23, 1, [11, 4, 51, 2]));
    expect(g).toMatchObject({ any: true, streak: true, fromCurrent: 22, tileFrom: [10, null, 50, null] });
  });
  it('a new stage grows the milestones from the old one', () => {
    const g = progressGain(now(29, 1, [0, 0, 0, 0]), now(30, 2, [0, 0, 0, 0]));
    expect(g).toMatchObject({ stage: true, fromStage: 1, streak: true });
  });
  it('after a break nothing moves, and the number shows today\'s', () => {
    const g = progressGain(now(30, 2, [9, 9, 9, 9]), now(1, 2, [9, 9, 9, 9]));
    expect(g).toMatchObject({ any: false, streak: false, fromCurrent: 1 });
  });
  it('a count that only fell (a removed prayer) is not a gain', () => {
    expect(progressGain(now(3, 0, [5, 0, 0, 0]), now(3, 0, [4, 0, 0, 0])).any).toBe(false);
  });
});
describe('progressGain: a join (3-5u, TKC-026 H)', () => {
  const at = (current: number, start: string | undefined, on?: string) => ({ current, stage: 0, tiles: [0, 0, 0, 0], start, on });
  it('one more day at the end is a gain but never a join', () => {
    const g = progressGain(at(5, '2026-11-10'), at(6, '2026-11-10'));
    expect(g).toMatchObject({ streak: true, join: false, fromCurrent: 5 });
  });
  it('a streak that now reaches back past where it began joined an older one', () => {
    const g = progressGain(at(5, '2026-11-10'), at(31, '2026-10-15'));
    expect(g).toMatchObject({ streak: true, join: true, fromCurrent: 5 });
  });
  it('no streak when she looked: open days that carry the last streak on to today are a join; one more day today is not', () => {
    expect(progressGain(at(0, undefined, '2026-10-26'), at(29, '2026-09-27', '2026-10-26')).join).toBe(true);
    expect(progressGain(at(0, undefined, '2026-10-26'), at(1, '2026-10-26', '2026-10-26')).join).toBe(false);
    expect(progressGain(at(5, '2026-11-10', '2026-11-14'), at(6, '2026-11-10', '2026-11-15')).join).toBe(false);   // looked at night, finished the next day
  });
  it('no streak seen, or what an older build stored (no start), never joins', () => {
    expect(progressGain(undefined, at(12, '2026-11-01')).join).toBe(false);
    expect(progressGain(at(0, undefined), at(12, '2026-11-01')).join).toBe(false);
    expect(progressGain({ current: 5, stage: 0, tiles: [0, 0, 0, 0] }, at(31, '2026-10-15')).join).toBe(false);
  });
  it('a join with nothing gained in the number (cannot happen) or a fall is not a join', () => {
    expect(progressGain(at(5, '2026-11-10'), at(5, '2026-10-15')).join).toBe(false);
  });
});
describe('streaks: the first day of the current streak (3-5u)', () => {
  const mk = (days: string[]) => ({ people: [], prayerMarks: [], answered: [], dayMarks: days.flatMap((d) => [...MORNING, ...EVENING].map((s) => ({ key: `${d}|${s}`, date: d, step: s, state: 'done' as const, at: 0 }))), sources: {}, weekPicks: [], bookPlaces: [], settings: {}, reminders: { firstDay: '2026-10-01' } }) as never;
  it('reports where the current run began, and moves it back when open days in between are finished', () => {
    const a = streaks(mk(['2026-10-10', '2026-10-11', '2026-10-14', '2026-10-15']), '2026-10-15');
    expect(a).toMatchObject({ current: 2, start: '2026-10-14' });
    const b = streaks(mk(['2026-10-10', '2026-10-11', '2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15']), '2026-10-15');
    expect(b).toMatchObject({ current: 6, start: '2026-10-10' });
  });
});
describe('milestoneFar (TKC-056 D)', () => {
  it('counts days to the next milestone never earned, on today\'s streak', () => {
    expect(milestoneFar(23, 30)).toBe('77 days to 100');   // Ray: 30 earned in his first streak, now on 23
    expect(milestoneFar(6, 6)).toBe('1 day to 7');
    expect(milestoneFar(1, 1)).toBe('6 days to 7');
  });
  it('no streak: Next: N days; all four earned: All four reached', () => {
    expect(milestoneFar(0, 0)).toBe('Next: 7 days'); expect(milestoneFar(0, 30)).toBe('Next: 100 days');
    expect(milestoneFar(400, 400)).toBe('All four reached'); expect(plantStage(400)).toBe(4);
  });
});
