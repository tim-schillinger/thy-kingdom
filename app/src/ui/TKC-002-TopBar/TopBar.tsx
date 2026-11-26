// TKC-002 TopBar, spec 0.17 (frame-lock-12 §4, §6, 3426, 3428: `guide` is a lesson's bar: the walk's bar with no states and no book, its ✕ named for where it goes; a step with no reference keeps its name when she scrolls), 0.16 (3-5z, frame-lock-11: the first-time tip, TKC-064, sits under the right slot in the bar's flow and describes the book button while it shows), 0.15 (3-5p, frame-lock-9 2a: while a hymn plays and the player has scrolled under the bar, the right slot shows its pause or play button with the song's progress as a ring, in the book button's place), 0.12 (C1: the book button in the step variant's right slot, "About This Step"), 0.11 (641: the caret shows beside the reference once scrolled), 0.10 (the step's name and a caret, the revisited-step menu, the new segment colors with ring-active, 8 px apart); 0.9: the step and end variants (the walk's bar), the page variant (0.6, 0.7: ‹ and the parent's name, ⋯ on the answered record)
// and the run variant (0.9: ✕ and a centered where-line, no path). The where-line and the path are one button (0.8). Count words live only in the accessible name (759).
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { crossfade, glowMs, motionOff, reduced } from '../motion';
import { Icon } from '../icon';
import { StatusMark } from '../TKC-021-StatusMark/StatusMark';
import { Tip, type TipProps } from '../TKC-064-Tip/Tip';
import './topbar.css';

const TIP_ID = 'tkc-tip-text';
export type Seg = 'done' | 'skip' | 'open';
export interface TopBarProps {
  /** 'page': ‹ and the parent's name. 'run': ✕ and a centered where-line, no path. Leave out for the walk's bar. */
  variant?: 'page' | 'run';
  /** Page: the parent's plain name ("Prayer"). Run: the where-line ("1 of 5"). */
  label?: string;
  /** Page, on the answered record only: ⋯ at the right (0.7). */
  more?: boolean;
  /** Page, with more: opens the record's menu. */
  onMore?: () => void;
  walk?: 'Morning Walk' | 'Evening Walk';
  /** 0.10 (569): the step's name for the where-line, with any counter or name after it ("Meditate · Question 1 of 6"). Replaces the walk's name on a step screen. */
  step?: string;
  /** 0.10: a revisited step says where it stands in the where-line; only skipped and done (S2). Its tap opens the menu. */
  state?: 'done' | 'skipped';
  onUndo?: () => void;
  /** Seven segments, the walk's steps in order. */
  steps?: Seg[];
  /** The step being viewed (0-6). Leave out for the end variant (Walk Complete, Day Complete, Still Open). */
  current?: number;
  /** "Mon, Oct 5" on a past or future day (422). */
  day?: string;
  /** Scrolled: the step's reference shows, the hairline appears (763). */
  scrolled?: boolean;
  reference?: string;
  /** 0-100 when the reading is longer than one screen (762); leave out otherwise. */
  reading?: number;
  /** Library and tests only. */
  show?: 'menu' | 'x-pressed' | 'x-focus' | 'about-pressed' | 'about-focus' | 'mid-pressed' | 'mid-focus' | 'back-pressed' | 'back-focus' | 'more-pressed' | 'more-focus';
  onClose?: () => void;
  onSteps?: () => void;
  /** 0.12 (frame-lock-7 part 2, C1): a step's one place to learn about it: a round book button in the right-hand slot, mirroring the ✕. Left out where the step's page is not built (and on the end variant). */
  onAbout?: () => void;
  /** 0.15 (frame-lock-9 §2a): the hymn's pause or play button, drawn in the right slot in place of the book. The screen passes it only while a hymn is playing or paused AND the player is scrolled out of sight; the ring is the song's progress, 0 to 1. */
  /** 0.16 (frame-lock-11): the first-time tip under the book button: the screen says when it is open and what its ✕ does. Left out where there is no book. */
  tip?: Omit<TipProps, 'id'>;
  /** 0.17 (frame-lock-12 §4): a Guide lesson's bar: the walk's name over the seven marks, the lesson ringed, no states, no book; `closeLabel` names where ✕ goes. */
  guide?: { closeLabel: string };
  listen?: { playing: boolean; progress: number; /** "1:11", for a screen reader when paused */ time: string; onToggle: () => void };
}

