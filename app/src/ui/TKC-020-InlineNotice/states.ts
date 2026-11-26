import type { InlineNoticeProps } from './InlineNotice';
export const ID = 'TKC-020', NAME = 'InlineNotice', VERSION = '0.1';
export const STATES: Array<{ name: string; props: InlineNoticeProps }> = [
  { name: 'already on a list', props: { name: 'Marcus', list: 'Neighbors' } }, { name: 'long name', props: { name: 'Marcus Aurelius Whitfield-Henderson', list: 'Family & Friends' } },
];
