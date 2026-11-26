import type { TextLinkProps } from './TextLink';
export const ID = 'TKC-007', NAME = 'TextLink', VERSION = '0.3';
// 0.3 (569, 573): the "why" kind, "Why It Matters ›", on every step and on every Coming Up row.
export const STATES: Array<{ name: string; props: TextLinkProps }> = [
  { name: 'in a line', props: {} }, { name: 'in a line, pressed', props: { show: 'pressed' } }, { name: 'in a line, focus', props: { show: 'focus' } },
  { name: 'under a primary', props: { kind: 'under-primary' } }, { name: 'under a primary, pressed', props: { kind: 'under-primary', show: 'pressed' } }, { name: 'under a primary, focus', props: { kind: 'under-primary', show: 'focus' } },
  { name: 'why (Why It Matters ›)', props: { kind: 'why' } }, { name: 'why, pressed', props: { kind: 'why', show: 'pressed' } }, { name: 'why, focus', props: { kind: 'why', show: 'focus' } },
];
