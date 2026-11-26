// TKC-045 MutedDoneList 0.2.1: everything just finished, quiet and gray, not tappable. Steps (two columns, filled top to bottom) or walks (one centered row).
// A skipped step shows the muted dash. When any name would wrap in its column the list drops to one column (walks: stacked). Layout is automatic unless `layout` is set.
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { StatusMark } from '../TKC-021-StatusMark/StatusMark';
import './muteddonelist.css';
export interface DoneItem { name: string; skipped?: boolean }
export interface MutedDoneListProps { items: DoneItem[]; content?: 'steps' | 'walks'; layout?: 'two' | 'one' | 'row' | 'stack' }
export function MutedDoneList({ items, content = 'steps', layout }: MutedDoneListProps) {
  const ul = useRef<HTMLUListElement>(null); const [auto, setAuto] = useState<'fit' | 'wrap'>('fit');
  useLayoutEffect(() => {
    if (layout || !ul.current) return; const el = ul.current;
    // Measure in the layout that could wrap (two columns, or the walks row), synchronously, then put the class back: resetting through state would flip-flop
    // (the one-column list never wraps, so the observer would send it straight back to two columns).
    const check = () => {
      const kept = el.className; el.className = `tkc-mdl is-${content === 'walks' ? 'row' : 'two'}`;
      const wraps = [...el.querySelectorAll<HTMLElement>('.tkc-mdl__nm')].some((n) => n.getBoundingClientRect().height > (parseFloat(getComputedStyle(n).lineHeight) || 24) * 1.5 || n.scrollWidth > n.clientWidth + 1);   // a wrapped name is taller than one line (the Review measures it the same way)
      const rowWraps = content === 'walks' && new Set([...el.children].map((li) => (li as HTMLElement).offsetTop)).size > 1;   // the walks row broke onto a second line
      el.className = kept; setAuto(wraps || rowWraps ? 'wrap' : 'fit');
    };
    check(); const ro = new ResizeObserver(check); ro.observe(el.parentElement ?? el); return () => ro.disconnect();
  }, [layout, items.length, content]);
  const lay = layout ?? (content === 'walks' ? (auto === 'wrap' ? 'stack' : 'row') : auto === 'wrap' ? 'one' : 'two');
  return <ul ref={ul} class={`tkc-mdl is-${lay}`} data-tkc="TKC-045" data-fit={content} aria-label="Done">
    {items.map((it) => <li key={it.name} data-part="item"><StatusMark mark={it.skipped ? 'skip' : 'done'} size={16} tone="muted" /><span class="tkc-mdl__nm" data-part="name">{it.name}</span><span class="tkc-mdl__sr">, {it.skipped ? 'skipped' : 'done'}</span></li>)}</ul>;
}
