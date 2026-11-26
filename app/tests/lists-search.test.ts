// T21 (3-5s): Lists search (TKC-011 0.2; 1109, 1110, 1118) and sort (TKC-048 0.2; 1107, 402, 1116) at the data level.
// The screen walk is tools/lists-search-walk.mjs.
import { describe, it, expect } from 'vitest';
import { emptyHerData, type HerData, type Person } from '../src/engine/types';
import { peopleOn, sortPeople, orderOf, listPeople, searchLists, SORT_KEYS } from '../src/engine/people';

const P = (id: string, list: number, name: string, request: string, added: string, removed = false): Person => ({ id, list, name, request, added, ...(removed ? { removed: true } : {}) } as Person);
const base = (): HerData => ({
  ...emptyHerData(),
  people: [
    P('a', 3, 'Pastor James', 'Wisdom for our church', '2026-09-05'), P('b', 3, 'Mayor Lee', 'Wisdom for our city', '2026-09-12'), P('c', 3, 'Mrs. Ortiz', 'A good school year', '2026-09-20'),
    P('d', 0, 'Rosa', 'Her new job at the school', '2026-09-02'), P('e', 1, 'Mom', 'Her health', '2026-09-03'), P('f', 1, 'Jake', 'A good college choice', '2026-09-03'),
    P('g', 3, 'Gone', 'Wisdom lost', '2026-09-01', true), P('s1', 6, 'To trust You with the move', '', '2026-09-30'), P('s2', 6, 'Patience with my kids', '', '2026-10-02'),
    P('z', 2, 'Zed', 'Grandma’s garden', '2026-09-04'),
  ],
  answered: [
    { personId: 'x1', on: '2026-10-14', answer: 'It went well.', list: 2, name: 'Marta', request: 'Her hip surgery' },
    { personId: 'x2', on: '2026-09-28', answer: '', list: 6, name: 'A steady job', request: '' },
    { personId: 'x3', on: '2025-12-20', answer: '', list: 1, name: 'Marcus', request: 'A place to live' },
    { personId: 'x4', on: '2026-10-20', answer: '', list: 2, name: 'Hidden', request: 'Her job', removed: true },
  ],
});
const names = (ps: Person[]) => ps.map((p) => p.name);

describe('the order a list shows', () => {
  it('opens oldest first, ties in the order they were added, and leaves out removed people', () => {
    expect(names(peopleOn(base(), 3))).toEqual(['Pastor James', 'Mayor Lee', 'Mrs. Ortiz']);
    expect(names(peopleOn(base(), 1))).toEqual(['Mom', 'Jake']);
  });
  it('has four orders, each different on a list of three', () => {
    const l = peopleOn(base(), 3);
    expect(names(sortPeople(l, 'oldest'))).toEqual(['Pastor James', 'Mayor Lee', 'Mrs. Ortiz']);
    expect(names(sortPeople(l, 'newest'))).toEqual(['Mrs. Ortiz', 'Mayor Lee', 'Pastor James']);
    expect(names(sortPeople(l, 'az'))).toEqual(['Mayor Lee', 'Mrs. Ortiz', 'Pastor James']);
    expect(names(sortPeople(l, 'za'))).toEqual(['Pastor James', 'Mrs. Ortiz', 'Mayor Lee']);
    expect(SORT_KEYS).toEqual(['oldest', 'newest', 'az', 'za']);
  });
  it('Newest First puts the last one added at the top even when two were added the same day', () => {
    expect(names(sortPeople(peopleOn(base(), 1), 'newest'))).toEqual(['Jake', 'Mom']);
  });
  it('A–Z ignores case and accents of capitals, and sorts Your Requests by the request', () => {
    const h = base(); h.people.push(P('q', 3, 'adam', '', '2026-09-30'));
    expect(names(sortPeople(peopleOn(h, 3), 'az'))[0]).toBe('adam');
    expect(names(sortPeople(peopleOn(base(), 6), 'az'))).toEqual(['Patience with my kids', 'To trust You with the move']);
  });
  it('does not change the list it is given', () => {
    const l = peopleOn(base(), 3); const copy = [...l]; sortPeople(l, 'za'); expect(l).toEqual(copy);
  });
  it('each list remembers its own order, and a list nobody has sorted is oldest first', () => {
    const h = base(); h.reminders.sortByList = { 3: 'za' };
    expect(orderOf(h, 3)).toBe('za'); expect(orderOf(h, 1)).toBe('oldest'); expect(orderOf(h, 6)).toBe('oldest');
    expect(names(listPeople(h, 3))).toEqual(['Pastor James', 'Mrs. Ortiz', 'Mayor Lee']);
    expect(names(listPeople(h, 1))).toEqual(['Mom', 'Jake']);
  });
  it('an order it does not know falls back to oldest first (a restored backup from elsewhere)', () => {
    const h = base(); h.reminders.sortByList = { 3: 'sideways' };
    expect(orderOf(h, 3)).toBe('oldest');
  });
});

