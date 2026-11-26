import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { serviceDate, eveningLeads, addDays } from '../src/engine/dates';
import { planFor, peopleTonight } from '../src/engine/plan';
import { comingUp } from '../src/engine/comingup';
import { formatRefs } from '../src/engine/refs';
import { nextStop, streaks, openDays, skipDays, clearDays, markIndex, plantStage, streakIfFinished } from '../src/engine/progress';
import { emptyHerData, MORNING, EVENING, type Content, type HerData, type DayMark } from '../src/engine/types';

const load = (p: string) => JSON.parse(readFileSync(new URL(`../public/content/${p}`, import.meta.url), 'utf8'));
const content: Content = {
  cal: load('calendars.json'), classic: load('classic.json'), articles: load('articles.json'), books: load('books.json').order,
  nations: Object.fromEntries(load('nations.json').list.map((n: any) => [n.id, n])), facts: load('nation-facts.json').list, factsSource: load('nation-facts.json').sourceLine, medkey: load('meditation-key.json'), sheets: load('sheets.json'), hymns: load('hymns.json'), hymnStories: load('hymn-stories.json').stories, hymnAudio: load('hymn-audio.json'),
};
const her = (): HerData => { const h = emptyHerData(); h.reminders.firstDay = '2026-10-11'; return h; };
const finish = (h: HerData, d: string) => { for (const s of [...MORNING, ...EVENING]) h.dayMarks.push({ key: `${d}|${s}`, date: d, step: s, state: 'done', at: 0 }); };
const names = (ids: string[]) => ids.map((i) => content.nations[i].name);

describe('the day turns at 3 a.m. and the evening leads from her start time', () => {
  it('turns at 3', () => {
    expect(serviceDate(new Date(2026, 9, 15, 2, 59))).toBe('2026-10-14');
    expect(serviceDate(new Date(2026, 9, 15, 3, 0))).toBe('2026-10-15');
  });
  it('evening leads 6 pm to 3 am by default, and from her own time', () => {
    expect(eveningLeads(new Date(2026, 9, 14, 17, 59))).toBe(false);
    expect(eveningLeads(new Date(2026, 9, 14, 18, 0))).toBe(true);
    expect(eveningLeads(new Date(2026, 9, 15, 2, 30))).toBe(true);
    expect(eveningLeads(new Date(2026, 9, 15, 3, 0))).toBe(false);
    expect(eveningLeads(new Date(2026, 9, 14, 21, 0), '21:30')).toBe(false);
  });
});

describe('what a date holds', () => {
  it("Ray's Wed, Oct 14", () => {
    const p = planFor(content, her(), '2026-10-14');
    expect(formatRefs(content, p.day!.psalm)).toBe('Psalm 97');
    expect(p.proverbChapter).toBe(14);
    expect(formatRefs(content, p.day!.reading)).toBe('Luke 8, Matthew 13');
    expect(names(p.day!.nations)).toEqual(['Bulgaria', 'Burkina Faso']);
    expect(p.checkIns).toEqual(['burnt']);
    expect(p.list).toBe(3); // Wednesday: Leaders
    expect(p.prayerCount).toBe(14);
    expect(p.meditation).toMatchObject({ title: 'the words of Jesus', kind: 'words', question: 6, verse: { b: 'MAT', c: 9, v: 12, v2: 13 } }); // Oct 9–14, day 6
    expect(p.day!.study).toMatchObject({ count: 3 });
  });
  it('Sat, Oct 31: a song day, a month end and a Saturday', () => {
    const p = planFor(content, her(), '2026-10-31');
    expect(p.day!.song).toBe(true);
    expect(formatRefs(content, p.day!.psalm)).toBe('Isaiah 42:1–17');
    expect(p.checkIns).toEqual(['peace', 'grain', 'burnt']);
    expect(p.day!.study).toEqual({ article: true });
  });
  it("Joan's Thu, Dec 31: Fairness, Character, Relationships and All of Me, rarest first; Omega", () => {
    const p = planFor(content, her(), '2026-12-31');
    expect(formatRefs(content, p.day!.psalm)).toBe('Revelation 4:6–5:13'); // edit log fix (436)
    expect(p.checkIns).toEqual(['trespass', 'sin', 'peace', 'burnt']);
    expect(p.meditation).toMatchObject({ title: 'Omega · The Last', question: 'all', verse: { b: 'REV', c: 22, v: 13 } });
    expect(p.day!.nations).toEqual([]);
    expect(p.list).toBe(4); // Thursday: The Hurting
  });
  it('a name night and an attribute night take all six questions', () => {
    expect(planFor(content, her(), '2026-10-22').meditation).toMatchObject({ kind: 'name', title: 'Yahweh Tsidkenu · Lord Our Righteousness', question: 'all' });
    expect(planFor(content, her(), '2026-10-15').meditation).toMatchObject({ kind: 'attribute', title: 'Immense', verse: { b: '1KI', c: 8, v: 27 } });
    expect(planFor(content, her(), '2026-12-27').meditation).toMatchObject({ kind: 'works', title: 'God sets things right', question: 3, verse: { b: 'ISA', c: 2, v: 4 } });
  });
  it('Fri, Jan 1, 2027 opens with the song at the Red Sea', () => {
    expect(formatRefs(content, planFor(content, her(), '2027-01-01').day!.psalm)).toBe('Exodus 15:1–21');
  });
  it('Feb 29, 2028 loads as a bonus day (1363)', () => {
    const p = planFor(content, her(), '2028-02-29');
    expect(p.bonus).toBe(true);
    expect(p.day).toBeNull();
    expect(p.checkIns).toEqual(['peace', 'burnt']); // also a month's last day
  });
});

