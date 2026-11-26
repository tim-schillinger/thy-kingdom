import type { ChoiceRowProps } from './ChoiceRow';
export const ID = 'TKC-012', NAME = 'ChoiceRow', VERSION = '0.3';
const WEB = { name: 'World English Bible', line: 'Modern, plain English', sample: 'Yahweh is my shepherd: I shall lack nothing.', reference: 'Psalm 23:1' };
const KJV = { name: 'King James Version', line: 'The classic wording', sample: 'The LORD is my shepherd; I shall not want.', reference: 'Psalm 23:1' };
export const STATES: Array<{ name: string; props: ChoiceRowProps }> = [
  { name: 'full, chosen', props: { ...WEB, chosen: true } }, { name: 'full, not chosen', props: KJV }, { name: 'full, pressed', props: { ...KJV, show: 'pressed' } }, { name: 'full, focus', props: { ...KJV, show: 'focus' } },
  { name: 'compact, chosen', props: { kind: 'compact', name: 'Faith Family', line: 'Sundays · The people you grow with', chosen: true } },
  { name: 'compact, not chosen', props: { kind: 'compact', name: 'The Hurting', line: 'Thursdays · People who are grieving, sick, forgotten, or alone' } },
  { name: 'compact, with Tag', props: { kind: 'compact', name: 'Leaders', tag: 'Tonight', line: 'Wednesdays · People with a say over your life' } },
  { name: 'compact, name only', props: { kind: 'compact', name: 'Every Week' } },
];
