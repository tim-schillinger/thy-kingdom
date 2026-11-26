import type { StatusMarkProps } from './StatusMark';
export const ID = 'TKC-021', NAME = 'StatusMark', VERSION = '0.3';
const S = [12, 14, 16, 20] as const;
export const STATES: Array<{ name: string; props: StatusMarkProps }> = [
  ...(['done', 'part', 'open', 'skip'] as const).flatMap((mark) => S.map((size) => ({ name: `${mark} ${size}`, props: { mark, size } }))),
  { name: 'done muted 16', props: { mark: 'done', size: 16, tone: 'muted' } }, { name: 'part muted 16', props: { mark: 'part', size: 16, tone: 'muted' } },
];
