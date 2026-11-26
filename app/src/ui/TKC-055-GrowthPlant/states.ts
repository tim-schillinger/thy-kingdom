import type { GrowthPlantProps } from './GrowthPlant';
export const ID = 'TKC-055', NAME = 'GrowthPlant', VERSION = '0.1';
export const STATES: Array<{ name: string; props: GrowthPlantProps }> = [
  { name: 'stage 0 · 104', props: { stage: 0, label: 'Your plant: a sprout' } }, { name: 'stage 1 · 104', props: { stage: 1 } }, { name: 'stage 2 · 104', props: { stage: 2, label: 'Your plant: a young plant, grown at 30 days' } },
  { name: 'stage 3 · 104', props: { stage: 3 } }, { name: 'stage 4 · 104', props: { stage: 4 } },
  { name: 'stage 0 · 40', props: { stage: 0, size: 40 } }, { name: 'stage 2 · 32', props: { stage: 2, size: 32 } }, { name: 'stage 4 · 40', props: { stage: 4, size: 40 } }, { name: 'stage 4 · 20', props: { stage: 4, size: 20 } },
  { name: 'stage 1 · 56', props: { stage: 1, size: 56 } },
];
