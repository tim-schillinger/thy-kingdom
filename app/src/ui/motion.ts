// One motion utility (motion-lock §7, experience.md §0): every moving thing in the app calls this, so Reduce Motion is honored in one place
// and no screen hand-sets a duration or a curve. It reads the tokens from foundations.css, so the numbers live in one place.
// Build 3 (row 1c): the helpers below are what SheetHost, Toast, the page swap, the where-line, the win, removal and first open call.
import { useLayoutEffect, useRef } from 'preact/hooks';
import type { RefObject } from 'preact';
import { storageName } from '../data/channel';

export type MotionToken = 'quick' | 'short' | 'calm' | 'sheet' | 'win';
export type EaseToken = 'gentle' | 'exit' | 'settle' | 'sheet';

/** Reduce Motion is on: moves and zooms become short fades (motion-lock §4). Read at the moment of use, so a change in Settings applies at once. */
export const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
/** The test harness (the parity and coverage runs) photographs still pages, so motion is off there unless a walk turns it on: `__tkc.motion = 'on'`. */
export const motionOff = () => { const t = (window as unknown as { __tkc?: { motion?: string } }).__tkc; return !!t && t.motion !== 'on'; };
const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
/** A CSS time in milliseconds. The production build's minifier writes 300ms as ".3s", so the unit is read, never assumed (A24: every scripted move ran for 0.3 ms and the app looked flat). */
export const toMs = (v: string) => { const n = parseFloat(v) || 0; return /[\d.]s$/.test(v.trim()) ? n * 1000 : n; };
/** A duration token in milliseconds. */
export const ms = (t: MotionToken) => toMs(css(`--motion-${t}`));
/** A distance token in pixels (`page`: 48, `rise`: 16). */
export const px = (t: 'page' | 'rise') => parseFloat(css(`--move-${t}`)) || 0;
export const stagger = () => toMs(css('--stagger'));
const ease = (t: EaseToken) => css(`--ease-${t}`);

export interface PlayOptions { token: MotionToken; ease: EaseToken; delay?: number; fill?: FillMode }
/** Play a move. With Reduce Motion on, the same call is a 150 ms fade between the first and last opacity (never a blanket "off", so progress and focus still land). */
export function play(el: Element, frames: Keyframe[], o: PlayOptions): Animation | null {
  if (motionOff()) return null;
  if (reduced()) {
    const first = frames[0]?.opacity ?? 1, last = frames[frames.length - 1]?.opacity ?? 1;
    if (first === last) return null;
    return el.animate([{ opacity: first }, { opacity: last }], { duration: ms('quick'), delay: o.delay ?? 0, fill: o.fill ?? 'both' });
  }
  return el.animate(frames, { duration: ms(o.token), easing: ease(o.ease), delay: o.delay ?? 0, fill: o.fill ?? 'both' });
}
const done = (a: Animation | null, then: () => void) => { if (!a) { then(); return; } a.onfinish = then; a.oncancel = then; };

/** A part arrives: it rises `move-rise` (or `move-page`) and fades in; with Reduce Motion, one fade. */
export function arrive(el: Element, o: { from?: 'rise' | 'page' | 'left' | 'right'; token?: MotionToken; ease?: EaseToken; delay?: number } = {}) {
  const d = o.from === 'page' ? px('page') : px('rise');
  // The `translate` property, not `transform`, so a part that already has a transform (the old toast's centering) keeps it while it arrives.
  const from = o.from === 'left' ? `${-px('page')}px 0` : o.from === 'right' ? `${px('page')}px 0` : `0 ${d}px`;
  return play(el, [{ opacity: 0, translate: from }, { opacity: 1, translate: '0 0' }], { token: o.token ?? 'calm', ease: o.ease ?? 'gentle', delay: o.delay, fill: 'backwards' });
}

/** M15 (frame-lock-6 §4): a fold opens and closes. `wrap` is the grid wrapper (rows 0fr ↔ 1fr), `inner` its content.
 *  Open: the body grows from 0 and fades in (`motion-calm`, `ease-gentle`) while the content settles from 8 px above (`motion-calm`, `ease-settle`).
 *  Close: it shrinks and fades (`motion-short`, `ease-exit`). Reduce Motion: a 150 ms fade, no growth, no move (on close the wrapper is held open while it fades). */
