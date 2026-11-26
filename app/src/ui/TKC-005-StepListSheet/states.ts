import type { StepListSheetProps, StepRow } from './StepListSheet';
export const ID = 'TKC-005', NAME = 'StepListSheet', VERSION = '0.2';
const M: Array<[string, string?]> = [['Sing', 'Holy, Holy, Holy'], ['Ask to Hear', 'Psalm 119:18'], ['Psalm', 'Psalm 97'], ['Proverb', 'Proverbs 14'], ['Bible Reading', 'Luke 8, Matthew 13'], ['Respond'], ['Memorize', 'Mark 10:45']];
const rows = (marks: string[]): StepRow[] => M.map(([name, ref], i) => ({ n: i + 1, name, ref, mark: (marks[i] ?? 'none') as StepRow['mark'] }));
const E: Array<[string, string?]> = [['Sing', 'O Worship the King, All Glorious Above'], ['Psalm', 'Psalm 141:2'], ['Classic', 'Romans 12–14'], ['Bible Reading', 'Luke 8, Matthew 13'], ['Respond'], ['Check In'], ['Memorize', 'Mark 10:45']];
export const STATES: Array<{ name: string; props: StepListSheetProps }> = [
  { name: 'mid-walk', props: { walk: 'Morning Walk', steps: rows(['done', 'skipped', 'current']) } },
  { name: 'row pressed', props: { walk: 'Morning Walk', steps: rows(['done', 'skipped', 'current']), show: { row: 3, state: 'pressed' } } },
  { name: 'row focus', props: { walk: 'Morning Walk', steps: rows(['done', 'skipped', 'current']), show: { row: 3, state: 'focus' } } },
  { name: 'end screen, none current', props: { walk: 'Morning Walk', steps: rows(['done', 'done', 'skipped', 'done', 'done', 'done', 'done']) } },
  { name: 'all skipped', props: { walk: 'Morning Walk', steps: rows(Array(7).fill('skipped')) } },
  { name: 'from Today, with foot', props: { walk: 'Morning Walk', steps: rows([]), foot: { label: 'Start Your Walk', sub: 'Next: Sing' } } },
  { name: 'future day (look)', props: { walk: 'Morning Walk', steps: rows([]), look: true } },
  { name: 'Evening Walk, long reference', props: { walk: 'Evening Walk', steps: E.map(([name, ref], i) => ({ n: i + 1, name, ref, mark: i === 0 ? 'current' : 'none' })) } },
];
