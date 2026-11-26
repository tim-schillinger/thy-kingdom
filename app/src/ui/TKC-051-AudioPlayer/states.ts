import type { AudioPlayerProps } from './AudioPlayer';
export const ID = 'TKC-051', NAME = 'AudioPlayer', VERSION = '0.2';
export const STATES: Array<{ name: string; props: AudioPlayerProps }> = [
  { name: 'idle', props: { length: '2:45' } }, { name: 'playing', props: { state: 'playing', time: '1:11', length: '2:45', progress: 0.43 } }, { name: 'paused', props: { state: 'paused', time: '1:11', length: '2:45', progress: 0.43 } },
  { name: 'loading', props: { state: 'loading', length: '2:45' } },
  { name: 'long time (12:59 / 14:59)', props: { state: 'playing', time: '12:59', length: '14:59', progress: 0.9 } },
  { name: 'play pressed', props: { show: 'pressed' } }, { name: 'play focus', props: { show: 'focus' } },
];
