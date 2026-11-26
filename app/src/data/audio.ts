// The hymn player's sound (3-5p, frame-lock-9; TKC-051 0.2). One audio element for the whole app, so only one hymn ever plays, it never starts by itself,
// and leaving the step stops it. The next 14 days' recordings are kept on the phone (Cache Storage, about 5 files, or up to 14 with Hymns With a Recording, frame-lock-13 §7, from this app's own host: no third party)
// so a morning with no connection still plays; a recording not yet kept streams from the same host while she is online. Offline and not kept: no player that morning (828).
import { useEffect, useState } from 'preact/hooks';
import { addDays, type CivilDate } from '../engine/dates';
import { hymnFor, trackFor } from '../engine/hymns';
import type { Content } from '../engine/types';

const base = import.meta.env.BASE_URL;
export const audioUrl = (file: string) => `${base}audio/${file}`;
const CACHE = 'tkc-hymn-audio-v1';

export type PlayStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended';
export interface PlayState { file: string | null; status: PlayStatus; time: number; duration: number; failed: boolean }
const IDLE: PlayState = { file: null, status: 'idle', time: 0, duration: 0, failed: false };
let state: PlayState = IDLE;
const subs = new Set<() => void>();
const set = (p: Partial<PlayState>) => { state = { ...state, ...p }; subs.forEach((f) => f()); };

let el: HTMLAudioElement | null = null, objectUrl: string | null = null, endTimer: ReturnType<typeof setTimeout> | undefined;
const free = () => { if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; } };
function audio(): HTMLAudioElement {
  if (el) return el;
  const a = new Audio(); a.preload = 'none'; el = a;
  a.addEventListener('timeupdate', () => { if (state.file) set({ time: a.currentTime }); });   // about four times a second: the top bar's ring follows it
  a.addEventListener('loadedmetadata', () => { if (state.file && Number.isFinite(a.duration) && a.duration > 0) set({ duration: a.duration }); });
  a.addEventListener('playing', () => { if (state.file) set({ status: 'playing' }); });
  a.addEventListener('waiting', () => { if (state.status === 'playing') set({ status: 'loading' }); });
  a.addEventListener('pause', () => { if (state.file && !a.ended && state.status !== 'idle') set({ status: 'paused' }); });
  a.addEventListener('ended', () => {
    if (!state.file) return;
    set({ status: 'ended', time: state.duration });   // the ring closes full for a moment, then the player is back at 0:00
    clearTimeout(endTimer); endTimer = setTimeout(() => { const f = state.file; a.currentTime = 0; set({ status: 'idle', time: 0 }); if (f !== state.file) return; }, 450);
  });
  a.addEventListener('error', () => { if (state.file) set({ failed: true, status: 'idle', time: 0 }); });
  return a;
}

async function kept(file: string): Promise<Blob | null> {
  try { if (!('caches' in self)) return null; const r = await (await caches.open(CACHE)).match(audioUrl(file)); return r ? await r.blob() : null; } catch { return null; }
}

/** Play this recording from 0:00, or from where it paused. `seconds` is the manifest length, shown until the file says its own. */
export async function playHymn(file: string, seconds: number) {
  const a = audio();
  if (state.file === file && (state.status === 'paused' || state.status === 'ended' || state.status === 'idle') && a.src) { clearTimeout(endTimer); try { await a.play(); } catch { set({ status: 'paused' }); } return; }
  stopHymn();
  set({ file, status: 'loading', time: 0, duration: seconds, failed: false });
  const blob = await kept(file);
  if (state.file !== file) return;                                 // she left the step while it was loading
  free(); if (blob) { objectUrl = URL.createObjectURL(blob); a.src = objectUrl; } else a.src = audioUrl(file);
  try { await a.play(); } catch (e) { if (state.file === file && (e as DOMException)?.name !== 'AbortError') set({ status: 'idle', failed: !blob && !navigator.onLine }); }
}
export function pauseHymn() { if (state.status === 'loading' && el && el.paused) { stopHymn(); return; } if (el && state.file) el.pause(); }   // a tap while it is still loading takes the start back
/** Leaving the step, or starting another: the sound stops and the player is back at 0:00. */
export function stopHymn() {
  clearTimeout(endTimer);
  if (el) { el.pause(); el.removeAttribute('src'); el.load(); }
  free(); state = IDLE; subs.forEach((f) => f());
}
/** The state of one recording's player: idle, at 0:00, for any recording that isn't the one playing. */
export function usePlayback(file: string | null): PlayState {
  const [, tick] = useState(0);
  useEffect(() => { const f = () => tick((n) => n + 1); subs.add(f); return () => { subs.delete(f); }; }, []);
  return file && state.file === file ? state : { ...IDLE };
}

/** Is there a way to play this one right now? Online: yes (it streams if it is not kept yet). Offline: only if it is kept (828). */
export function useAvailable(file: string | null): boolean {
  const [online, setOnline] = useState(() => navigator.onLine), [has, setHas] = useState<boolean | null>(null);
  useEffect(() => { const on = () => setOnline(true), off = () => setOnline(false); addEventListener('online', on); addEventListener('offline', off); return () => { removeEventListener('online', on); removeEventListener('offline', off); }; }, []);
  useEffect(() => { let live = true; setHas(null); if (file && !online) kept(file).then((b) => { if (live) setHas(!!b); }); return () => { live = false; }; }, [file, online]);
  return !!file && (online || has === true);
}

/** Keep the next 14 days' recordings on the phone and let go of the rest. Online only; asks the browser to keep what it stores. Never throws. */
let syncing = false;
export async function syncHymnAudio(c: Content, from: CivilDate, recorded = false, days = 14) {
  if (syncing || !('caches' in self)) return; syncing = true;
  try {
    const abs = (file: string) => new URL(audioUrl(file), location.href).href, want = new Set<string>();
    for (let d = 0; d < days; d++) { const t = trackFor(c, hymnFor(c, addDays(from, d), recorded)); if (t) want.add(abs(t.file)); }
    const cache = await caches.open(CACHE);
    for (const req of await cache.keys()) { if (!want.has(req.url)) await cache.delete(req); }
    try { await navigator.storage?.persist?.(); } catch { /* the browser may say no: files can still be kept, only less surely */ }
    if (!navigator.onLine) return;
    for (const url of want) { if (!(await cache.match(url))) { try { const r = await fetch(url); if (r.ok) await cache.put(url, r); } catch { /* the next open tries again */ } } }
  } catch { /* nothing to keep: she streams, or has no player offline */ } finally { syncing = false; }
}

/** Test builds only (__tkc.audioEl): the one audio element, so a walk can read the time or jump near the end without waiting a song. */
export const testAudioElement = () => el;
