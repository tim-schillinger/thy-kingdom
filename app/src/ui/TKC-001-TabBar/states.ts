import type { TabBarProps } from './TabBar';
export const ID = 'TKC-001', NAME = 'TabBar', VERSION = '0.2.1';
export const STATES: Array<{ name: string; props: TabBarProps }> = [
  ...(['Today', 'Lists', 'Guide', 'Settings'] as const).map((c) => ({ name: `current ${c}`, props: { current: c } })),
  { name: 'Lists pressed', props: { current: 'Today', show: { tab: 'Lists', state: 'pressed' } } },
  { name: 'Guide focus', props: { current: 'Today', show: { tab: 'Guide', state: 'focus' } } },
];
