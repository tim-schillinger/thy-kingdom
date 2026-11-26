import type { StartHereCardProps } from './StartHereCard';
export const ID = 'TKC-059', NAME = 'StartHereCard', VERSION = '0.3 (Today, Guide, Home Screen, Proverbs)';
export const STATES: Array<{ name: string; props: StartHereCardProps }> = [
  { name: 'Start Here (Today)', props: {} }, { name: 'backup reminder', props: { kind: 'backup' } },
  { name: '✕ pressed', props: { show: { which: 'x', state: 'pressed' } } }, { name: '✕ focus', props: { show: { which: 'x', state: 'focus' } } },
  { name: 'button pressed', props: { show: { which: 'button', state: 'pressed' } } }, { name: 'button focus', props: { kind: 'backup', show: { which: 'button', state: 'focus' } } },
  { name: 'Proverbs offer (TKC-037)', props: { kind: 'proverbs', text: { line: 'February has 28 days. Read 3 extra chapters, and the month still ends on chapter 31.', button: 'Read Proverbs 5 Too' } } },
  { name: 'Guide place (Start)', props: { place: 'guide' } }, { name: 'Home Screen card', props: { kind: 'home-screen' } }, { name: 'Home Screen, ✕ focus', props: { kind: 'home-screen', show: { which: 'x', state: 'focus' } } },
];
