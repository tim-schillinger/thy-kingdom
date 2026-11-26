// TKC-008 Chip, spec 0.2.1: a small rounded tap target. Link opens a place; toggle marks an ask (Provide, Forgive, Protect).
import { Icon } from '../icon';
import './chip.css';
export interface ChipProps { label: string; kind?: 'link' | 'toggle'; chosen?: boolean; show?: 'pressed' | 'focus'; onTap?: () => void }
export function Chip({ label, kind = 'link', chosen = false, show, onTap }: ChipProps) {
  return <button type="button" class={`tkc-chip2${show ? ` is-${show}` : ''}`} data-tkc="TKC-008" data-kind={kind} aria-pressed={kind === 'toggle' ? chosen : undefined}
    aria-label={kind === 'link' ? `${label}, open again` : undefined} onClick={onTap}>
    {kind === 'toggle' && chosen ? <Icon n="hands" size="calc(18px*min(var(--ts),1.5))" cls="tkc-chip2__hands" /> : null}{label}</button>;
}