export function TopBar({ variant, label, more, onMore, walk = 'Morning Walk', step, state, onUndo, steps = [], current, day, scrolled, reference, reading, show, onClose, onSteps, onAbout, listen, tip, guide }: TopBarProps) {
  const [menu, setMenu] = useState(show === 'menu');
  const mid = useRef<HTMLButtonElement>(null);
  // M3 (the where-line changes: "Psalm" becomes "Psalm · ✓ Done"): the old words fade out and the new fade in. The old are drawn once more in this render, before the change reaches the screen.
  const w1 = useRef<HTMLSpanElement>(null), oldW1 = useRef<HTMLSpanElement>(null), seen = useRef({ state, step, steps });
  const fade = useRef<{ state?: 'done' | 'skipped' } | null>(null), [, tick] = useState(0);
  if (seen.current.state !== state && seen.current.step === step && !motionOff()) fade.current = { state: seen.current.state };
  // M2 (a step marked done): that segment glows once, larger than the old 765 glow (900 ms, scale 1.25 to 1.5); with Reduce Motion, off.
  const fresh = steps.map((x, k) => x === 'done' && !!seen.current.steps[k] && seen.current.steps[k] !== 'done' && !reduced() && !motionOff());
  const until = useRef<number[]>([]);
  fresh.forEach((on, k) => { if (on) until.current[k] = Date.now() + glowMs() + 50; });
  const glow = steps.map((_, k) => (until.current[k] ?? 0) > Date.now());
  const gl = useRef<Array<HTMLElement | null>>([]);
  useLayoutEffect(() => {
    if (fade.current) { const d = crossfade(); w1.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: d.in }); const o = oldW1.current; o?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: d.out, fill: 'forwards' }); setTimeout(() => { fade.current = null; tick((n) => n + 1); }, d.out); }
    if (fresh.some(Boolean)) setTimeout(() => tick((n) => n + 1), glowMs() + 60);
    fresh.forEach((on, k) => { if (on) gl.current[k]?.animate([{ opacity: 0, transform: 'scale(1.25)' }, { opacity: .85, transform: 'scale(1.4)', offset: .35 }, { opacity: 0, transform: 'scale(1.5)' }], { duration: glowMs(), easing: 'ease-out' }); });
    seen.current = { state, step, steps };
  });
  useEffect(() => {
    if (!menu || show === 'menu') return;
    const out = (e: Event) => { if (!(e.target as HTMLElement).closest?.('[data-part="menu"], [data-part="mid"]')) setMenu(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenu(false); mid.current?.focus(); } };
    addEventListener('pointerdown', out); addEventListener('keydown', esc);
    return () => { removeEventListener('pointerdown', out); removeEventListener('keydown', esc); };
  }, [menu]);
  if (variant === 'page') return (
    <header class={`tkc-pb${show ? ` is-${show}` : ''}`} data-tkc="TKC-002" data-variant="page" data-scrolled={scrolled ? '' : undefined} role="banner">
      <button type="button" class="tkc-pb__back" data-part="back" aria-label={`Back to ${label}`} onClick={onClose}><Icon n="caretLeft" size="calc(20px*var(--ts))" /><span data-part="label">{label}</span></button>
      {more ? <button type="button" class="tkc-pb__more" data-part="more" aria-label="More for this answered prayer" onClick={onMore}><Icon n="notePencil" size="22px" /></button> : null}
    </header>);
  if (variant === 'run') return (
    <header class={`tkc-tb${show ? ` is-${show}` : ''}`} data-tkc="TKC-002" data-variant="run" data-scrolled={scrolled ? '' : undefined} role="banner">
      <button type="button" class="tkc-tb__x" data-part="x" aria-label="Close" onClick={onClose}><Icon n="x" size="22px" /></button>
      <div class="tkc-tb__mid tkc-tb__mid--run" data-part="mid"><span class="tkc-tb__where ty-body-small" data-part="where"><span class="tkc-tb__w1" data-part="w1">{label}</span></span></div>
      <span aria-hidden="true" />
    </header>);
  const end = current == null;
  const stepName = step ?? walk;
  const lead = day ? `${day} · ` : '';
  // The last word and the caret stay together (no-break), so the caret never sits alone on a line. With a state, the state and the caret stay together instead, so a one-word name plus its state can wrap at 320 and 200% rather than run off the screen (Build 2 walk, Nov 8).
  const cut = stepName.lastIndexOf(' ');
  const head = cut > 0 ? stepName.slice(0, cut + 1) : '', tail = cut > 0 ? stepName.slice(cut + 1) : stepName;
  const caret = <span class="tkc-tb__car" data-part="caret" data-open={menu ? '' : undefined} aria-hidden="true"><Icon n="caretDown" size="calc(14px*var(--ts))" /></span>;
  const stateMarkOf = (st?: 'done' | 'skipped') => st ? <span class="tkc-tb__st" data-part="state"><StatusMark mark={st === 'done' ? 'done' : 'skip'} size={14} tone="muted" />{st === 'done' ? 'Done' : 'Skipped'}</span> : null;
  const lineOf = (st?: 'done' | 'skipped') => end ? where : st ? <>{lead}{head}{tail}<span aria-hidden="true"> · </span><span class="tkc-tb__nb">{stateMarkOf(st)}{caret}</span></> : <>{lead}{head}<span class="tkc-tb__nb">{tail}{caret}</span></>;
  const where = end ? (day ? `${day} · ${walk}` : walk) : null;
  const tap = () => { if (state && !end) setMenu(!menu); else onSteps?.(); };
  const undoLabel = state === 'skipped' ? 'Undo Skipped' : 'Undo Done';
  const done = steps.filter((s) => s === 'done').length, skipped = steps.filter((s) => s === 'skip').length;
  const name = guide && !end ? `${walk}, lesson ${current + 1} of 7. Open the lessons` : end
    ? (done + skipped === 7 ? `${walk}, ${skipped ? `${done} done, ${skipped} skipped` : 'all 7 steps done'}. Open the step list` : `${walk}, ${done} of 7 steps done. Open the step list`)
    : `${walk}, ${stepName}, step ${current + 1} of 7${state ? `, ${state === 'done' ? 'done' : 'skipped'}. Open the menu` : '. Open the step list'}`;
  return (
    <header class={`tkc-tb${show ? ` is-${show}` : ''}`} data-tkc="TKC-002" data-variant={end ? 'end' : 'step'} data-scrolled={scrolled ? '' : undefined} data-ref={reference ? '' : undefined} role="banner">
      <button type="button" class="tkc-tb__x" data-part="x" aria-label={guide ? guide.closeLabel : 'Close, back to Today'} onClick={onClose}><Icon n="x" size="22px" /></button>
      <button type="button" class="tkc-tb__mid" data-part="mid" ref={mid} aria-label={name} aria-haspopup={state && !end ? 'menu' : undefined} aria-expanded={state && !end ? menu : undefined} onClick={tap}>
        <span class="tkc-tb__where ty-body-small" data-part="where">
          <span class="tkc-tb__w1" data-part="w1" ref={w1}>{lineOf(state)}</span>
          {fade.current && <span class="tkc-tb__w1 is-old" aria-hidden="true" ref={oldW1}>{lineOf(fade.current.state)}</span>}
          {!end && <span class="tkc-tb__w2" data-part="w2" aria-hidden="true"><span class="tkc-tb__nb"><span class="tkc-tb__rf">{reference}</span><span class="tkc-tb__car" data-part="caret" data-open={menu ? '' : undefined}><Icon n="caretDown" size="calc(14px*var(--ts))" /></span></span></span>}
        </span>
        <span class="tkc-tb__pill" data-part="pill">
          {steps.map((s, i) => <span key={i} class="tkc-tb__sg" data-part="seg" data-seg={s} data-now={i === current ? '' : undefined}>{glow[i] && <i class="tkc-tb__gl" ref={(e) => { gl.current[i] = e; }} aria-hidden="true" />}</span>)}
        </span>
      </button>
      {listen && !end ? <button type="button" class="tkc-tb__x tkc-tb__listen" data-part="listen" data-playing={listen.playing ? '' : undefined} aria-label={listen.playing ? 'Pause the hymn' : `Paused at ${listen.time}. Play the hymn`} aria-pressed={listen.playing} onClick={listen.onToggle}>
        <svg class="tkc-tb__ring" data-part="ring" viewBox="0 0 44 44" aria-hidden="true"><circle class="tkc-tb__ring-b" cx="22" cy="22" r="20.5" /><circle class="tkc-tb__ring-p" cx="22" cy="22" r="20.5" pathLength="100" stroke-dasharray={`${Math.round(Math.min(1, Math.max(0, listen.progress)) * 1000) / 10} 100`} /></svg>
        <Icon n={listen.playing ? 'pauseFill' : 'playFill'} size="18px" /></button>
        : onAbout && !end ? <button type="button" class="tkc-tb__x tkc-tb__about" data-part="about" aria-label="About This Step" aria-describedby={tip?.open ? TIP_ID : undefined} onClick={onAbout}><Icon n="bookOpen" size="22px" /></button> : <span aria-hidden="true" />}
      {menu && state && !end && <div class="tkc-tb__menu" data-part="menu" role="menu">
        <button type="button" role="menuitem" class="tkc-tb__mi" data-part="undo" onClick={() => { setMenu(false); onUndo?.(); mid.current?.focus(); }}>{undoLabel}</button>
        <button type="button" role="menuitem" class="tkc-tb__mi" data-part="see-all" onClick={() => { setMenu(false); onSteps?.(); }}>See All 7 Steps</button>
      </div>}
      {tip && !end && <Tip id={TIP_ID} {...tip} />}
      {reading != null && <div class="tkc-tb__rl" data-part="rl" aria-hidden="true"><i style={{ width: `${reading}%` }} /></div>}
    </header>
  );
}
