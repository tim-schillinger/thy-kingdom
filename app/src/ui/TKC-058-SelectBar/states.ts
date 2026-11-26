import type { SelectBarProps } from './SelectBar';
export const ID = 'TKC-058', NAME = 'SelectBar', VERSION = '0.1';
export const STATES: Array<{ name: string; props: SelectBarProps }> = [{ name: 'none picked', props: { picked: 0 } }, { name: 'two picked', props: { picked: 2 } }, { name: 'all three picked', props: { picked: 3 } }];
