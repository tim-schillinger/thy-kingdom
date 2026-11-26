// TKC-010 Checkbox, spec 0.1: one yes-or-no choice about the app itself, said in a plain line.
import { Icon } from '../icon';
import './checkbox.css';
export interface CheckboxProps { label: string; checked?: boolean; show?: 'pressed' | 'focus'; onChange?: (v: boolean) => void }
export function Checkbox({ label, checked = false, show, onChange }: CheckboxProps) {
  return <button type="button" role="checkbox" aria-checked={checked} class={`tkc-cb${show ? ` is-${show}` : ''}`} data-tkc="TKC-010" onClick={() => onChange?.(!checked)}>
    <span class="tkc-cb__box" data-part="box">{checked ? <Icon n="check" size="calc(16px*min(var(--ts),1.5))" /> : null}</span>
    <span class="tkc-cb__label" data-part="label">{label}</span></button>;
}
