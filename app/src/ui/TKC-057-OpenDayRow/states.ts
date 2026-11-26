import type { OpenDayRowProps } from './OpenDayRow';
export const ID = 'TKC-057', NAME = 'OpenDayRow', VERSION = '0.1';
export const STATES: Array<{ name: string; props: OpenDayRowProps }> = [
  { name: 'day, both walks', props: { title: 'Thu, Oct 1', line: 'Both walks' } }, { name: 'day, pressed', props: { title: 'Thu, Oct 1', line: 'Both walks', show: 'pressed' } },
  { name: 'day, focus', props: { title: 'Thu, Oct 1', line: 'Both walks', show: 'focus' } },
  { name: 'day, longest line', props: { title: 'Tue, Sep 29', line: 'The rest of the Morning Walk, and the Evening Walk' } },
  { name: 'summary, with a join', props: { kind: 'summary', title: '3 days still open', line: 'Finish them and your streak grows to 56' } },
  { name: 'summary, one day', props: { kind: 'summary', title: '1 day still open', line: 'Finish it and your streak grows to 24' } },
  { name: 'summary, no second line', props: { kind: 'summary', title: '3 days still open' } },
  { name: 'select, none picked', props: { title: 'Thu, Oct 1', line: 'Both walks', mode: 'select' } }, { name: 'select, picked', props: { title: 'Thu, Oct 1', line: 'Both walks', mode: 'select', checked: true } },
];
