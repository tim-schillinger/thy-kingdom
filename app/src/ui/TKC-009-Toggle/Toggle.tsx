// TKC-009 Toggle, spec 0.1: a setting row with the switch in the chevron's place. The state line (group print) sits under its own panel, so it is the screen's, not this row's.
import { ListRow } from '../TKC-015-ListRow/ListRow';
import type { IconName } from '../icon';
import './toggle.css';
export interface ToggleProps { name: string; icon?: IconName; on: boolean; show?: 'pressed' | 'focus'; onChange?: (on: boolean) => void }
export function Toggle({ name, icon, on, show, onChange }: ToggleProps) {
  return <ListRow tkc="TKC-009" name={name} icon={icon} role="switch" checked={on} show={show} onClick={() => onChange?.(!on)}><span class="tkc-toggle__sw" data-part="switch" aria-hidden="true" /></ListRow>;
}