describe('streaks, Open Days, Skip and Clear', () => {
  it("Dale: walked Oct 11–18, back Mon Oct 26", () => {
    const h = her();
    for (let d = '2026-10-11'; d <= '2026-10-18'; d = addDays(d, 1)) finish(h, d);
    expect(streaks(h, '2026-10-26')).toEqual({ current: 0, longest: 8 });
    const open = openDays(h, '2026-10-26');
    expect(open.map((o) => o.date)).toEqual(['2026-10-25', '2026-10-24', '2026-10-23', '2026-10-22', '2026-10-21', '2026-10-20', '2026-10-19']);
    expect(open[0].left).toBe('Both walks');
    expect(streakIfFinished(h, '2026-10-26', open.map((o) => o.date))).toBe(15);
    h.dayMarks.push(...skipDays(h, open.map((o) => o.date), 1));
    expect(streaks(h, '2026-10-26').current).toBe(15);
    expect(openDays(h, '2026-10-26')).toEqual([]);
    expect(plantStage(15)).toBe(1);
  });
  it('Clear takes days off Open Days and leaves the streak as it was', () => {
    const h = her();
    finish(h, '2026-10-11');
    h.dayMarks.push(...clearDays(['2026-10-12', '2026-10-13'], 1));
    expect(openDays(h, '2026-10-14').map((o) => o.date)).toEqual([]);
    expect(streaks(h, '2026-10-14').current).toBe(0);
  });
  it('an unfinished today breaks nothing yet; a skip counts', () => {
    const h = her();
    finish(h, '2026-10-11'); finish(h, '2026-10-12');
    for (const s of MORNING) h.dayMarks.push({ key: `2026-10-13|${s}`, date: '2026-10-13', step: s, state: 'skipped', at: 0 });
    expect(streaks(h, '2026-10-13').current).toBe(2);
    for (const s of EVENING) h.dayMarks.push({ key: `2026-10-13|${s}`, date: '2026-10-13', step: s, state: 'done', at: 0 });
    expect(streaks(h, '2026-10-13').current).toBe(3);
  });
  it('Feb 29 never breaks a streak (1363)', () => {
    const h = emptyHerData(); h.reminders.firstDay = '2028-02-25';
    for (const d of ['2028-02-25', '2028-02-26', '2028-02-27', '2028-02-28', '2028-03-01']) finish(h, d);
    expect(streaks(h, '2028-03-01').current).toBe(5);
    expect(openDays(h, '2028-03-02')).toEqual([]);
  });
  it('the open-day line says what is left', () => {
    const h = her();
    for (const s of MORNING.slice(0, 3)) h.dayMarks.push({ key: `2026-10-11|${s}`, date: '2026-10-11', step: s, state: 'done', at: 0 });
    expect(openDays(h, '2026-10-12')[0].left).toBe('The rest of the Morning Walk, and the Evening Walk');
  });
});

