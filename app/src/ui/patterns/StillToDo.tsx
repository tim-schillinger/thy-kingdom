// Still Open (registry §2, esph h5 to h8, locked 895 to 911): TopBar (end) · heading (the goal) · TKC-015 numbered step rows · TKC-045 MutedDoneList (the steps already handled) · pinned two-button foot.
// Layout only. The screen supplies the words and what each part does. Spacing from the Review's es- rules.
import { useEffect, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { TopBar, type TopBarProps } from '../TKC-002-TopBar/TopBar';
import { ListRow } from '../TKC-015-ListRow/ListRow';
import { MutedDoneList, type DoneItem } from '../TKC-045-MutedDoneList/MutedDoneList';
import { ActionBar, type ActionBarProps } from '../TKC-003-ActionBar/ActionBar';
import './screen.css';
import './stilltodo.css';

export interface StillRow { n: number; name: string; onClick: () => void }
export interface StillToDoViewProps {
  wash: 'dawn' | 'dusk';
  kind: 'morning' | 'evening';
  bar: Omit<TopBarProps, 'scrolled' | 'reading' | 'current'>;
  heading: string;
  rows: StillRow[];
  done: DoneItem[];
  foot: ActionBarProps;
  overlay?: ComponentChildren;
}
export function StillToDoView(p: StillToDoViewProps) {
  // The bar's hairline shows once she scrolls (Review: scrollTop > 4).
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const on = () => setScrolled(scrollY > 4); on(); addEventListener('scroll', on, { passive: true }); return () => removeEventListener('scroll', on); }, []);
  return <div class="tkc-screen tkc-std" data-wash={p.wash} data-screen={`still:${p.kind}`}>
    <TopBar {...p.bar} scrolled={scrolled} />
    <main class="tkc-std__main">
      <div class="tkc-std__head" data-part="head"><h1 class="ty-display-m tkc-std__h" data-part="heading">{p.heading}</h1></div>
      <ul class="tkc-std__list" aria-label="Still Open" data-part="rows">{p.rows.map((r) => <li key={r.n}><ListRow kind="step" n={r.n} name={r.name} onClick={r.onClick} /></li>)}</ul>
      {p.done.length > 0 && <div class="tkc-std__done" data-part="done"><MutedDoneList items={p.done} /></div>}
      <div class="tkc-std__end" aria-hidden="true" />
    </main>
    <ActionBar {...p.foot} />
    {p.overlay}
  </div>;
}
