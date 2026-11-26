import type { MilestonePathProps } from './MilestonePath';
export const ID = 'TKC-056', NAME = 'MilestonePath', VERSION = '0.1';
export const STATES: Array<{ name: string; props: MilestonePathProps }> = [
  { name: 'none earned (Rachel)', props: { earned: 0, far: '6 days to 7' } }, { name: 'one day to go', props: { earned: 0, far: '1 day to 7' } },
  { name: 'typical (7 and 30)', props: { earned: 2, far: '77 days to 100' } }, { name: 'after a break', props: { earned: 2, far: 'Next: 100 days' } },
  { name: 'three earned', props: { earned: 3, far: '300 days to 365' } }, { name: 'all four', props: { earned: 4, far: 'All four reached' } },
];