describe('Coming Up (TKC-027, 724)', () => {
  const rows = (d: string, before = true) => comingUp(content, her(), d, before).map((r) => `${r.title} | ${r.when}`);
  it('an ordinary Wednesday morning shows only the Evening Walk', () => {
    expect(rows('2026-10-14')).toEqual(['Evening Walk | Tonight starting at 6 pm · Last hour of your day']);
  });
  it('Mon, Oct 26: the month end five days out', () => {
    expect(rows('2026-10-26')).toEqual(['Evening Walk | Tonight starting at 6 pm · Last hour of your day', 'Relationships | Sat, Oct 31 · Last hour of the month']);
  });
  it('Fri, Oct 30: rarest first on one date, then the song', () => {
    expect(rows('2026-10-30', false)).toEqual(['Relationships | Tomorrow · Last hour of the month', 'Giving | Tomorrow · Last hour of the week', 'Bible Song | Tomorrow · Isaiah 42:1–17']);
  });
  it('Sun, Dec 27: the year, the quarter and the month all land on Dec 31', () => {
    expect(rows('2026-12-27', false)).toEqual(['Fairness | Thu, Dec 31 · Last hour of the year', 'Character | Thu, Dec 31 · Last hour of the quarter', 'Relationships | Thu, Dec 31 · Last hour of the month']);
  });
  it("Joan's Dec 31 at night: tomorrow's Bible Song", () => {
    expect(rows('2026-12-31', false)).toEqual(['Bible Song | Tomorrow · Exodus 15:1–21']);
  });
  it('a short month offers Extra Proverbs until every extra is read', () => {
    expect(rows('2026-11-10', false)).toEqual(['Extra Proverbs | This month · 1 chapter']);
    const h = her();
    h.dayMarks.push({ key: '2026-11-10|am.proverb.extra', date: '2026-11-10', step: 'am.proverb.extra', state: 'done', at: 0 } as DayMark);
    expect(comingUp(content, h, '2026-11-11', false)).toEqual([]);
    expect(planFor(content, h, '2026-11-11').proverbChapter).toBe(12);
  });
});

describe('Prayer part 3: who comes up tonight', () => {
  it('up to the day of the month, by rotation, fixed for the night, the most recently prayed for to the back', () => {
    const h = her();
    for (let i = 0; i < 6; i++) h.people.push({ id: `p${i}`, list: 4, name: `P${i}`, request: '', added: '2026-10-01' });
    const a = peopleTonight(h, '2026-10-03', 4, 3).map((x) => x.person.id);
    expect(a).toHaveLength(3);
    expect(peopleTonight(h, '2026-10-03', 4, 3).map((x) => x.person.id)).toEqual(a);
    for (const id of a) h.prayerMarks.push({ id: `m${id}`, personId: id, date: '2026-10-03', asks: ['provide'] });
    const b = peopleTonight(h, '2026-10-04', 4, 3).map((x) => x.person.id);
    expect(b.filter((x) => a.includes(x))).toEqual([]);
  });
});

describe('nextStop (frame-lock-8 L1, L2)', () => {
  const idxOf = (done: string[], skipped: string[] = []) => markIndex([...done.map((s) => ({ key: `d|${s}`, date: 'd', step: s, state: 'done', at: 0 })), ...skipped.map((s) => ({ key: `d|${s}`, date: 'd', step: s, state: 'skipped', at: 0 }))] as DayMark[]);
  it('goes to the next step still open, skipping done and skipped ones', () => {
    expect(nextStop(EVENING, idxOf(['pm.classic'], ['pm.notes']), 'd', 0, false)).toEqual({ step: 3 });
  });
  it('with open steps only behind her, the end is the Still Open page', () => {
    expect(nextStop(EVENING, idxOf(EVENING.slice(1, 6)), 'd', 6, false)).toEqual({ end: 'still' });
  });
  it('with nothing else open, the end is Walk Complete', () => {
    expect(nextStop(EVENING, idxOf(EVENING.slice(1)), 'd', 0, false)).toEqual({ end: 'complete' });
  });
  it('a step opened from the list with none after it goes back to the list while others are open', () => {
    expect(nextStop(EVENING, idxOf(EVENING.filter((s) => s !== 'pm.turn' && s !== 'pm.checkin')), 'd', 6, false)).toEqual({ end: 'still' });
  });
  it('looking again at a step in a fully handled walk keeps the plain order', () => {
    expect(nextStop(EVENING, idxOf(EVENING), 'd', 2, true)).toEqual({ step: 3 });
    expect(nextStop(EVENING, idxOf(EVENING), 'd', 6, true)).toEqual({ end: 'complete' });
  });
  it('reading ahead (nothing marked) goes one step on', () => {
    expect(nextStop(EVENING, idxOf([]), 'd', 2, false)).toEqual({ step: 3 });
  });
});
