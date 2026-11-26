import type { TopBarProps, Seg } from './TopBar';
import { TIP } from '../../copy';
export const ID = 'TKC-002', NAME = 'TopBar', VERSION = '0.16';
const S = (d: number, extra: Seg[] = []): Seg[] => { const a: Seg[] = Array(7).fill('open'); for (let i = 0; i < d; i++) a[i] = 'done'; extra.forEach((x, i) => { if (x !== 'open') a[i] = x; }); return a; };
const M = 'Morning Walk' as const, E = 'Evening Walk' as const;
export const STATES: Array<{ name: string; props: TopBarProps }> = [
  { name: 'step 1', props: { walk: M, step: 'Sing', steps: S(0), current: 0, reference: 'Holy, Holy, Holy' } },
  { name: 'step 3, with the book button (C1)', props: { walk: M, step: 'Psalm', steps: S(2), current: 2, reference: 'Psalm 97', onAbout: () => {} } },
  { name: 'step 3, the first-time tip under the book (0.16, TKC-064)', props: { walk: M, step: 'Psalm', steps: S(2), current: 2, reference: 'Psalm 97', onAbout: () => {}, tip: { open: true, still: true, message: TIP.about, closeLabel: TIP.close, onClose: () => {} } } },
  { name: 'step 3 (two done)', props: { walk: M, step: 'Psalm', steps: S(2), current: 2, reference: 'Psalm 97' } },
  { name: 'step 7', props: { walk: E, step: 'Meditate · Question 1 of 6', steps: S(6), current: 6, reference: 'Mark 10:45' } },
  { name: 'a skipped step', props: { walk: M, step: 'Proverb', steps: S(3, ['done', 'skip', 'done']), current: 3, reference: 'Proverbs 14' } },
  { name: 'revisited, done', props: { walk: M, step: 'Psalm', state: 'done', steps: S(3), current: 2, reference: 'Psalm 97' } },
  { name: 'revisited, skipped', props: { walk: M, step: 'Proverb', state: 'skipped', steps: S(3, ['done', 'skip', 'done']), current: 3, reference: 'Proverbs 14' } },
  { name: 'revisited, menu open', props: { walk: M, step: 'Psalm', state: 'done', steps: S(3), current: 2, reference: 'Psalm 97', show: 'menu' } },
  { name: 'scrolled, reading line 40%', props: { walk: M, step: 'Psalm', steps: S(2), current: 2, scrolled: true, reference: 'Psalm 97', reading: 40 } },
  { name: 'past day', props: { walk: E, step: 'Turn to God', steps: S(0), current: 0, day: 'Wed, Dec 30' } },
  { name: 'reopened, all done', props: { walk: M, step: 'Bible Reading', state: 'done', steps: S(7), current: 4, reference: 'Luke 8' } },
  { name: 'end · all done', props: { walk: M, steps: S(7) } },
  { name: 'end · one skipped', props: { walk: E, steps: S(7, ['done', 'done', 'done', 'done', 'skip']) } },
  { name: 'end · Still Open (two open)', props: { walk: M, steps: ['open', 'open', 'done', 'done', 'done', 'done', 'done'] } },
  { name: '✕ pressed', props: { walk: M, steps: S(2), current: 2, show: 'x-pressed' } },
  { name: 'book button pressed', props: { walk: M, steps: S(2), current: 2, onAbout: () => {}, show: 'about-pressed' } },
  { name: 'book button focus', props: { walk: M, steps: S(2), current: 2, onAbout: () => {}, show: 'about-focus' } },
  { name: '✕ focus', props: { walk: M, steps: S(2), current: 2, show: 'x-focus' } },
  { name: 'path pressed', props: { walk: M, steps: S(2), current: 2, show: 'mid-pressed' } },
  { name: 'path focus', props: { walk: M, steps: S(2), current: 2, show: 'mid-focus' } },
  { name: 'page · ‹ Lists', props: { variant: 'page', label: 'Lists' } }, { name: 'page · ‹ Neighbors', props: { variant: 'page', label: 'Neighbors' } },
  { name: 'page · ‹ Prayer, scrolled', props: { variant: 'page', label: 'Prayer', scrolled: true } }, { name: 'page · answered record, ⋯', props: { variant: 'page', label: 'Lists', more: true } },
  { name: 'page · ‹ pressed', props: { variant: 'page', label: 'Lists', show: 'back-pressed' } }, { name: 'page · ‹ focus', props: { variant: 'page', label: 'Lists', show: 'back-focus' } },
  { name: 'page · ⋯ pressed', props: { variant: 'page', label: 'Lists', more: true, show: 'more-pressed' } }, { name: 'page · ⋯ focus', props: { variant: 'page', label: 'Lists', more: true, show: 'more-focus' } },
  { name: 'run · Start Here 1 of 5', props: { variant: 'run', label: '1 of 5' } }, { name: 'run · Giving', props: { variant: 'run', label: 'Giving' } },
  { name: 'run · The Lord’s Prayer', props: { variant: 'run', label: 'The Lord’s Prayer' } }, { name: 'run · ✕ pressed', props: { variant: 'run', label: '1 of 5', show: 'x-pressed' } },
];