export function foldMotion(wrap: HTMLElement, inner: HTMLElement, open: boolean) {
  if (motionOff()) return;
  wrap.getAnimations().forEach((a) => a.cancel()); inner.getAnimations().forEach((a) => a.cancel());
  if (reduced()) {
    inner.animate(open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { duration: ms('quick'), fill: 'both' }).onfinish = (e) => (e.target as Animation).cancel();
    if (!open) wrap.animate([{ gridTemplateRows: '1fr' }, { gridTemplateRows: '1fr' }], { duration: ms('quick') });
    return;
  }
  if (open) {
    wrap.animate([{ gridTemplateRows: '0fr', opacity: 0 }, { gridTemplateRows: '1fr', opacity: 1 }], { duration: ms('calm'), easing: ease('gentle') });
    inner.animate([{ translate: '0 -8px' }, { translate: '0 0' }], { duration: ms('calm'), easing: ease('settle') });
  } else wrap.animate([{ gridTemplateRows: '1fr', opacity: 1 }, { gridTemplateRows: '0fr', opacity: 0 }], { duration: ms('short'), easing: ease('exit') });
}

/** TKC-064 Tip (frame-lock-11 §4a): its room opens and closes with it. `wrap` is the grid wrapper (rows 0fr ↔ 1fr), `box` the tip. Resolves when the move is over.
 *  In: the room opens while the tip fades in and settles from 96% scale, from its arrow (`motion-short`, `ease-settle`). Out: it fades and the room closes (`motion-short`, `ease-exit`).
 *  Reduce Motion: the tip fades (`motion-quick`) and the room opens or closes at once. The wrapper clips its room only while it moves (`data-moving`). */
export function tipMotion(wrap: HTMLElement, box: HTMLElement, open: boolean): Promise<void> {
  if (motionOff()) return Promise.resolve();
  wrap.getAnimations().forEach((a) => a.cancel()); box.getAnimations().forEach((a) => a.cancel());
  wrap.dataset.moving = '';
  const end = (a: Animation) => a.finished.then(() => {}, () => {}).then(() => { delete wrap.dataset.moving; });
  if (reduced()) return end(box.animate(open ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 1 }, { opacity: 0 }], { duration: ms('quick'), fill: open ? 'backwards' : 'forwards' }));
  if (open) {
    wrap.animate([{ gridTemplateRows: '0fr' }, { gridTemplateRows: '1fr' }], { duration: ms('short'), easing: ease('settle'), fill: 'backwards' });
    return end(box.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: ms('short'), easing: ease('settle'), fill: 'backwards' }));
  }
  wrap.animate([{ gridTemplateRows: '1fr' }, { gridTemplateRows: '0fr' }], { duration: ms('short'), easing: ease('exit'), fill: 'forwards' });
  return end(box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms('short'), easing: ease('exit'), fill: 'forwards' }));
}

/** Leaving: a still copy of `el` stays where it was and goes (the real one is already gone). `how` moves the copy; `fixed` puts it over the viewport.
 *  Works for every way a sheet, toast or page can close with no change at the call site. The copy never takes a tap, a focus or a screen reader's attention. */
export function ghost(el: HTMLElement, how: (g: HTMLElement) => Animation | null, o: { fixed?: boolean } = {}) {
  if (motionOff() || !el.isConnected) return;
  place(el.cloneNode(true) as HTMLElement, how, o);
}
/** The same, for a copy taken earlier (a page is cloned while it is still on screen, then swapped). */
export function place(g: HTMLElement, how: (g: HTMLElement) => Animation | null, o: { fixed?: boolean } = {}) {
  g.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id')); g.removeAttribute('id');
  g.setAttribute('aria-hidden', 'true'); g.setAttribute('inert', ''); g.dataset.ghost = '';
  g.style.pointerEvents = 'none';
  let top: HTMLElement = g;
  if (o.fixed) { top = document.createElement('div'); top.dataset.ghost = ''; top.style.cssText = 'position:fixed;inset:0;overflow:hidden;z-index:60;pointer-events:none'; top.appendChild(g); }
  document.body.appendChild(top);
  done(how(o.fixed ? top : g), () => top.remove());
}

