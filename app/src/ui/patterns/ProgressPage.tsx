// Progress and Open Days (Hi-Fi Studio 7, locked Oct 25, 1168; built on the library in 3-5t): the pattern parts the two screens are made of, and the page's own motion.
// Layout and motion only; every component is the library's. The motion plays only for what was gained since she last looked (1165), and each part times itself as the lock says:
// the plant grows 0 to 700 ms and sways (TKC-055's own `is-play`), the streak's number counts up from 500 ms over 700, the track fills from 500 over 600, the next ring pulses at 1100
// (TKC-056's own `play`), and each gained count ticks from 1300, 150 apart, 500 each. Reduce Motion: 150 ms fades to the final values. On a join the number takes 1400 ms and the streak card plays its glow (500 to 2100 ms) and eight particles (from 600 ms, 30 ms apart; TKC-026 H, 3-5u).
import { useLayoutEffect } from 'preact/hooks';
import type { ComponentChildren, RefObject } from 'preact';
import { TabBar, type Place } from '../TKC-001-TabBar/TabBar';
import { countUp, motionOff } from '../motion';
import type { ProgressGain } from '../../engine/progress';
import './progresspage.css';

/** The page's frame: the top bar, one column, and the tab bar at the foot (or the SelectBar, in its place, while she chooses days). */
export function ProgressShell({ top, onTab, view, bar, rootRef, children }: { top: ComponentChildren; onTab: (p: Place) => void; view: 'progress' | 'opendays'; bar?: ComponentChildren; rootRef?: RefObject<HTMLDivElement | null>; children: ComponentChildren }) {
  return <div class="tkc-screen" data-screen={view} ref={rootRef}>{top}<main class="tkc-progress">{children}</main>{bar ?? <TabBar current="Today" onGo={onTab} />}</div>;
}
export const ProgressTitle = ({ children, action }: { children: ComponentChildren; action?: ComponentChildren }) =>
  <div class="tkc-progress__title" data-part="title-row"><h1 class="ty-display-l">{children}</h1>{action ? <span data-part="action">{action}</span> : null}</div>;
/** The closing verse (the page's one-off, `progress-verse`): the reading face, centered, the reference under it. */
export const ProgressVerse = ({ children, reference }: { children: ComponentChildren; reference: string }) =>
  <figure class="tkc-progress__verse" data-part="verse"><blockquote>{children}</blockquote><figcaption>{reference}</figcaption></figure>;
/** Open Days' join line (one-off: `progress-wash`, the plant at 32 px, then the words). */
export const ProgressJoin = ({ plant, children }: { plant: ComponentChildren; children: ComponentChildren }) =>
  <div class="tkc-progress__join" data-part="join">{plant}<span>{children}</span></div>;
export const ProgressLine = ({ children }: { children: ComponentChildren }) => <p class="tkc-progress__line ty-body" data-part="line">{children}</p>;
/** Skip All and Clear All, side by side. */
export const ProgressButtons = ({ children }: { children: ComponentChildren }) => <div class="tkc-progress__btns" data-part="buttons">{children}</div>;
export const ProgressMonth = ({ children }: { children: ComponentChildren }) => <h2 class="tkc-progress__month" data-part="month">{children}</h2>;
/** One open day's row, found by its date (tests and the walks read `data-day`). */
export const ProgressDay = ({ date, children }: { date: string; children: ComponentChildren }) => <div class="tkc-progress__day" data-day={date} data-part="day">{children}</div>;
export const ProgressSettled = ({ children }: { children: ComponentChildren }) => <div class="tkc-progress__settled" data-part="settled">{children}</div>;

/** Play Progress's gain motion on the parts inside `root`, once, when the page opens. `gain` is frozen at the page's first draw (the page records what she saw after it draws, which must not stop its own motion). */
export function useProgressMotion(root: RefObject<HTMLElement | null>, gain: ProgressGain, now: { current: number; tiles: number[] }) {
  useLayoutEffect(() => {
    const el = root.current; if (!el || !gain.any || motionOff()) return;
    if (gain.streak || gain.stage) el.querySelector('[data-tkc="TKC-055"]')?.classList.add('is-play');   // TKC-055's own class: grow, then sway (spec H)
    // 1400 ms instead of 700 when two streaks joined (TKC-026 H)
    if (gain.streak) { const n = el.querySelector<HTMLElement>('[data-tkc="TKC-026"] [data-part="number"]'); if (n) countUp(n, gain.fromCurrent, now.current, { delay: 500, duration: gain.join ? 1400 : 700 }); }
    const tiles = el.querySelectorAll<HTMLElement>('[data-tkc="TKC-050"] [data-part="number"]');
    gain.tileFrom.forEach((from, i) => { const t = tiles[i]; if (t && from !== null) countUp(t, from, now.tiles[i], { delay: 1300 + 150 * i, duration: 500 }); });
  }, []);
}
export type { Place };
