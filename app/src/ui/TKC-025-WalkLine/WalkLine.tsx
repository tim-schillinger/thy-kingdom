// TKC-025 WalkLine, spec 0.4 (frame-lock-12 §5, 3427 y: `change` puts "Change" beside her evening time on the row itself; the row's link and Change are siblings, the link stretched over the row, so Change is never nested in it), spec 0.3: the walk that isn't leading, one quiet row (D5, 711); open all day, and look only on a future day (1614, 1617).
import { Icon } from '../icon';
import { motionOff } from '../motion';
import { StatusMark, type Mark } from '../TKC-021-StatusMark/StatusMark';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import './walkline.css';
export interface WalkLineProps { walk: 'Morning Walk' | 'Evening Walk'; mark: Mark; /** "7 of 7 done", or on a future day "You can start it tomorrow" */ line: string; show?: 'pressed' | 'focus'; /** M11: this row's ✓ has just been earned: it grows in as Today returns (450 ms, ease-settle; with Reduce Motion, a fade) */ play?: boolean; /** 0.4: before her evening starts, "Change" opens the evening-start sheet; its own 44 px target beside the time */ onChange?: () => void; onOpen?: () => void }
export function WalkLine({ walk, mark, line, show, play, onChange, onOpen }: WalkLineProps) {
  const name = mark === 'done' ? `${walk}, done, ${line.replace(' done', '')}. Open it again` : line.startsWith('You can start it') ? `${walk}, ${line[0].toLowerCase()}${line.slice(1)}. See its steps` : `${walk}, ${line}. Continue`;
  if (onChange) return <div class={`tkc-wl tkc-wl--split${show ? ` is-${show}` : ''}`} data-tkc="TKC-025">
    <span class="tkc-wl__circle" data-part="circle"><StatusMark mark={mark} size={16} /></span>
    <span class="tkc-wl__text"><a href="#walk" class="tkc-wl__open" aria-label={name} onClick={(e) => { e.preventDefault(); onOpen?.(); }}><b class="ty-body-strong" data-part="name">{walk}</b></a>
      <span class="ty-body-small" data-part="count">{line} · <TextLink label="Change" aria="Change when your evening starts" onOpen={onChange} /></span></span>
    <Icon n="caretRight" size="calc(20px*var(--ts))" cls="tkc-wl__chev" />
  </div>;
  return <a href="#walk" class={`tkc-wl${show ? ` is-${show}` : ''}`} data-tkc="TKC-025" aria-label={name} onClick={(e) => { e.preventDefault(); onOpen?.(); }}>
    <span class={`tkc-wl__circle${play && !motionOff() ? ' is-play' : ''}`} data-part="circle"><StatusMark mark={mark} size={16} /></span>
    <span class="tkc-wl__text"><b class="ty-body-strong" data-part="name">{walk}</b><span class="ty-body-small" data-part="count">{line}</span></span>
    <Icon n="caretRight" size="calc(20px*var(--ts))" cls="tkc-wl__chev" />
  </a>;
}
