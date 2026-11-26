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

type PersistApi = { persist?: () => Promise<boolean>; persisted?: () => Promise<boolean> };
type Memory = Pick<Storage, 'getItem' | 'setItem'>;
const ASKED = storageName('tkc.persist-asked');

/**
 * Ask the browser to keep her data (Data Ownership §C). Nothing shows.
 * 3-6k (engineering frame 505 y): asked at every start until the browser says yes, not only when she taps Start on first run.
 * Safari erases a site's data after 7 days without a visit unless the phone agrees to keep it, and a phone that said no on day one may say yes later
 * (once the app is on the Home Screen). Already kept: nothing is asked. Not kept: asked at most once a day on this device, so a browser that asks her
 * (Firefox) is not nagging; first run's Start always asks. A failure, or a browser with no such call, is quiet and returns false.
 */
export async function askToPersist(opts: { force?: boolean; storage?: PersistApi; day?: string; memory?: Memory } = {}): Promise<boolean> {
  try {
    const storage = opts.storage ?? (typeof navigator !== 'undefined' ? (navigator.storage as PersistApi | undefined) : undefined);
    if (!storage?.persist) return false;
    if (await storage.persisted?.()) return true;
    const day = opts.day ?? new Date().toISOString().slice(0, 10);
    const memory = opts.memory ?? (typeof localStorage !== 'undefined' ? localStorage : undefined);
    if (!opts.force && memory?.getItem(ASKED) === day) return false;
    try { memory?.setItem(ASKED, day); } catch { /* private mode: ask again next start, nothing lost */ }
    return !!(await storage.persist());
  } catch { return false; }
}
