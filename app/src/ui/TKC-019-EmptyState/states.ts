import type { EmptyStateProps } from './EmptyState';
import { READING_FAILED } from '../../copy';
export const ID = 'TKC-019', NAME = 'EmptyState', VERSION = '0.4';
const V = 'Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you.';
export const STATES: Array<{ name: string; props: EmptyStateProps }> = [
  { name: 'answered', props: { verse: V, reference: 'Matthew 7:7', line: 'When God answers a prayer, mark it answered. It will be kept here.' } },
  { name: 'prayer', props: { verse: 'Ask, and it will be given you. Seek, and you will find. Knock, and it will be opened for you.', reference: 'Matthew 7:7', line: 'Who comes to mind?', actionLabel: '+ Add Person' } },
  { name: 'search', props: { kind: 'search', line: 'No names or requests match “Grandma.”' } },
  { name: 'search, long words', props: { kind: 'search', line: 'No names or requests match “someone from the hardware store.”' } },
  { name: 'missing (Study Notes)', props: { kind: 'missing', line: 'The app doesn’t have notes for Matthew 7–9. If you have a study Bible, read its notes on these chapters, then go on.', actionLabel: 'Use My Own Study Notes' } },
  { name: 'missing (Dig Deeper)', props: { kind: 'missing', line: 'The app doesn’t have a commentary on Luke 8 and Matthew 13. If you have one, read what it says about these chapters, then go on.', actionLabel: 'Use My Own Commentary' } },
  { name: 'slow (reading)', props: { kind: 'slow', line: 'Still getting this reading ready.' } },
  { name: 'failed (reading)', props: { kind: 'failed', line: READING_FAILED, actionLabel: 'Try Again' } },
  { name: 'settled', props: { kind: 'settled', heading: 'Nothing open.', line: 'Every day is accounted for.' } },
];
