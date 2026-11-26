import type { ToastProps } from './Toast';
export const ID = 'TKC-018', NAME = 'Toast', VERSION = '0.3';
export const STATES: Array<{ name: string; props: ToastProps }> = [
  { name: 'undo', props: { message: 'Pastor James removed', action: 'Undo' } }, { name: 'undo, Undo pressed', props: { message: 'Pastor James removed', action: 'Undo', show: 'pressed' } },
  { name: 'undo, Undo focus', props: { message: 'Pastor James removed', action: 'Undo', show: 'focus' } }, { name: 'undo, days', props: { message: '3 days skipped', action: 'Undo' } },
  { name: 'note', props: { message: 'Saved to Leaders. Find all your lists in the Lists tab.' } }, { name: 'note, short', props: { message: 'Progress hidden.' } },
  { name: 'longest name', props: { message: 'Her pastor from the church on the corner of Elm and Fourth removed', action: 'Undo' } },
];