describe('Lists search', () => {
  it('finds any part of a name or a request, ignoring case', () => {
    const r = searchLists(base(), 'WISDOM');
    expect(names(r.people)).toEqual(['Pastor James', 'Mayor Lee']);
    expect(searchLists(base(), 'osa').people.map((p) => p.name)).toEqual(['Rosa']);
  });
  it('shows those she is praying for first, in the Lists order (Sunday to Saturday), then answered prayers newest first', () => {
    const r = searchLists(base(), 'job');
    expect(names(r.people)).toEqual(['Rosa']);
    expect(r.answered.map((a) => a.name)).toEqual(['A steady job']);
    const both = searchLists(base(), 'a');
    const lists = both.people.map((p) => p.list); expect(lists).toEqual([...lists].sort((a, b) => a - b));
    const days = both.answered.map((a) => a.on); expect(days).toEqual([...days].sort().reverse());
  });
  it('each list is in its own remembered order', () => {
    const h = base(); h.reminders.sortByList = { 3: 'az' };
    expect(names(searchLists(h, 'wisdom').people)).toEqual(['Mayor Lee', 'Pastor James']);
  });
  it('never shows a removed person or a removed answer', () => {
    expect(names(searchLists(base(), 'gone').people)).toEqual([]);
    expect(searchLists(base(), 'hidden').answered).toEqual([]);
    expect(searchLists(base(), 'her job').answered).toEqual([]);
  });
  it('a person who was answered shows once, as an answer, not as someone she is praying for', () => {
    const h = base(); h.people.push(P('x1', 2, 'Marta', 'Her hip surgery', '2026-09-01'));
    const r = searchLists(h, 'marta'); expect(r.people).toEqual([]); expect(r.answered.map((a) => a.name)).toEqual(['Marta']);
  });
  it('finds Saturday requests by their words, since the request is the name there', () => {
    const r = searchLists(base(), 'move');
    expect(r.people.map((p) => p.list)).toEqual([6]);
  });
  it('treats a curly apostrophe and a straight one the same', () => {
    expect(names(searchLists(base(), "grandma's").people)).toEqual(['Zed']);
    expect(names(searchLists(base(), 'grandma’s').people)).toEqual(['Zed']);
  });
  it('ignores the spaces at the ends, and finds nothing for nothing', () => {
    expect(names(searchLists(base(), '  rosa ').people)).toEqual(['Rosa']);
    expect(searchLists(base(), '   ')).toEqual({ people: [], answered: [] });
    expect(searchLists(base(), '')).toEqual({ people: [], answered: [] });
  });
  it('finds no match for a word nobody has (the screen says so in her own words)', () => {
    const r = searchLists(base(), 'Grandma'); expect(names(r.people)).toEqual(['Zed']);
    expect(searchLists(base(), 'Grandpa')).toEqual({ people: [], answered: [] });
  });
});
