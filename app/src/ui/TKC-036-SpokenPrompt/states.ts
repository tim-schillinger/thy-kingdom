import type { SpokenPromptProps } from './SpokenPrompt';
export const ID = 'TKC-036', NAME = 'SpokenPrompt', VERSION = '0.1.1';
export const STATES: Array<{ name: string; props: SpokenPromptProps }> = [
  { name: 'sentence', props: { kind: 'sentence' } }, { name: 'helper line', props: { kind: 'helper' } },
  { name: 'four cues', props: { kind: 'cues', cues: ['Psalm 97', 'Proverbs 14', 'Luke 8', 'Matthew 13'] } },
  { name: 'longest cue set (wraps)', props: { kind: 'cues', cues: ['Psalm 97', 'Proverbs 14', 'Revelation 4:6–5:13', 'Matthew 13'] } },
  { name: 'whole prompt', props: { kind: 'prompt', cues: ['Psalm 97', 'Proverbs 14', 'Luke 8', 'Matthew 13'] } },
];
