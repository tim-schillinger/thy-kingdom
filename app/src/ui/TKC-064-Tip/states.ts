import type { TipProps } from './Tip';
import { TIP } from '../../copy';
export const ID = 'TKC-064', NAME = 'Tip', VERSION = '0.1';
export const STATES: Array<{ name: string; props: TipProps }> = [
  { name: 'the first-time tip', props: { open: true, still: true, message: TIP.about, closeLabel: TIP.close } },
  { name: '✕ pressed', props: { open: true, still: 'pressed', message: TIP.about, closeLabel: TIP.close } },
  { name: '✕ focus', props: { open: true, still: 'focus', message: TIP.about, closeLabel: TIP.close } },
];
