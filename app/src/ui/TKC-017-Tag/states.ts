import type { TagProps } from './Tag';
export const ID = 'TKC-017', NAME = 'Tag', VERSION = '0.2';
export const STATES: Array<{ name: string; props: TagProps }> = [
  { name: 'Tonight', props: { label: 'Tonight' } }, { name: 'Added tonight', props: { label: 'Added tonight' } }, { name: 'You’re here', props: { label: 'You’re here' } },
];
