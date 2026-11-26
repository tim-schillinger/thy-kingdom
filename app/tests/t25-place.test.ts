// T25, the start-date model (3-6j; frame-t25-studio, 3488 A, 3489 y): the "where you are" line on the Bible Reading and the Classic's own place.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { classicNight, classicPlace, readingSeason, whereYouAre } from '../src/engine/plan';
import { WHERE_YOU_ARE } from '../src/copy';
import type { Content, HerData } from '../src/engine/types';

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const cal = read('../public/content/calendars.json');
const classic = read('../public/content/classic.json');
const c = { cal, classic } as unknown as Content;
const N = classic.readings.length;
let at = 1;
const mk = (date: string, step: string, state: 'done' | 'skipped', value?: number) => ({ key: `${date}|${step}`, date, step, state, at: at++, ...(value !== undefined ? { value } : {}) });
const her = (...marks: ReturnType<typeof mk>[]) => ({ dayMarks: marks }) as unknown as HerData;
const d = (md: string, y = 2026) => `${y}-${md}` as any;

describe('the where-you-are line: the season of the Bible\'s year', () => {
  const OT = new Set(['GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL']);
  const GOSPELS = new Set(['MAT', 'MRK', 'LUK', 'JHN']);
  it('matches the calendar: every reading from Jan 2 to Sep 30 is Old Testament, Oct 1 to Nov 15 the four books about Jesus, Nov 16 to Dec 27 Acts and the letters, Dec 28 to 31 Revelation', () => {
    for (const md of Object.keys(cal.days)) {
      const season = readingSeason(d(md));
      const books = (cal.days[md].reading as { b: string }[]).map((r) => r.b);
      if (md === '01-01') { expect(season).toBeNull(); continue; }
      if (!books.length) continue;
      for (const b of books) {
        if (season === 'ot') expect(OT.has(b), `${md} ${b}`).toBe(true);
        else if (season === 'jesus') expect(GOSPELS.has(b), `${md} ${b}`).toBe(true);
        else if (season === 'rev') expect(b, md).toBe('REV');
        else { expect(season, md).toBe('church'); expect(OT.has(b) || GOSPELS.has(b) || b === 'REV', `${md} ${b}`).toBe(false); }
      }
    }
  });
  it('has the four boundary days on the right side', () => {
    expect([readingSeason(d('01-02')), readingSeason(d('09-30')), readingSeason(d('10-01')), readingSeason(d('11-15')), readingSeason(d('11-16')), readingSeason(d('12-27')), readingSeason(d('12-28')), readingSeason(d('12-31'))])
      .toEqual(['ot', 'ot', 'jesus', 'jesus', 'church', 'church', 'rev', 'rev']);
  });
  it('has four lines with no semicolon, no "chronological" and no "one story"', () => {
    expect(Object.keys(WHERE_YOU_ARE).sort()).toEqual(['church', 'jesus', 'ot', 'rev']);
    for (const l of Object.values(WHERE_YOU_ARE)) { expect(l).not.toMatch(/;|chronolog|one story/i); expect(l).toMatch(/Jan 1/); }
  });
});

describe('when the line shows (3492 y)', () => {
  const day = (n: number) => mk(`2026-03-0${n}`, 'am.reading', 'done');
  it('shows to a new friend, on any day but Jan 1 and never on a day that has not come', () => {
    expect(whereYouAre(her(), d('03-10'), false)).toBe('ot');
    expect(whereYouAre(her(), d('01-01'), false)).toBeNull();
    expect(whereYouAre(her(), d('03-10'), true)).toBeNull();
  });
  it('stops after the Bible Reading is done on 3 days, and not before', () => {
    expect(whereYouAre(her(day(1), day(2)), d('03-10'), false)).toBe('ot');
    expect(whereYouAre(her(day(1), day(2), day(3)), d('03-10'), false)).toBeNull();
  });
  it('counts days, not marks, and ignores skips and other steps; time away never uses it up', () => {
    expect(whereYouAre(her(day(1), day(1), mk('2026-03-02', 'am.reading', 'skipped'), mk('2026-03-03', 'am.sing', 'done')), d('03-10'), false)).toBe('ot');
    expect(whereYouAre(her(day(1)), d('11-20'), false)).toBe('church');
  });
});

describe('the Classic keeps her own place (3489 y)', () => {
  it('opens a friend\'s first evening at the first reading, on any date', () => {
    expect(classicPlace(c, her(), d('03-10'))).toBe(0);
    expect(classicPlace(c, her(), d('11-20'))).toBe(0);
  });
  it('moves on by one when she marks it done, on any day, and a skip keeps her place', () => {
    expect(classicPlace(c, her(mk('2026-03-10', 'pm.classic', 'done', 0)), d('03-11'))).toBe(1);
    expect(classicPlace(c, her(mk('2026-03-10', 'pm.classic', 'skipped')), d('03-11'))).toBe(0);
    expect(classicPlace(c, her(mk('2026-03-10', 'pm.classic', 'done', 0), mk('2026-03-11', 'pm.classic', 'skipped')), d('03-12'))).toBe(1);
  });
  it('shows an open or skipped past evening her next reading, and a done day what she read', () => {
    const h = her(mk('2026-03-10', 'pm.classic', 'done', 0));
    expect(classicPlace(c, h, d('03-05'))).toBe(1);
    expect(classicPlace(c, h, d('03-10'))).toBe(0);
  });
  it('steps her back when she undoes her latest, and moves on again from the one she made last', () => {
    const a = mk('2026-03-10', 'pm.classic', 'done', 0), b = mk('2026-03-11', 'pm.classic', 'done', 1);
    expect(classicPlace(c, her(a, b), d('03-12'))).toBe(2);
    expect(classicPlace(c, her(a), d('03-11'))).toBe(1);
  });
  it('goes round again after the last reading', () => {
    expect(classicPlace(c, her(mk('2026-03-10', 'pm.classic', 'done', N - 1)), d('03-11'))).toBe(0);
  });
  it('reads a mark with no number (made before this build) as the date rule showed it', () => {
    const date = d('02-14'), shown = classicNight(c, date)!;
    expect(classicPlace(c, her(mk(date, 'pm.classic', 'done')), date)).toBe(shown);
    expect(classicPlace(c, her(mk(date, 'pm.classic', 'done')), d('02-15'))).toBe((shown + 1) % N);
  });
});
