// 3-6k (engineering frame 505 y): her data is kept by the phone. The app asks at every start until the browser agrees, quietly, at most once a day.
import { describe, expect, it } from 'vitest';
import { askToPersist } from '../src/data/db';

function fake(persisted: boolean, grant = true, throws = false) {
  const calls = { persist: 0, persisted: 0 };
  const store: Record<string, string> = {};
  return {
    calls, store,
    storage: { persisted: async () => { calls.persisted++; return persisted; }, persist: async () => { calls.persist++; if (throws) throw new Error('no'); return grant; } },
    memory: { getItem: (k: string) => store[k] ?? null, setItem: (k: string, v: string) => { store[k] = v; } },
  };
}

describe('askToPersist', () => {
  it('asks the browser to keep her data when it is not kept yet', async () => {
    const f = fake(false);
    expect(await askToPersist({ storage: f.storage, memory: f.memory, day: '2026-11-26' })).toBe(true);
    expect(f.calls.persist).toBe(1);
  });
  it('asks nothing when the data is already kept', async () => {
    const f = fake(true);
    expect(await askToPersist({ storage: f.storage, memory: f.memory, day: '2026-11-26' })).toBe(true);
    expect(f.calls.persist).toBe(0);
  });
  it('asks at most once a day when the browser says no, and again the next day', async () => {
    const f = fake(false, false);
    expect(await askToPersist({ storage: f.storage, memory: f.memory, day: '2026-11-26' })).toBe(false);
    expect(await askToPersist({ storage: f.storage, memory: f.memory, day: '2026-11-26' })).toBe(false);
    expect(f.calls.persist).toBe(1);
    await askToPersist({ storage: f.storage, memory: f.memory, day: '2026-11-27' });
    expect(f.calls.persist).toBe(2);
  });
  it('first run always asks, even on a day it already asked', async () => {
    const f = fake(false, false);
    await askToPersist({ storage: f.storage, memory: f.memory, day: '2026-11-26' });
    await askToPersist({ force: true, storage: f.storage, memory: f.memory, day: '2026-11-26' });
    expect(f.calls.persist).toBe(2);
  });
  it('is quiet when the browser has no such call, when it throws, or when memory is unavailable', async () => {
    expect(await askToPersist({ storage: {}, day: '2026-11-26' })).toBe(false);
    const t = fake(false, true, true);
    expect(await askToPersist({ storage: t.storage, memory: t.memory, day: '2026-11-26' })).toBe(false);
    const g = fake(false);
    expect(await askToPersist({ storage: g.storage, memory: { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } }, day: '2026-11-26' })).toBe(false);
  });
});
