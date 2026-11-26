import type { MovingHalfProps } from './MovingHalf';
export const ID = 'TKC-063', NAME = 'MovingHalf', VERSION = '0.1';
const slides = [{ label: 'Set Your Mind on God', question: 'What does this show me about who God is?', move: 'If something comes to mind, thank Him for it.' }, { label: 'Live It Out', question: 'How should this change what I do tomorrow?', move: 'If something comes to mind, choose one small way to start.' }];
const count = (n: number, of: number) => `Question ${n} of ${of}`;
export const STATES: Array<{ name: string; props: MovingHalfProps }> = [
  { name: 'first', props: { slides, at: 1, onGo: () => {}, count } },
  { name: 'last', props: { slides, at: 2, onGo: () => {}, count } },
];
