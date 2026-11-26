import type { CheckboxProps } from './Checkbox';
export const ID = 'TKC-010', NAME = 'Checkbox', VERSION = '0.1';
const L = 'Don’t show this again';
export const STATES: Array<{ name: string; props: CheckboxProps }> = [
  { name: 'unchecked', props: { label: L } }, { name: 'checked', props: { label: L, checked: true } },
  { name: 'pressed', props: { label: L, show: 'pressed' } }, { name: 'checked, pressed', props: { label: L, checked: true, show: 'pressed' } },
  { name: 'focus', props: { label: L, show: 'focus' } },
];
