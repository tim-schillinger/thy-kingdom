// The app's state: her data in memory, mirrored to IndexedDB on every change (1362).
import { useEffect, useReducer } from 'preact/hooks';
import { emptyHerData, type Ask, type HerData, type DayMark, type Person, type Answered, type Settings, type Reminders } from '../engine/types';
import { loadAll, putRecord, deleteRecord, putOne, replaceAll } from './db';
import { now } from './clock';
import { serviceDate, type CivilDate } from '../engine/dates';

let her: HerData = emptyHerData();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
export const getHer = () => her;
export function useHer() { const [, f] = useReducer((x: number) => x + 1, 0); useEffect(() => { const g = () => f(null as never); subs.add(g); return () => { subs.delete(g); }; }, []); return her; }
export async function init() { her = await loadAll(); emit(); }
export const today = () => serviceDate(now());

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function setMark(date: CivilDate, step: string, state: DayMark['state'], value?: string | number) {
  const m: DayMark = { key: `${date}|${step}`, date, step, state, at: Date.now(), ...(value !== undefined ? { value } : {}) };
  her = { ...her, dayMarks: [...her.dayMarks.filter((x) => x.key !== m.key), m] };
  emit(); void putRecord('dayMarks', m);
}
export function addMarks(ms: DayMark[]) {
  const keys = new Set(ms.map((m) => m.key));
  her = { ...her, dayMarks: [...her.dayMarks.filter((x) => !keys.has(x.key)), ...ms] };
  emit(); ms.forEach((m) => void putRecord('dayMarks', m));
}
export function removeMarks(keys: string[]) {
  const k = new Set(keys);
  her = { ...her, dayMarks: her.dayMarks.filter((x) => !k.has(x.key)) };
  emit(); keys.forEach((key) => void deleteRecord('dayMarks', key));
}
export function setAsks(personId: string, date: CivilDate, asks: Ask[]) {
  const id = `${date}|${personId}`;
  const m = { id, personId, date, asks };
  her = { ...her, prayerMarks: [...her.prayerMarks.filter((x) => x.id !== id), m] };
  emit(); void putRecord('prayerMarks', m);
}
export function addPerson(p: Omit<Person, 'id'>) {
  const person = { ...p, id: uid() };
  her = { ...her, people: [...her.people, person] };
  emit(); void putRecord('people', person); return person;
}
/** Edit Person (360, 405): name, what to pray for, list. A move keeps the prayer count (the marks follow the person's id). */
export function updatePerson(id: string, patch: Partial<Pick<Person, 'name' | 'request' | 'list'>>) {
  const old = her.people.find((x) => x.id === id); if (!old) return;
  const person = { ...old, ...patch };
  her = { ...her, people: her.people.map((x) => (x.id === id ? person : x)) };
  emit(); void putRecord('people', person);
}
/** Remove has no confirm; Undo puts the person back (350). The record stays so Undo is whole. */
export function setRemoved(id: string, removed: boolean) {
  const old = her.people.find((x) => x.id === id); if (!old) return;
  const { removed: _r, ...rest } = old; const person: Person = removed ? { ...rest, removed: true } : rest;
  her = { ...her, people: her.people.map((x) => (x.id === id ? person : x)) };
  emit(); void putRecord('people', person);
}
/** Mark Answered (349): the person leaves her list and keeps a record with the list, name and request as they were. */
export function answerPerson(personId: string, on: CivilDate, answer: string) {
  const p = her.people.find((x) => x.id === personId); if (!p) return;
  const rec: Answered = { personId, on, answer, list: p.list, name: p.name, request: p.request };
  her = { ...her, answered: [...her.answered.filter((x) => x.personId !== personId), rec] };
  emit(); void putRecord('answered', rec);
}
/** Undo Answered puts the person back on their list with the count kept (1037). */
export function unAnswer(personId: string) {
  her = { ...her, answered: her.answered.filter((x) => x.personId !== personId) };
  emit(); void deleteRecord('answered', personId);
}
/** Edit Answer (record ⋯): the words and the day, saved back to the record; the person stays answered. */
export function editAnswer(personId: string, on: CivilDate, answer: string) {
  const old = her.answered.find((x) => x.personId === personId); if (!old) return;
  const rec: Answered = { ...old, on, answer };
  her = { ...her, answered: her.answered.map((x) => (x.personId === personId ? rec : x)) };
  emit(); void putRecord('answered', rec);
}
/** Remove on the record: the answer leaves Answered and the person stays off her list; Undo brings both back. */
export function setAnswerRemoved(personId: string, removed: boolean) {
  const old = her.answered.find((x) => x.personId === personId); if (!old) return;
  const { removed: _r, ...rest } = old; const rec: Answered = removed ? { ...rest, removed: true } : rest;
  her = { ...her, answered: her.answered.map((x) => (x.personId === personId ? rec : x)) };
  emit(); void putRecord('answered', rec);
}
/** Undo Answered's Undo: the record comes back as it was. */
export function restoreAnswer(rec: Answered) {
  her = { ...her, answered: [...her.answered.filter((x) => x.personId !== rec.personId), rec] };
  emit(); void putRecord('answered', rec);
}
export function setSettings(s: Partial<Settings>) { her = { ...her, settings: { ...her.settings, ...s } }; emit(); void putOne('settings', her.settings); }
export function setReminders(r: Partial<Reminders>) { her = { ...her, reminders: { ...her.reminders, ...r } }; emit(); void putOne('reminders', her.reminders); }
export function setSources(x: Partial<HerData['sources']>) { her = { ...her, sources: { ...her.sources, ...x } }; emit(); void putOne('sources', her.sources); }
export function setBible(bible: 'web' | 'kjv') { her = { ...her, sources: { ...her.sources, bible } }; emit(); void putOne('sources', her.sources); }
/** Restore replaces (1274); Erase Everything passes null (1271). */
export async function replaceHer(data: HerData | null) { await replaceAll(data); her = data ?? emptyHerData(); emit(); }
