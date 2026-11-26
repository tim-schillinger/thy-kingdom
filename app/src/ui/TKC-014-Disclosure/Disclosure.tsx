// TKC-014 Disclosure, spec 0.6: optional help folded away. Row, with a list, a two-column list or (0.6, the Guide's "In the Bible", 3302) a prose body: one short line, then its verse card.
// The root is the row (as in the Review); the body follows it as its sibling, kept mounted in a Fold and inert while closed (0.5, M15).
import type { ComponentChildren } from 'preact';
import { Icon } from '../icon';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { Fold } from '../Fold';
import './disclosure.css';
export interface DisclosureProps { label: string; open?: boolean; items?: string[]; columns?: 1 | 2; show?: 'pressed' | 'focus'; onToggle?: () => void; /** Tappable items (0.4): each item opens its own sheet, drawn "[word] ›" in the shared link look (1689) */ onItem?: (i: number) => void;
  /** Prose body (0.6): one short paragraph, then the verse card(s) the screen hands in. Closed at every start; its bottom hairline closes under the last card */ line?: string; verses?: ComponentChildren }
export function Disclosure({ label, open = false, items, columns = 1, show, onToggle, onItem, line, verses }: DisclosureProps) {
  return <>
    <button type="button" class={`tkc-ds__row${show ? ` is-${show}` : ''}`} data-tkc="TKC-014" aria-expanded={open} onClick={onToggle}>
      <span class="tkc-ds__label" data-part="label">{label}</span><span class="tkc-ds__caret" data-part="caret"><Icon n="caretDown" size="20px" /></span></button>
    {line !== undefined ? <Fold open={open}><div class="tkc-ds__prose" data-part="prose"><p class="tkc-ds__line" data-part="line">{line}</p>{verses}</div></Fold>
      : items ? <Fold open={open}><ul class="tkc-ds__body" data-cols={columns}>{items.map((t, k) => <li key={t}>{onItem ? <TextLink kind="more" label={t} aria={`${t}. Opens what it means`} onOpen={() => onItem(k)} /> : t}</li>)}</ul></Fold> : null}</>;
}
