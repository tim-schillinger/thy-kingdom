import type { AnswerCardProps } from './AnswerCard';
export const ID = 'TKC-049', NAME = 'AnswerCard', VERSION = '0.2';
const base = { answer: 'Surgery went well.', asked: 'Linda · Her knee surgery', meta: 'Answered Oct 14 · Neighbors' };
export const STATES: Array<{ name: string; props: AnswerCardProps }> = [
  { name: 'list, typical', props: base }, { name: 'list, pressed', props: { ...base, show: 'pressed' } }, { name: 'list, focus', props: { ...base, show: 'focus' } },
  { name: 'list, no answer', props: { asked: 'Rest for my back', meta: 'Answered Aug 3 · Your Requests' } },
  { name: 'list, Saturday request', props: { answer: 'A new job by spring, and a good one.', asked: 'A new job by spring', meta: 'Answered Oct 2 · Your Requests' } },
  { name: 'list, other year', props: { ...base, meta: 'Answered Oct 14, 2025 · Neighbors' } },
  { name: 'list, longest answer', props: { answer: 'The surgery went well and the doctors said she may walk without the cane by Christmas. We are so thankful for every prayer.', asked: 'Linda · Her knee surgery', meta: 'Answered Oct 14 · Neighbors' } },
  { name: 'story', props: { kind: 'story', name: 'Linda', request: 'Her knee surgery', answer: 'Surgery went well.' } },
  { name: 'story, Saturday', props: { kind: 'story', request: 'A new job by spring', answer: 'A clear answer on the new job.' } },
  { name: 'story, no answer', props: { kind: 'story', name: 'Linda', request: 'Her knee surgery' } },
];
