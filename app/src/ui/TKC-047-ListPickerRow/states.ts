import type { ListPickerRowProps } from './ListPickerRow';
export const ID = 'TKC-047', NAME = 'ListPickerRow', VERSION = '0.2';
export const STATES: Array<{ name: string; props: ListPickerRowProps }> = [
  { name: 'Leaders', props: { name: 'Leaders', line: 'Wednesdays · People with a say over your life' } },
  { name: 'Neighbors', props: { name: 'Neighbors', line: 'Tuesdays · The people around you, from next door to the checkout line' } },
  { name: 'longest line', props: { name: 'The Hurting', line: 'Thursdays · People who are grieving, sick, forgotten, or alone' } },
  { name: 'Friday', props: { name: 'Difficult People', line: 'Fridays · People it’s hard to love right now' } },
  { name: 'Change pressed', props: { name: 'Leaders', line: 'Wednesdays · People with a say over your life', show: 'pressed' } },
  { name: 'Change focus', props: { name: 'Leaders', line: 'Wednesdays · People with a say over your life', show: 'focus' } },
];
