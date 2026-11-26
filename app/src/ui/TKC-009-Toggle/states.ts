import type { ToggleProps } from './Toggle';
export const ID = 'TKC-009', NAME = 'Toggle', VERSION = '0.1';
export const STATES: Array<{ name: string; props: ToggleProps }> = [
  { name: 'on', props: { name: 'Track My Progress', icon: 'plantReg', on: true } }, { name: 'off', props: { name: 'Track My Progress', icon: 'plantReg', on: false } },
  { name: 'on, pressed', props: { name: 'Track My Progress', icon: 'plantReg', on: true, show: 'pressed' } }, { name: 'off, focus', props: { name: 'Track My Progress', icon: 'plantReg', on: false, show: 'focus' } },
];
