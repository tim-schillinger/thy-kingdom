import type { NationRowProps } from './NationRow';
export const ID = 'TKC-041', NAME = 'NationRow', VERSION = '0.1';
const BW = { name: 'Botswana', line: 'Southern Africa · About 2.4 million people' };
export const STATES: Array<{ name: string; props: NationRowProps }> = [
  { name: 'typical', props: BW }, { name: 'pressed', props: { ...BW, show: 'pressed' } }, { name: 'focus', props: { ...BW, show: 'focus' } },
  { name: 'longest name', props: { name: 'Saint Vincent and the Grenadines', line: 'Caribbean · About 110,000 people' } },
];
