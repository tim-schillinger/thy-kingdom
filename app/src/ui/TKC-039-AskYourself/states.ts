import type { AskYourselfProps } from './AskYourself';
export const ID = 'TKC-039', NAME = 'AskYourself', VERSION = '0.3';
const MOVE = 'If something comes to mind, give it to God in prayer, and choose one way to honor Him with it tomorrow.';
export const STATES: Array<{ name: string; props: AskYourselfProps }> = [
  { name: 'question (Check-In)', props: { kind: 'question', text: 'Is there a part of me to give back to God?' } },
  { name: 'move (Check-In)', props: { kind: 'move', text: MOVE } },
  { name: 'move (Giving, shorter)', props: { kind: 'move', text: 'If something comes to mind, pray about it, and decide where and when you’ll give.' } },
  { name: 'Meditate verse', props: { kind: 'verse', text: 'For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many.' } },
  { name: 'Meditate question (24 under the verse)', props: { kind: 'question', afterVerse: true, text: 'How should this change the way I share my faith?' } },
  { name: 'Meditate move', props: { kind: 'move', text: 'If something comes to mind, ask God for one chance to share it this week.' } },
];
