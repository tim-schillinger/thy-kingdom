// Every state TKC-006's spec lists (E), with the real labels it names (F). The library page shows each one,
// light and dark, at 100% and 200% text. "n/a" states in the spec (disabled, loading, data and day states)
// are not drawn because the spec says they don't exist.
import type { ButtonProps } from './Button';

export const ID = 'TKC-006';
export const NAME = 'Button';
export const VERSION = '0.7.1';

type S = { name: string; props: ButtonProps };
const kinds: S[] = [
  { name: 'primary', props: { kind: 'primary', label: 'Next' } },
  { name: 'primary · second line', props: { kind: 'primary', label: 'Start Your Walk', sub: 'Next: Sing' } },
  { name: 'primary · Amen', props: { kind: 'primary', label: 'Amen', sub: 'Complete Day' } },
  { name: 'primary · longest label (wraps at 320 or 200%)', props: { kind: 'primary', label: "Sing Today's Hymn Instead" } },
  { name: 'primary · in ActionBar (TKC-003)', props: { kind: 'primary', label: 'Complete Evening Walk', place: 'actionbar' } },
  { name: 'secondary', props: { kind: 'secondary', label: 'Edit' } },
  { name: 'secondary · leading icon', props: { kind: 'secondary', label: 'Add Person', icon: 'plus' } },
  { name: 'secondary · Erase Everything (0.6)', props: { kind: 'secondary', label: 'Erase Everything' } },
  { name: 'quiet · fit', props: { kind: 'quiet', label: 'See Tomorrow’s Walks' } },
  { name: 'quiet · full under a primary (0.2)', props: { kind: 'quiet', label: 'Back to Today', width: 'full' } },
  { name: 'quiet · Remove (destructive is quiet)', props: { kind: 'quiet', label: 'Remove' } },
  { name: 'quiet · sheet Cancel (0.4)', props: { kind: 'quiet', label: 'Cancel', place: 'sheet-header' } },
  { name: 'outline (0.5)', props: { kind: 'outline', label: 'Start Here' } },
  { name: 'small outline (0.3)', props: { kind: 'small-outline', label: '+ Add Person' } },
  { name: 'small secondary (0.6)', props: { kind: 'small-secondary', label: 'Save a Backup' } },
];
const states: Array<[string, ButtonProps['show']]> = [['default', undefined], ['pressed', 'pressed'], ['focus', 'focus']];

export const STATES: S[] = kinds.flatMap((k) => states.map(([n, show]) => ({ name: `${k.name} · ${n}`, props: { ...k.props, show } })));
