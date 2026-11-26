import type { TabsProps } from './Tabs';
export const ID = 'TKC-053', NAME = 'Tabs', VERSION = '0.2';
const L = [{ label: 'Praying For' }, { label: 'Answered', count: 12 }];
export const STATES: Array<{ name: string; props: TabsProps }> = [
  { name: 'Praying For open', props: { tabs: L, open: 0 } }, { name: 'Answered open', props: { tabs: L, open: 1 } },
  { name: 'Praying For pressed', props: { tabs: L, open: 1, show: { i: 0, state: 'pressed' } } }, { name: 'Answered pressed', props: { tabs: L, open: 0, show: { i: 1, state: 'pressed' } } },
  { name: 'Praying For focus', props: { tabs: L, open: 1, show: { i: 0, state: 'focus' } } }, { name: 'Answered focus', props: { tabs: L, open: 0, show: { i: 1, state: 'focus' } } },
  { name: 'count 128', props: { tabs: [L[0], { label: 'Answered', count: 128 }], open: 1 } }, { name: 'count 0 (no pill)', props: { tabs: [L[0], { label: 'Answered' }], open: 1 } },
];