/** A sheet and its scrim (M7). In: the scrim fades `motion-calm`, the sheet rises with a settle (`motion-sheet`, `ease-sheet`), ✕ takes focus.
 *  Out: the sheet goes down `motion-short`, `ease-exit`, and the scrim fades with it. Reduce Motion: sheet and scrim fade, 150 ms. */
export function useSheetMotion(host: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = host.current; if (!el) return;
    const sheet = el.firstElementChild as HTMLElement | null;
    const scrim = getComputedStyle(el).backgroundColor, clear = 'rgba(0, 0, 0, 0)';
    if (reduced()) play(el, [{ opacity: 0 }, { opacity: 1 }], { token: 'calm', ease: 'gentle' });
    else {
      play(el, [{ backgroundColor: clear }, { backgroundColor: scrim }], { token: 'calm', ease: 'gentle', fill: 'backwards' });
      if (sheet) play(sheet, [{ transform: 'translateY(100%)' }, { transform: 'none' }], { token: 'sheet', ease: 'sheet', fill: 'backwards' });
    }
    el.querySelector<HTMLElement>('[data-part="close"]')?.focus({ preventScroll: true });   // ✕ takes focus on open (motion-lock M7); the confirm kind has none and keeps its primary
    return () => ghost(el, (g) => {
      if (reduced()) return play(g, [{ opacity: 1 }, { opacity: 0 }], { token: 'quick', ease: 'exit' });
      play(g, [{ backgroundColor: scrim }, { backgroundColor: clear }], { token: 'short', ease: 'exit' });
      return play(g.firstElementChild!, [{ transform: 'none' }, { transform: 'translateY(100%)' }], { token: 'short', ease: 'exit' });
    });
  }, []);
}

/** A toast (M8). In: it rises `move-rise` and fades in with a settle. Out: it fades `motion-short`, whether it timed out or she tapped Undo. */
export function useToastMotion(host: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = host.current; if (!el) return;
    arrive(el, { from: 'rise', token: 'calm', ease: 'settle' });
    return () => ghost(el, (g) => play(g, [{ opacity: 1 }, { opacity: 0 }], { token: 'short', ease: 'exit' }));
  }, []);
}

/** A removal (M9): the row slides `move-page` left and fades (`motion-short`), then the gap closes (`motion-short`). Resolves when it is gone, so the data can change then.
 *  Reduce Motion: it fades and the gap closes at once. */
