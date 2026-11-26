// Walk Complete (registry §2, locked 865, States approved 890): TopBar (end) · WinMark small · heading · line · MutedDoneList (two columns) ·
// VerseCard "Take This Into Your Day" · ComingUp (one row). Foot (TKC-003 0.7, 573): a pinned "Back to Today"; ✕ does the same (F19: back to Open Days when catch-up started there).
// Layout only. The screen supplies the words and what each part does. Spacing from the Review's wd- rules (Walk Complete and Day Complete).
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { arrive, stagger } from '../motion';
import type { ComponentChildren } from 'preact';
import { TopBar, type TopBarProps } from '../TKC-002-TopBar/TopBar';
import { WinMark } from '../TKC-022-WinMark/WinMark';
import { MutedDoneList, type DoneItem } from '../TKC-045-MutedDoneList/MutedDoneList';
import { VerseCard, type VerseCardProps } from '../TKC-033-VerseCard/VerseCard';
import { ComingUp, type Moment } from '../TKC-027-ComingUp/ComingUp';
import { ActionBar, type ActionBarProps } from '../TKC-003-ActionBar/ActionBar';
import './screen.css';
import './walkcomplete.css';

export interface WalkCompleteViewProps {
  wash: 'dawn' | 'dusk';
  /** Which end screen this is (data-screen): the walk's, or the day's. */
  kind?: 'morning' | 'evening' | 'day';
  /** Day Complete: the large mark, and no burst when tracking is off (880). */
  mark?: { size: 'small' | 'large'; burst?: boolean };
  /** Day Complete: the streak badge under the line (TKC-026). */
  badge?: ComponentChildren;
  /** 'walks': the one centered row of two walks (Day Complete). */
  doneContent?: 'steps' | 'walks';
  /** Evening: one plain line about the morning, above the foot. */
  nudge?: string;
  foot?: ActionBarProps;
  bar: Omit<TopBarProps, 'scrolled' | 'reading' | 'current'>;
  heading: string; line: string;
  done: DoneItem[];
  verse?: VerseCardProps;
  comingUp?: Moment[];
  /** Note 7 (Nov 24, 3-6a): the Coming Up row's "About This Step ›" went nowhere here; it opens what it opens on Today. */
  onComingUpInfo?: (m: { title: string }) => void;
  overlay?: ComponentChildren;
}
export function WalkCompleteView(p: WalkCompleteViewProps) {
  // The hairline shows once she scrolls (Review: scrollTop > 4); the walk's name stays (the end variant).
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const on = () => setScrolled(scrollY > 4); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  // M10: the heading, the line and the verse card follow the mark, `stagger` apart (Reduce Motion: a short fade).
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { const q = (sel: string) => root.current?.querySelector(sel); [q('[data-part="heading"]'), q('[data-part="line"]'), q('[data-part="verse"]')].forEach((el, k) => { if (el) arrive(el, { from: 'rise', delay: (2 + k) * stagger() }); }); }, []);
  return <div ref={root} class="tkc-screen tkc-wc" data-wash={p.wash} data-screen={p.kind === 'day' ? 'daydone' : `walkdone:${p.kind ?? 'morning'}`}>
    <TopBar {...p.bar} scrolled={scrolled} />
    <main class="tkc-wc__main">
      <div class="tkc-wc__head" data-part="head"><WinMark size={p.mark?.size ?? 'small'} burst={p.mark?.burst ?? true} play /><h1 class="ty-display-l tkc-wc__h" data-part="heading">{p.heading}</h1><p class="ty-body tkc-wc__line" data-part="line">{p.line}</p>{p.badge && <div class="tkc-wc__badge" data-part="badge">{p.badge}</div>}</div>
      <div class="tkc-wc__done" data-part="done" data-content={p.doneContent ?? 'steps'}><MutedDoneList items={p.done} content={p.doneContent ?? 'steps'} /></div>
      {p.verse && <div class="tkc-wc__verse" data-part="verse" data-day={p.kind === 'day' ? '' : undefined}><VerseCard {...p.verse} /></div>}
      {p.nudge && <p class="tkc-wc__nudge" data-part="nudge">{p.nudge}</p>}
      {p.comingUp && p.comingUp.length > 0 && <div class="tkc-wc__cu" data-part="coming-up"><ComingUp rows={p.comingUp} onInfo={p.onComingUpInfo} /></div>}
      {!p.foot && <div class="tkc-wc__end" aria-hidden="true" />}
    </main>
    {p.foot && <ActionBar {...p.foot} />}
    {p.overlay}
  </div>;
}
