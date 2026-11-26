// Her data on the phone: one IndexedDB database, nine stores, written on every tap (1362).
// The schema version is the backup's `format` number: one integer, raised only when the shape changes.
import { openDB, type IDBPDatabase } from 'idb';
import { emptyHerData, type HerData } from '../engine/types';
import { storageName } from './channel';

export const FORMAT = 1;
const DB = storageName('thy-kingdom');
const LIST_STORES = { people: 'id', prayerMarks: 'id', answered: 'personId', dayMarks: 'key', weekPicks: 'key', bookPlaces: 'book' } as const;
const ONE_STORES = ['sources', 'settings', 'reminders'] as const;
type ListStore = keyof typeof LIST_STORES;
type OneStore = (typeof ONE_STORES)[number];

let dbp: Promise<IDBPDatabase> | null = null;
function db() {
  dbp ??= openDB(DB, FORMAT, {
    upgrade(d, oldVersion) {
      // Every step from one format to the next is kept forever, so an older install always opens (1362).
      if (oldVersion < 1) {
        for (const [name, keyPath] of Object.entries(LIST_STORES)) d.createObjectStore(name, { keyPath });
        for (const name of ONE_STORES) d.createObjectStore(name);
      }
      // if (oldVersion < 2) { … the next format's step goes here … }
    },
  });
  return dbp;
}

export async function loadAll(): Promise<HerData> {
  const d = await db();
  const her = emptyHerData();
  for (const s of Object.keys(LIST_STORES) as ListStore[]) (her as any)[s] = await d.getAll(s);
  for (const s of ONE_STORES) { const v = await d.get(s, 'main'); if (v) (her as any)[s] = { ...(her as any)[s], ...v }; }
  her.weekPicks = her.weekPicks.map(({ key, ...rest }: any) => rest);
  return her;
}

export async function putRecord(store: ListStore, value: object) {
  const v = store === 'weekPicks' ? { ...value, key: `${(value as any).weekStart}|${(value as any).kind}` } : value;
  await (await db()).put(store, v);
}
export async function deleteRecord(store: ListStore, key: string) { await (await db()).delete(store, key); }
export async function putOne(store: OneStore, value: object) { await (await db()).put(store, value, 'main'); }

/** Restore replaces everything (1274), and Erase Everything clears it (1271). One transaction, all or nothing. */
export async function replaceAll(her: HerData | null) {
  const d = await db();
  const names = [...Object.keys(LIST_STORES), ...ONE_STORES];
  const tx = d.transaction(names, 'readwrite');
  for (const n of names) await tx.objectStore(n).clear();
  if (her) {
    for (const s of Object.keys(LIST_STORES) as ListStore[])
      for (const v of (her as any)[s]) await tx.objectStore(s).put(s === 'weekPicks' ? { ...v, key: `${v.weekStart}|${v.kind}` } : v);
    for (const s of ONE_STORES) await tx.objectStore(s).put((her as any)[s], 'main');
  }
  await tx.done;
}

/** Ask the browser to keep her data (Data Ownership §C). Nothing shows. */
export async function askToPersist() { try { return await navigator.storage?.persist?.(); } catch { return false; } }
