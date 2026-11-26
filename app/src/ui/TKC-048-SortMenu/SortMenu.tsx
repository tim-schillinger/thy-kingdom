// TKC-048 SortMenu 0.2: one button that names the list's current order and opens the sort sheet (TKC-004 pick one, four TKC-012 compact rows).
import { Icon } from '../icon';
import './sortmenu.css';
export const ORDERS = ['Oldest First', 'Newest First', 'A–Z', 'Z–A'] as const;
export interface SortMenuProps { order?: typeof ORDERS[number]; show?: 'pressed' | 'focus'; onOpen?: () => void }
export function SortMenu({ order = 'Oldest First', show, onOpen }: SortMenuProps) {
  return <button type="button" class={`tkc-sort${show ? ` is-${show}` : ''}`} data-tkc="TKC-048" aria-label={`Sort: ${order}. Change the order`} aria-haspopup="dialog" onClick={onOpen}>{order}<span class="tkc-sort__cv" data-part="caret"><Icon n="caretDown" size="100%" /></span></button>;
}
