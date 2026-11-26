import type { TextFieldProps } from './TextField';
export const ID = 'TKC-011', NAME = 'TextField', VERSION = '0.2';
export const STATES: Array<{ name: string; props: TextFieldProps }> = [
  { name: 'field, rest', props: { label: 'Name', value: 'Linda' } }, { name: 'field, focus', props: { label: 'Name', value: 'Coach Reyes', focus: true } },
  { name: 'field, optional, near the limit', props: { label: 'What to pray for', optional: true, value: 'Wisdom for the move to Denver, a buyer for the house, and peace for the kids', focus: true, counter: '20 left' } },
  { name: 'field, empty with message', props: { label: 'Name', focus: true, message: 'Add a name.' } },
  { name: 'search, rest', props: { kind: 'search' } }, { name: 'search, focus, no text yet', props: { kind: 'search', focus: true } }, { name: 'search, typing', props: { kind: 'search', value: 'job', clearable: true } },
];
