import type { PrayerProgressProps } from './PrayerProgress';
export const ID = 'TKC-040', NAME = 'PrayerProgress', VERSION = '0.2';
export const STATES: Array<{ name: string; props: PrayerProgressProps }> = [
  { name: 'part 1 Father', props: { part: 1 } }, { name: 'part 2 Kingdom', props: { part: 2 } }, { name: 'part 3 People', props: { part: 3 } },
  { name: 'part 3 Saturday (Requests)', props: { part: 3, name: 'Requests' } }, { name: 'part 4 Trust', props: { part: 4 } }, { name: 'part 5 Amen', props: { part: 5 } },
];
