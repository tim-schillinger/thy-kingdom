// TKC-031 SourceLine 0.5 (frame-lock-12 §3, 3425 y: `onAbout` makes the first segment a link to the source's About sheet, underlined like "Change"; its name for screen readers is the sheet's title). 0.4: says where words come from. Plain segments (reference, hymn, writer, "My own hymnal"),
// then the translation link (Scripture only, with ▾), then "Change" (step screens only). Segments join with " · ".
import { useLayoutEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Icon } from '../icon';
import './sourceline.css';
export interface SourceLineProps {
  /** The plain segments before the links: ["Psalm 97"], ["Hymn 113", "Holy, Holy, Holy"], ["Facts from Wikidata"] */
  segments?: string[];
  /** One reference (same as segments with one item) */
  reference?: string;
  translation?: string; onTranslation?: () => void;
  /** Show "Change" at the end (step screens) */
  change?: boolean; onChange?: () => void;
  /** The first segment is a link that opens the source's About sheet (a hymn, a book, the notes); `aboutLabel` is its name for screen readers (the sheet's title) */
  onAbout?: () => void; aboutLabel?: string;
  /** Pins a link to a state for the library and the checker */
  show?: { link: 'translation' | 'change'; state: 'pressed' | 'focus' };
}
export function SourceLine({ segments, reference, translation, onTranslation, change, onChange, show, onAbout, aboutLabel }: SourceLineProps) {
  const parts = segments ?? (reference ? [reference] : []);
  const cls = (link: 'translation' | 'change') => `tkc-src__tr${link === 'change' ? ' tkc-src__chg' : ''}${show?.link === link ? ` is-${show.state}` : ''}`;
  const dot = <span class="tkc-src__dot"> · </span>;
  const items: ComponentChildren[] = parts.map((p, i) => <span data-part="seg" class="tkc-src__tx">{i === 0 && onAbout ? <a href="#about" class="tkc-src__ab" data-part="about" aria-label={aboutLabel} onClick={(e) => { e.preventDefault(); onAbout(); }}>{p}</a> : p}</span>);
  if (translation) items.push(<span data-part="seg"><a href="#bible" class={cls('translation')} data-part="tr" onClick={(e) => { e.preventDefault(); onTranslation?.(); }}>{translation}<Icon n="caretDown" size="12px" /></a></span>);
  if (change || onChange) items.push(<span data-part="seg"><a href="#change" class={cls('change')} data-part="chg" onClick={(e) => { e.preventDefault(); onChange?.(); }}>Change</a></span>);
  // Segments keep together (nowrap). Only when one segment alone is wider than the line (Classic's book title at 200% text) the line lets segments wrap inside themselves (0.4.1).
  const root = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const fit = () => { el.classList.remove('is-wrap'); if (el.scrollWidth > el.clientWidth + 1) el.classList.add('is-wrap'); };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [parts.join('|'), translation, change]);
  return <p class="tkc-src ty-caption" data-tkc="TKC-031" ref={root}>{items.map((x, i) => <>{i > 0 && dot}{x}</>)}</p>;
}
