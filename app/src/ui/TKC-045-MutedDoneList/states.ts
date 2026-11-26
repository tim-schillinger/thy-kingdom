import type { MutedDoneListProps } from './MutedDoneList';
export const ID = 'TKC-045', NAME = 'MutedDoneList', VERSION = '0.2.1';
const MORNING = ['Sing', 'Ask to Hear', 'Psalm', 'Proverb', 'Bible Reading', 'Respond', 'Memorize'];
const EVENING = ['Turn to God', 'Classic', 'Study Notes', 'Dig Deeper', 'Prayer', 'Check-In', 'Meditate'];
const mk = (names: string[], skip: string[] = []) => names.map((name) => ({ name, skipped: skip.includes(name) || undefined }));
export const STATES: Array<{ name: string; props: MutedDoneListProps }> = [
  { name: 'steps, Morning (seven done)', props: { items: mk(MORNING) } }, { name: 'steps, Evening', props: { items: mk(EVENING) } },
  { name: 'steps, some skipped', props: { items: mk(MORNING, ['Psalm', 'Memorize']) } }, { name: 'steps, all skipped', props: { items: mk(MORNING, MORNING) } },
  { name: 'Still Open (five handled)', props: { items: mk(MORNING.slice(0, 5)) } }, { name: 'walks (Day Complete)', props: { items: mk(['Morning Walk', 'Evening Walk']), content: 'walks' } },
];
