import type { PersonPrayerRowProps } from './PersonPrayerRow';
export const ID = 'TKC-043', NAME = 'PersonPrayerRow', VERSION = '0.3';
export const STATES: Array<{ name: string; props: PersonPrayerRowProps }> = [
  { name: 'person, none chosen', props: { name: 'Linda', request: 'Her knee surgery' } }, { name: 'person, one chosen', props: { name: 'Linda', request: 'Her knee surgery', asks: ['Provide'] } },
  { name: 'person, all chosen', props: { name: 'Linda', request: 'Her knee surgery', asks: ['Provide', 'Forgive', 'Protect'] } },
  { name: 'no request', props: { name: 'Tom' } }, { name: 'request kind (Saturday)', props: { name: 'A new job by spring', asks: ['Provide'] } },
  { name: 'read ahead (no pills)', props: { name: 'Linda', request: 'Her knee surgery', ahead: true } },
  { name: '⋯ pressed', props: { name: 'Linda', request: 'Her knee surgery', showMore: 'pressed' } }, { name: '⋯ focus', props: { name: 'Linda', request: 'Her knee surgery', showMore: 'focus' } },
  { name: 'pill focus', props: { name: 'Marcus', request: 'His new job', asks: ['Provide'], showAsk: { ask: 'Provide', state: 'focus' } } }, { name: 'pill pressed', props: { name: 'Marcus', request: 'His new job', showAsk: { ask: 'Forgive', state: 'pressed' } } },
  { name: 'longest name and request', props: { name: 'Dave and Kim Okonkwo-Hartley', request: 'Wisdom for the move, a new school for the kids, and peace for their parents while they sell the family home this spring', asks: ['Provide'] } },
];
