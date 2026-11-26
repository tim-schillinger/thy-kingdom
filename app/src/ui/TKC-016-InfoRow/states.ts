import type { InfoRowProps } from './InfoRow';
export const ID = 'TKC-016', NAME = 'InfoRow', VERSION = '0.2.1';
export const STATES: Array<{ name: string; props: InfoRowProps }> = [
  { name: 'fact', props: { label: 'Capital', value: 'Gaborone' } }, { name: 'fact, population', props: { label: 'Population', value: 'About 2.4 million' } },
  { name: 'fact, main language', props: { label: 'Main language', value: 'Setswana' } }, { name: 'person, list', props: { label: 'List', value: 'Neighbors' } },
  { name: 'guide', props: { label: 'Every year', value: 'The whole Bible, and every nation four times', kind: 'guide' } },
  { name: 'person, longest', props: { label: 'You asked', value: 'Provide 12 · Forgive 9 · Protect 11' } },
];
