// TKC-041 NationRow 0.1: one of tonight's nations as a row: small map, name, "region · about N people", ›. The whole row opens the nation page.
// `NationList` is the plain list "Tonight's nations". The map stays top-aligned with the name once the name wraps (the `top` class, set from the text size).
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Icon } from '../icon';
import { LocatorMap, type LocatorMapProps } from '../TKC-042-LocatorMap/LocatorMap';
import './nationrow.css';
export interface NationRowProps { name: string; line: string; at?: LocatorMapProps['at']; top?: boolean; show?: 'pressed' | 'focus'; onOpen?: () => void }
export function NationRow({ name, line, at, top, show, onOpen }: NationRowProps) {
  // A name that wraps top-aligns the row (the map, the text and the chevron start together): measured from the text size, as the Review's script does.
  const nameEl = useRef<HTMLElement>(null);
  const [wraps, setWraps] = useState(false);
  useLayoutEffect(() => {
    const el = nameEl.current; if (!el) return;
    const fit = () => setWraps(el.getBoundingClientRect().height > (parseFloat(getComputedStyle(el).lineHeight) || 24) * 1.5);
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [name]);
  top = top ?? wraps;
  return <button type="button" class={`tkc-nr${top ? ' top' : ''}${show ? ` is-${show}` : ''}`} data-tkc="TKC-041" aria-label={`${line ? `${name}, ${line.replace(' · About', ', about')}` : name}. Open nation page`} onClick={onOpen}>
    <span aria-hidden="true" data-part="map"><LocatorMap size="small" at={at} /></span>
    <span class="tkc-nr__t" data-part="text"><b data-part="name" ref={nameEl}>{name}</b><span data-part="line">{line}</span></span>
    <span class="tkc-nr__cv" data-part="chevron" aria-hidden="true"><Icon n="caretRight" size="calc(18px*min(var(--ts), 1.5))" /></span></button>;
}
export function NationList({ rows }: { rows: NationRowProps[] }) {
  return <ul class="tkc-nl" aria-label="Tonight’s nations">{rows.map((r) => <li key={r.name}><NationRow {...r} /></li>)}</ul>;
}
