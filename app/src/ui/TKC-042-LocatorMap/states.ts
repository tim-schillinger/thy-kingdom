import type { LocatorMapProps } from './LocatorMap';
export const ID = 'TKC-042', NAME = 'LocatorMap', VERSION = '0.1';
export const STATES: Array<{ name: string; props: LocatorMapProps }> = [
  { name: 'small', props: { size: 'small' } }, { name: 'large', props: { size: 'large', label: 'Map showing where Botswana is, in Southern Africa' } },
  { name: 'small, no spot data', props: { size: 'small', at: null } }, { name: 'large, no spot data', props: { size: 'large', at: null } },
];
