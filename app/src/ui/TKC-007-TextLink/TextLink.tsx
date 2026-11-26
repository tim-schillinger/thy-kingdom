// TKC-007 TextLink, spec 0.2: an underlined word inside a line that opens a choice, or a quiet link under a primary.
import { Icon } from '../icon';
import './textlink.css';
export interface TextLinkProps { label?: string; kind?: 'line' | 'under-primary' | 'why' | 'more'; /** `title`: a list's name that opens its sheet (22 px, ink; the › stays the link color: frame-lock-4b §1) */ size?: 'title'; expanded?: boolean; controls?: string; show?: 'pressed' | 'focus'; /** spoken name when the word alone isn't enough (TKC-047: "Change the list") */ aria?: string; onOpen?: () => void }
export function TextLink({ label, kind = 'line', size, show, aria, expanded, controls, onOpen }: TextLinkProps) {
  const text = label ?? (kind === 'line' ? 'Change' : 'Restore From a Backup');
  if (kind === 'why' || kind === 'more') return <button type="button" class={`tkc-link${show ? ` is-${show}` : ''}`} data-tkc="TKC-007" data-kind={kind} data-size={size} aria-label={aria} aria-expanded={expanded} aria-controls={controls} onClick={onOpen}><span>{label ?? 'About This Step'}</span><Icon n="caretRight" size="calc(14px*var(--ts))" /></button>;
  return <button type="button" class={`tkc-link${show ? ` is-${show}` : ''}`} data-tkc="TKC-007" data-kind={kind} aria-label={aria} onClick={onOpen}>{text}</button>;
}
