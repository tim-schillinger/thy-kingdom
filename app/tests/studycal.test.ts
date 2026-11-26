// The Study Bible calendar's chapter count (POC content check T6, Nov 17, 2026): the Author's calendar gives 3 or 4 chapters a day (or an article) and adds up to 1,190,
// one more than the Bible's 1,189 chapters. The app's running position walks Genesis 1 to Revelation 22 once; the only day that runs out is Dec 30, one chapter short.
import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

type Study = { article: true } | { count: number; from: [string, number] | null; to: [string, number] | null; short: number };
const cal = JSON.parse(readFileSync(new URL('../public/content/calendars.json', import.meta.url), 'utf8')).days as Record<string, { study: Study }>;
const days = Object.keys(cal).sort();
const counted = days.filter((d) => 'count' in cal[d].study).map((d) => [d, cal[d].study as Extract<Study, { count: number }>] as const);

describe('the Study Bible calendar and the 1,189 chapters (T6)', () => {
  it('has 365 days: 25 article nights and 340 reading days of 3 or 4 chapters', () => {
    expect(days).toHaveLength(365);
    expect(days.filter((d) => 'article' in cal[d].study)).toHaveLength(25);
    expect(counted).toHaveLength(340);
    expect(counted.filter(([, s]) => s.count === 3)).toHaveLength(170);
    expect(counted.filter(([, s]) => s.count === 4)).toHaveLength(170);
  });
  it('the article nights are the first and last day of every month, and Dec 25', () => {
    const len = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const want = new Set<string>(['12-25']);
    len.forEach((n, i) => { const m = String(i + 1).padStart(2, '0'); want.add(`${m}-01`); want.add(`${m}-${n}`); });
    expect(new Set(days.filter((d) => 'article' in cal[d].study))).toEqual(want);
  });
  it("the calendar's counts add up to 1,190, one more than the Bible", () => {
    expect(counted.reduce((n, [, s]) => n + s.count, 0)).toBe(1190);
  });
  it('the running position covers all 1,189 chapters once, Genesis 1 to Revelation 22, and only Dec 30 is short (by one)', () => {
    expect(counted.reduce((n, [, s]) => n + s.count - s.short, 0)).toBe(1189);
    expect(counted[0][1].from).toEqual(['GEN', 1]);
    expect(counted[counted.length - 1][0]).toBe('12-30');
    expect(counted[counted.length - 1][1].to).toEqual(['REV', 22]);
    expect(counted.filter(([, s]) => s.short > 0).map(([d, s]) => [d, s.short])).toEqual([['12-30', 1]]);
  });
});
