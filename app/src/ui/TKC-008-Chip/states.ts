import type { ChipProps } from './Chip';
export const ID = 'TKC-008', NAME = 'Chip', VERSION = '0.2.1';
export const STATES: Array<{ name: string; props: ChipProps }> = [
  { name: 'link', props: { label: 'Psalm 97' } }, { name: 'link, pressed', props: { label: 'Psalm 97', show: 'pressed' } }, { name: 'link, focus', props: { label: 'Psalm 97', show: 'focus' } },
  { name: 'toggle, unchosen', props: { label: 'Provide', kind: 'toggle' } }, { name: 'toggle, chosen', props: { label: 'Provide', kind: 'toggle', chosen: true } },
  { name: 'toggle, focus', props: { label: 'Forgive', kind: 'toggle', show: 'focus' } }, { name: 'longest label', props: { label: 'Revelation 4:6–5:13' } },
];
