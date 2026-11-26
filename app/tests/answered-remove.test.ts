// Remove on an answered record keeps the person off their list (3-4p; the store's own comment says "the person stays off her list").
// Data level: the engine's list filters and the backup page. The screen walk is tools/a20-walk.mjs's answered-remove check.
import { describe, it, expect } from 'vitest';
import { emptyHerData, type HerData } from '../src/engine/types';
import { poolFor, peopleTonight } from '../src/engine/plan';
import { answeredIds } from '../src/engine/people';
import { buildBackupHtml } from '../src/data/backup';

const person = { id: 'p1', list: 3, name: 'Marcus', request: 'work', added: '2026-10-01' };
const her = (removedRec: boolean | undefined): HerData => ({
  ...emptyHerData(),
  people: [person, { id: 'p2', list: 3, name: 'Dana', request: '', added: '2026-10-01' }],
  answered: [{ personId: 'p1', on: '2026-10-14', answer: 'He got the job.', list: 3, name: 'Marcus', request: 'work', ...(removedRec ? { removed: true } : {}) }],
});
const names = (h: HerData) => poolFor(h, '2026-10-20', 3).map((p) => p.name);

describe('Remove on an answered record', () => {
  it('an answered person is off the list, removed record or not', () => {
    expect([...answeredIds(her(false))]).toEqual(['p1']);
    expect([...answeredIds(her(true))]).toEqual(['p1']);
  });
  it('tonight\'s pool leaves out the person after Remove (not only after Mark Answered)', () => {
    expect(names(her(false))).toEqual(['Dana']);
    expect(names(her(true))).toEqual(['Dana']);
  });
  it('a person added tonight who was answered and removed does not join tonight', () => {
    const h = her(true); h.people[0].added = '2026-10-20';
    expect(peopleTonight(h, '2026-10-20', 3, 14).map((r) => r.person.name)).toEqual(['Dana']);
  });
  it('the backup page lists the person on neither the list nor Answered after Remove', () => {
    const html = buildBackupHtml(her(true), { cal: { contentVersion: 'x' } } as never, '2026-10-20');
    const page = html.split('<script')[0];   // the page she reads; the data block below it keeps the record for Undo
    expect(page).not.toContain('Marcus');
    expect(page).toContain('Dana');
  });
});
