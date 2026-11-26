// TKC-052 AnchorLine 0.2: one quiet line near the top of a step (or of Answered) that ties the screen to its root
// and, when tapped, opens it. Kinds: quote (Prayer), quote with reference (Check-In, Answered), reference (Dig Deeper),
// note (Classic, Study Notes: plain text, not a button).
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Icon } from '../icon';
import './anchorline.css';
export interface AnchorLineProps {
  kind: 'quote' | 'reference' | 'note';
  /** The quote (with its typographic quotes), the reference kind's lead-in ("On this morning’s reading · "), or the note */
  text: string;
  /** Quote with reference: "Luke 10:27", upright, never split */
  reference?: string;
  /** Reference kind: the passages that keep together ("Luke 8, Matthew 13") */
  keep?: string;
  /** Opens the passage (tappable kinds) */
  onOpen?: () => void;
  /** Pins the row to a state for the library and the checker */
  show?: 'pressed' | 'focus';
  label?: string;
}
export function AnchorLine({ kind, text, reference, keep, onOpen, show, label }: AnchorLineProps) {
  if (kind === 'note') return <p class="tkc-anc-note" data-tkc="TKC-052" data-kind="note" data-part="text">{text}</p>;
  const t = useRef<HTMLSpanElement>(null); const [multi, setMulti] = useState(false);
  // the chevron sits on the first line: a little higher when the text wraps to two lines or more (spec 1020)
  useLayoutEffect(() => {
    const el = t.current; if (!el) return;
    const measure = () => { const ts = parseFloat(getComputedStyle(el).getPropertyValue('--ts')) || 1; setMulti(el.getBoundingClientRect().height > 22 * ts * 1.5); };
    measure(); const ro = new ResizeObserver(measure); ro.observe(el); return () => ro.disconnect();
  }, [text, reference, keep]);
  return <button type="button" class={`tkc-anc${multi ? ' is-multi' : ''}${show ? ` is-${show}` : ''}`} data-tkc="TKC-052" data-kind={kind} aria-label={label} onClick={onOpen}>
    <span class="tkc-anc__t" data-part="text" ref={t}>{text}{keep && <span class="tkc-anc__nw" data-part="keep">{keep}</span>}{reference && <> <span class="tkc-anc__vr" data-part="reference">{reference}</span></>}</span>
    <Icon n="caretRight" size="14px" />
  </button>;
}
