// TKC-021 StatusMark 0.3: one glyph that says where something stands (done, part, open, skipped).
// done = Phosphor Check Bold, skipped = Phosphor Minus Bold, part = a true circle with the left half filled,
// open = a 1.5 px ring. Tone: accent (success-ink) or muted (ink-2). Open and skipped are always muted.
import { Icon } from '../icon';
import './statusmark.css';
export type Mark = 'done' | 'part' | 'open' | 'skip' | 'none';
export type MarkTone = 'accent' | 'muted';
export interface StatusMarkProps { mark: Mark; size: 12 | 14 | 16 | 20; tone?: MarkTone; /** true: the size follows the text size (week strip, step list) */ scaled?: boolean }
export function StatusMark({ mark, size, tone, scaled = true }: StatusMarkProps) {
  if (mark === 'none') return null;
  const t: MarkTone = mark === 'open' || mark === 'skip' ? 'muted' : (tone ?? 'accent');
  const sz = scaled ? `calc(${size}px*var(--ts))` : `${size}px`;
  return <span class="tkc-sm" data-tkc="TKC-021" data-mark={mark} data-tone={t} style={{ '--sz': sz }} aria-hidden="true">
    {mark === 'done' ? <Icon n="check" size="100%" /> : mark === 'skip' ? <Icon n="minus" size="100%" /> : <i class="tkc-sm__ring" data-part="ring" />}
  </span>;
}
