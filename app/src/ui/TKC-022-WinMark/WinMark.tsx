// TKC-022 WinMark 0.4: celebrates a finished walk, day or answered prayer with light, never a score.
// small 64 (walk, answered prayer) · large 96 (day) · mini 18 (Answered cards: no burst, no motion). Glyph: check or hands.
// Decorative: hidden from screen readers. Motion (H) plays once on arrival and settles; reduce motion fades the whole mark.
import { Icon } from '../icon';
import { motionOff } from '../motion';
import './winmark.css';
export interface WinMarkProps {
  size: 'small' | 'large' | 'mini';
  glyph?: 'check' | 'hands';
  /** false: no burst, glow or particles (tracking off, 880) */
  burst?: boolean;
  /** true: plays the arrival motion */
  play?: boolean;
}
const PTS = Array.from({ length: 14 }, (_, k) => k);   // 14 dots (motion-lock §7)
export function WinMark({ size, glyph = 'check', burst = true, play = false }: WinMarkProps) {
  if (size === 'mini') return <span class="tkc-wm-mini" data-tkc="TKC-022" data-size="mini" aria-hidden="true"><Icon n="hands" size="calc(13px*min(var(--ts), 1.5))" /></span>;
  const far = size === 'large' ? [78, 86] : [54, 62];
  return <div class={`tkc-wm${size === 'large' ? ' is-lg' : ''}${play && !motionOff() ? ' is-play' : ''}${burst ? '' : ' is-still'}`} data-tkc="TKC-022" data-size={size} data-glyph={glyph} aria-hidden="true">
    {burst && <span class="tkc-wm__burst" data-part="burst" />}
    {burst && PTS.map((k) => { const a = k * Math.PI / 7, d = far[k % 2]; return <i class="tkc-wm__pt" style={{ '--dx': `${(Math.cos(a) * d).toFixed(0)}px`, '--dy': `${(Math.sin(a) * d).toFixed(0)}px`, animationDelay: `calc(var(--motion-quick) * ${(6 + k) / 6})` }} />; })}
    <span class="tkc-wm__disc" data-part="disc">
      {glyph === 'check'
        ? <svg class="tkc-wm__ck" viewBox="0 0 64 64" data-part="glyph"><path pathLength="1" d="M21 33l8 8 15-16" /></svg>
        : <Icon n="hands" size={size === 'large' ? '48px' : '34px'} />}
    </span>
  </div>;
}
