import type { AreaCircleProps } from './AreaCircle';
export const ID = 'TKC-060', NAME = 'AreaCircle', VERSION = '0.1.1';
export const STATES: Array<{ name: string; props: AreaCircleProps }> = [
  { name: 'lesson, 12 open', props: { size: 168 } }, { name: 'area 1', props: { area: 1 } }, { name: 'area 3', props: { area: 3 } }, { name: 'area 6', props: { area: 6 } },
  { name: 'area 12', props: { area: 12 } }, { name: 'center question, all passed', props: { area: 'all' } },
  { name: 'Giving, lesson (12 areas)', props: { size: 168, total: 12 } }, { name: 'Giving, area 3 of 12', props: { area: 3, total: 12 } }, { name: 'Giving, all 12', props: { area: 'all', total: 12 } },
];