export async function removeRow(el: HTMLElement): Promise<void> {
  if (motionOff()) return;
  const h = el.getBoundingClientRect().height;
  const out = reduced()
    ? play(el, [{ opacity: 1 }, { opacity: 0 }], { token: 'short', ease: 'exit', fill: 'forwards' })
    : play(el, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-px('page')}px)` }], { token: 'short', ease: 'exit', fill: 'forwards' });
  if (out) await out.finished.catch(() => {});
  if (reduced()) return;
  const gap = el.animate([{ height: `${h}px`, marginTop: getComputedStyle(el).marginTop, marginBottom: getComputedStyle(el).marginBottom, paddingTop: getComputedStyle(el).paddingTop, paddingBottom: getComputedStyle(el).paddingBottom },
    { height: '0px', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' }], { duration: ms('short'), easing: ease('exit'), fill: 'forwards' });
  el.style.overflow = 'hidden';
  await gap.finished.catch(() => {});
}
/** Undo (M9): the gap opens, then the row fades back. The row is already back in the list when this runs. */
export function restoreRow(el: HTMLElement) {
  if (motionOff()) return;
  if (reduced()) { play(el, [{ opacity: 0 }, { opacity: 1 }], { token: 'quick', ease: 'gentle' }); return; }
  const h = el.getBoundingClientRect().height;
  el.animate([{ height: '0px', opacity: 0 }, { height: `${h}px`, opacity: 0, offset: .5 }, { height: `${h}px`, opacity: 1 }], { duration: ms('short') * 2, easing: ease('gentle'), fill: 'backwards' });
}

/** First open (M12): the parts rise `move-rise` and fade in, `stagger` apart. First open of each day and first run only (603). */
export function firstOpen(parts: Element[]) {
  parts.forEach((p, k) => arrive(p, { from: 'rise', token: 'calm', ease: 'gentle', delay: k * stagger() }));
}
const OPENED_KEY = storageName('tkc.opened');
/** True once a day, per device, the first time Today shows (and on first run): a quiet convenience kept beside her data, never in it. */
export function isFirstOpenToday(date: string): boolean {
  if (motionOff()) return false;
  try { if (localStorage.getItem(OPENED_KEY) === date) return false; localStorage.setItem(OPENED_KEY, date); return true; } catch { return false; }
}

/** M3: the where-line's old words fade out (100 ms) and the new fade in (150 ms); with Reduce Motion, 75 ms each. Scaled with the tokens, so the 4× walk slows them too. */
export function crossfade() { const k = ms('quick') / 150; return reduced() ? { out: 75 * k, in: 75 * k } : { out: 100 * k, in: 150 * k }; }
/** M2: the segment's glow lasts 900 ms (three `motion-calm`). */
/** A number counts up from `from` to `to` (Progress, 1165: the streak's number from 500 ms over 700; each count from 1300, 150 apart, 500 each). It shows `from` at once, so the final number never flashes before it starts.
 *  Reduce Motion: the final number with a 150 ms fade. The words around it are the screen's; only this text node moves. */
export function countUp(el: HTMLElement, from: number, to: number, o: { delay: number; duration: number }) {
  if (motionOff() || from === to) return;
  const show = (n: number) => { el.textContent = Math.round(n).toLocaleString('en-US'); };
  if (reduced()) { show(to); el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms('quick'), delay: o.delay, fill: 'backwards' }); return; }
  show(from);
  const t0 = performance.now() + o.delay;
  const step = (now: number) => {
    if (!el.isConnected) return;
    const k = Math.min(1, Math.max(0, (now - t0) / o.duration));
    const eased = 1 - Math.pow(1 - k, 3);   // ease-out: it arrives gently
    show(from + (to - from) * eased);
    if (k < 1) requestAnimationFrame(step); else show(to);
  };
  requestAnimationFrame(step);
}
export const glowMs = () => ms('calm') * 3;

/* ===== Motion lock 2 (Nov 25, 2026; claude/design-system/motion-lock-2-steps-guide.md §2a): every page change is out before in. ===== */
/** M6's `out` (100 ms, two thirds of motion-quick): the old page is gone before the new one shows. It scales with the tokens, so a slowed walk slows it too. */
export const outMs = () => Math.round(ms('quick') * 2 / 3);
/** A copy or part fades out, with an optional small drop. Opacity drops early on the entering curve (it reads as gone before the next page starts);
 *  the move speeds away on the exit curve. With Reduce Motion: the fade only. */
export function fadeAway(el: Element, o: { dur?: number; drop?: number } = {}) {
  if (motionOff()) return null;
  const dur = o.dur ?? outMs();
  if (o.drop && !reduced()) el.animate([{ translate: '0 0' }, { translate: `0 ${o.drop}px` }], { duration: dur, easing: ease('exit'), fill: 'forwards' });
  return el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, easing: ease('gentle'), fill: 'forwards' });
}
export interface Captured { g: HTMLElement; top: number; left: number; w: number; clipTop: number; clipBottom: number; foot: string; footG?: HTMLElement; footR?: DOMRect }
/** Copy what she can see of the body, in viewport terms, before anything scrolls: clipped between the top bar and the action bar (`withTop`: the whole page above the foot). */
export function captureBody(root: Element | null, mainSel: string, footSel: string, withTop = false): Captured | null {
  if (!root) return null;
  const m = root.querySelector<HTMLElement>(mainSel); if (!m) return null;
  const tb = root.querySelector('[data-tkc="TKC-002"]'), ft = root.querySelector<HTMLElement>(footSel);
  const r = m.getBoundingClientRect();
  const clipTop = withTop || !tb ? 0 : Math.max(0, tb.getBoundingClientRect().bottom);
  const clipBottom = ft ? ft.getBoundingClientRect().top : innerHeight;
  if (withTop) {
    const g = document.createElement('div'); [...root.children].forEach((c) => { if (!c.matches(footSel)) g.appendChild(c.cloneNode(true)); }); g.className = (root as HTMLElement).className;
    return { g, top: 0, left: 0, w: innerWidth, clipTop, clipBottom, foot: ft?.innerText ?? '' };
  }
  const fr = ft?.firstElementChild as HTMLElement | null;
  return { g: m.cloneNode(true) as HTMLElement, top: r.top, left: r.left, w: r.width, clipTop, clipBottom, foot: ft?.innerText ?? '', footG: fr?.cloneNode(true) as HTMLElement | undefined, footR: fr?.getBoundingClientRect() };
}
const still = (g: HTMLElement) => { g.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id')); g.removeAttribute('id'); g.setAttribute('aria-hidden', 'true'); g.setAttribute('inert', ''); g.dataset.ghost = ''; g.style.pointerEvents = 'none'; };
/** The old body leaves the way she is going, in `outMs`, under the bars (never over the top bar or the action bar). */
export function leaveCopy(o: Captured, dir: number) {
  if (motionOff()) return;
  const wrap = document.createElement('div');
  wrap.style.cssText = `position:fixed;left:0;right:0;top:${o.clipTop}px;height:${Math.max(0, o.clipBottom - o.clipTop)}px;overflow:hidden;z-index:3;pointer-events:none`;
  o.g.style.cssText += `;position:absolute;left:${o.left}px;top:${o.top - o.clipTop}px;width:${o.w}px;margin:0`;
  still(o.g); wrap.appendChild(o.g); wrap.dataset.ghost = ''; document.body.appendChild(wrap);
  if (!reduced()) o.g.animate([{ translate: '0 0' }, { translate: `${-dir * px('page')}px 0` }], { duration: outMs(), easing: ease('exit'), fill: 'forwards' });
  const a = fadeAway(o.g);
  if (!a) wrap.remove(); else { a.onfinish = () => wrap.remove(); a.oncancel = () => wrap.remove(); }
}
/** A page's parts arrive in three beats, `stagger` apart: the first part (the heading or the card), the second, then the rest together (parts below the fold come with the last beat).
 *  Only opacity and translate move (composited, so they stay smooth on a phone). With Reduce Motion the parts fade in together. */
export function arriveParts(parts: Element[], from: 'left' | 'right' | 'page', delay: number) {
  const seen = parts.filter((c) => (c as HTMLElement).offsetParent !== null), beat = reduced() ? 0 : stagger();
  [seen.slice(0, 1), seen.slice(1, 2), seen.slice(2)].forEach((gr, k) => gr.forEach((p) => arrive(p, { from, delay: delay + k * beat })));
}
/** A body swap inside a page: the old body (copied before any scroll) leaves, the new one's parts settle in after it, and the foot's words fade out, then in. */
export function arriveBody(root: Element | null, mainSel: string, footSel: string, o: Captured | null, dir: number) {
  if (!root || motionOff()) return;
  const m = root.querySelector<HTMLElement>(mainSel); if (!m) return;
  if (o) leaveCopy(o, dir);
  const delay = outMs();
  arriveParts([...m.children], dir > 0 ? 'right' : 'left', delay);
  const ft = root.querySelector<HTMLElement>(footSel);
  if (ft && o && ft.innerText !== o.foot && o.footG && o.footR) {
    const g = o.footG, r = o.footR, bg = getComputedStyle(ft).backgroundColor;
    g.style.cssText += `;position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;margin:0;z-index:6;background:${bg}`;
    place(g, (c) => fadeAway(c));
    play(ft.firstElementChild ?? ft, [{ opacity: 0 }, { opacity: 1 }], { token: 'short', ease: 'gentle', delay, fill: 'backwards' });
  }
}
/** The same swap for a page that keeps its component (a lesson to the next lesson). The old body is copied during the render that changes the key. */
export function useBodySwap(key: string, index: number, rootSel: string, mainSel: string, footSel: string) {
  const was = useRef({ key, index }), old = useRef<Captured | null>(null);
  if (was.current.key !== key && !motionOff() && !old.current) old.current = captureBody(document.querySelector(rootSel), mainSel, footSel);
  useLayoutEffect(() => {
    const from = was.current; was.current = { key, index }; const o = old.current; old.current = null;
    if (from.key === key || motionOff()) return;
    arriveBody(document.querySelector(rootSel), mainSel, footSel, o, index >= from.index ? 1 : -1);
  }, [key]);
}
