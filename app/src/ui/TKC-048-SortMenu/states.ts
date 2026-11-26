import type { SortMenuProps } from './SortMenu';
export const ID = 'TKC-048', NAME = 'SortMenu', VERSION = '0.2';
export const STATES: Array<{ name: string; props: SortMenuProps }> = [
  { name: 'Oldest First', props: {} }, { name: 'Newest First', props: { order: 'Newest First' } }, { name: 'A–Z', props: { order: 'A–Z' } }, { name: 'Z–A', props: { order: 'Z–A' } },
  { name: 'pressed', props: { show: 'pressed' } }, { name: 'focus', props: { show: 'focus' } },
];
