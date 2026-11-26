// TKC-046 CheckInRow 0.1.2: tonight's check-ins in one list, the done ones kept and the rest a free choice. A row is open (a button), done
// (a filled disc and "Done", proof, not tappable) or skipped (the calm dash and "Skipped", not tappable). `CheckInList` is the plain list.
import { Icon } from '../icon';
import './checkinrow.css';
export interface CheckInRowProps { name: string; status: 'open' | 'done' | 'skipped'; show?: 'pressed' | 'focus'; onOpen?: () => void }
export function CheckInRow({ name, status, show, onOpen }: CheckInRowProps) {
  const inner = <>
    <span class="tkc-ci__mkw" data-part="mark-wrap"><span class={`tkc-ci__mk is-${status}`} data-part="mark" aria-hidden="true">
      {status === 'done' && <Icon n="check" size="calc(16px*min(var(--ts), 1.5))" />}{status === 'skipped' && <Icon n="minus" size="calc(14px*min(var(--ts), 1.5))" />}</span></span>
    <span class="tkc-ci__nm" data-part="name">{name}</span>
    {status === 'open' && <span class="tkc-ci__cv" data-part="chevron"><Icon n="caretRight" size="calc(18px*min(var(--ts), 1.5))" /></span>}
    {status === 'done' && <><span class="tkc-ci__st" data-part="status">Done</span><span class="tkc-ci__sr">, done</span></>}
    {status === 'skipped' && <><span class="tkc-ci__st" data-part="status">Skipped</span><span class="tkc-ci__sr">, skipped</span></>}</>;
  return status === 'open'
    ? <button type="button" class={`tkc-ci${show ? ` is-${show}` : ''}`} data-tkc="TKC-046" data-status="open" aria-label={`${name}, open this check-in`} onClick={onOpen}>{inner}</button>
    : <div class="tkc-ci" data-tkc="TKC-046" data-status={status}>{inner}</div>;
}
export function CheckInList({ rows }: { rows: CheckInRowProps[] }) {
  return <ul class="tkc-ci-list" aria-label="Tonight’s check-ins">{rows.map((r) => <li key={r.name}><CheckInRow {...r} /></li>)}</ul>;
}
