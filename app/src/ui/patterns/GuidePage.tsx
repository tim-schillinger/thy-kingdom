// The Guide's pages (pattern; Guide Studio v1.0, locked 1218): the home, a walk's step list, a step's page, Your Whole Year, and Start Here's runs.
// Layout only; every component is the library's. Screens hold no styling (build-standards §5.8), so every class lives here.
import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { TabBar, type Place } from '../TKC-001-TabBar/TabBar';
import { GrowthPlant } from '../TKC-055-GrowthPlant/GrowthPlant';
import { Icon } from '../icon';
import './guidepage.css';

/** frame-lock-12 §4 (3426 y): a Guide page's top bar is pinned as a step's is; the screen says when the page has scrolled, so the bar draws its hairline (TKC-002, 763). */
function usePinned() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => { root.current?.toggleAttribute('data-scrolled', scrollY > 4); };
    on(); addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  return root;
}
/** A page with the tab bar (Guide home, a walk's steps, a step's page, Your Whole Year). */
export function GuideShell({ view, top, onTab, children }: { view: string; top?: ComponentChildren; onTab: (p: Place) => void; children: ComponentChildren }) {
  const root = usePinned();
  return <div class="tkc-screen" data-screen="guide" data-view={view} ref={root}>{top}<main class="tkc-guide">{children}</main><TabBar current="Guide" onGo={onTab} /></div>;
}
/** A run (Start Here): ✕ and "2 of 5" on top, the page, and its foot; the tab bar hides, as in a walk. */
export function GuideRun({ view, top, foot, children }: { view: string; top: ComponentChildren; foot: ComponentChildren; children: ComponentChildren }) {
  const root = usePinned();
  return <div class="tkc-screen tkc-guide-run" data-screen="guide" data-view={view} ref={root}>{top}<main class="tkc-guide tkc-guide--run">{children}</main><div class="tkc-guide__foot" data-part="foot">{foot}</div></div>;
}
export const GuideTitle = ({ children }: { children: ComponentChildren }) => <h1 class="tkc-guide__title ty-display-l" data-part="title">{children}</h1>;
export const GuideLine = ({ children }: { children: ComponentChildren }) => <p class="tkc-guide__line ty-body" data-part="line">{children}</p>;
/** The small label over a run page's or a step page's title ("Start Here", "Morning Walk · Step 3"). */
export const GuideEyebrow = ({ children }: { children: ComponentChildren }) => <p class="tkc-guide__eyebrow ty-label" data-part="eyebrow">{children}</p>;
/** A group head on the home (Your Walks, Rhythms): named for what is in the rows under it. */
export const GuideHead = ({ children }: { children: ComponentChildren }) => <h2 class="tkc-guide__head" data-part="group-head">{children}</h2>;
/** The home's block: the rows under a head. */
export const GuideBlock = ({ children }: { children: ComponentChildren }) => <section class="tkc-guide__block" data-part="block">{children}</section>;
/** A titled part of a lesson: What You Do, Why It Matters, Tips, In the Bible. */
export const GuideSection = ({ head, children }: { head?: string; children: ComponentChildren }) => <section class="tkc-guide__sec" data-part="section">{head && <h2 class="tkc-guide__sech" data-part="section-head">{head}</h2>}{children}</section>;
export const GuideText = ({ children }: { children: ComponentChildren }) => <p class="tkc-guide__text ty-body" data-part="text">{children}</p>;
export const GuideTips = ({ items }: { items: string[] }) => <ul class="tkc-guide__tips" data-part="tips">{items.map((t) => <li key={t}>{t}</li>)}</ul>;
/** The verse and the line under it (a step's "In the Bible"). */
export const GuideVerseNote = ({ children, line }: { children: ComponentChildren; line: string }) => <div class="tkc-guide__vn" data-part="verse">{children}<p class="tkc-guide__vl ty-body-small" data-part="verse-line">{line}</p></div>;
/** A table of facts (Rhythms, Start Here page 4): a hairline above the first row. */
export const GuideFacts = ({ label, children }: { label: string; children: ComponentChildren }) => <div class="tkc-guide__facts" role="group" aria-label={label} data-part="facts">{children}</div>;
/** A section's own line under its head (Every Week). */
export const GuideSub = ({ children }: { children: ComponentChildren }) => <p class="tkc-guide__sub ty-body-small" data-part="sub">{children}</p>;
export const GuideNote = ({ children }: { children: ComponentChildren }) => <p class="tkc-guide__note ty-body-small" data-part="note">{children}</p>;
/** A page's rows in a list (guide and lesson rows): the hairlines are the rows' own. */
export const GuideRows = ({ label, children }: { label: string; children: ComponentChildren }) => <div class="tkc-guide__rows" role="group" aria-label={label} data-part="rows">{children}</div>;
/** Start Here page 1: the two walks as tiles (692's one exception: their words stay readable in both themes). */
export function WalkTiles({ tiles }: { tiles: Array<{ name: string; line: string }> }) {
  return <div class="tkc-guide__tiles" data-part="tiles">{tiles.map((t, k) => <div key={t.name} class="tkc-guide__tile" data-walk={k === 0 ? 'morning' : 'evening'} role="group" aria-label={`${t.name}. ${t.line}`}>
    <Icon n={k === 0 ? 'sun' : 'moonStars'} size="28px" /><b>{t.name}</b><span>{t.line}</span></div>)}</div>;
}
/** Start Here page 5: the five stages of the plant, in a row (the plant only grows, TKC-055). */
export function PlantRow() {
  return <div class="tkc-guide__plants" data-part="plants" role="img" aria-label="The plant grows through five stages, from a sprout to a tree bearing fruit">{([0, 1, 2, 3, 4] as const).map((s) => <GrowthPlant key={s} stage={s} size={40} />)}</div>;
}
/** The foot's row of buttons: Back quiet at the left, the main button beside it. */
export const GuideNav = ({ children }: { children: ComponentChildren }) => <div class="tkc-guide__nav" data-part="nav">{children}</div>;
