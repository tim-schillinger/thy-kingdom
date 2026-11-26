import { h } from 'preact';
import type { DisclosureProps } from './Disclosure';
import { VerseCard } from '../TKC-033-VerseCard/VerseCard';
export const ID = 'TKC-014', NAME = 'Disclosure', VERSION = '0.6';
const PROSE = { line: 'Abba means father, in the language Jesus spoke. You can call God that too.', verses: h(VerseCard, { verse: 'For you didn’t receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, “Abba! Father!”', reference: 'Romans 8:15 · World English Bible' }) };
const TIPS = ['Read it a few times, then try saying it without looking.', 'Say it out loud, slowly, one phrase at a time.', 'Write it down once, by hand.', 'Come back to it a few times during the day.'];
const AREAS = ['Energy', 'Imagination', 'Choices', 'Body', 'Memory', 'Words', 'Eyes and ears', 'Thinking', 'Personality', 'Emotions', 'Conscience', 'Soul'];
export const STATES: Array<{ name: string; props: DisclosureProps }> = [
  { name: 'closed', props: { label: 'Tips for Memorizing', items: TIPS } }, { name: 'open, list', props: { label: 'Tips for Memorizing', items: TIPS, open: true } },
  { name: 'open, two columns', props: { label: 'Need ideas?', items: AREAS, columns: 2, open: true } },
  { name: 'open, tappable items', props: { label: 'Need ideas?', items: AREAS, columns: 2, open: true, onItem: () => {} } },
  { name: 'closed, prose', props: { label: 'In the Bible', ...PROSE } }, { name: 'open, prose', props: { label: 'In the Bible', ...PROSE, open: true } },
  { name: 'pressed', props: { label: 'Tips for Memorizing', items: TIPS, show: 'pressed' } }, { name: 'focus', props: { label: 'Tips for Memorizing', items: TIPS, show: 'focus' } },
];
