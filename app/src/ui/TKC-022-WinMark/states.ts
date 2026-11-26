import type { WinMarkProps } from './WinMark';
export const ID = 'TKC-022', NAME = 'WinMark', VERSION = '0.4';
export const STATES: Array<{ name: string; props: WinMarkProps }> = [
  { name: 'small check', props: { size: 'small' } }, { name: 'large check', props: { size: 'large' } },
  { name: 'small check, no burst (tracking off)', props: { size: 'small', burst: false } }, { name: 'large check, no burst (tracking off)', props: { size: 'large', burst: false } },
  { name: 'small hands', props: { size: 'small', glyph: 'hands' } }, { name: 'large hands', props: { size: 'large', glyph: 'hands' } },
  { name: 'mini (hands)', props: { size: 'mini' } },
  { name: 'small check, plays', props: { size: 'small', play: true } },
];
