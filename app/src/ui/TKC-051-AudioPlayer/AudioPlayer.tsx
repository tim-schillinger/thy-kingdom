// TKC-051 AudioPlayer 0.3 (frame-lock-13: AudioNote takes an optional link). 0.2 (frame-lock-9, 3-5p): let her hear the hymn while the words stay the main thing. One pill bar under the SourceLine (815). 0.2: the time reads "0:00 / 2:45" (3371),
// the button can show loading (a quiet spinner), and the note "The recording can differ from the words here." sits under the pill (AudioNote, 381). Never autoplays.
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Icon } from '../icon';
import './audioplayer.css';
export interface AudioPlayerProps {
  state?: 'idle' | 'loading' | 'playing' | 'paused'; /** Time played, "1:12" */ time?: string; /** The recording's length, "2:45" */ length?: string; /** 0 to 1: how much of the track is filled */ progress?: number; label?: string;
  show?: 'pressed' | 'focus'; onToggle?: () => void;
}
export function AudioPlayer({ state = 'idle', time = '0:00', length = '2:45', progress = 0, label = 'Listen to the hymn', show, onToggle }: AudioPlayerProps) {
  const playing = state === 'playing', loading = state === 'loading';
  // At large text the pill grows: past 64 px it takes the card's corners instead of a full pill (spec E, 200% text)
  const box = useRef<HTMLDivElement>(null); const [tall, setTall] = useState(false);
  useLayoutEffect(() => { const el = box.current; if (!el) return; const m = () => setTall(el.getBoundingClientRect().height > 64); m(); const ro = new ResizeObserver(m); ro.observe(el); return () => ro.disconnect(); }, [label, time, length]);
  return <div class={`tkc-ap${tall ? ' is-tall' : ''}`} data-tkc="TKC-051" data-state={state} ref={box}>
    <button type="button" class={`tkc-ap__pp${show ? ` is-${show}` : ''}`} data-part="button" aria-label={playing || loading ? 'Pause the hymn' : 'Play the hymn'} aria-pressed={playing || loading} aria-busy={loading || undefined} onClick={onToggle}>
      {loading ? <span class="tkc-ap__spin" data-part="spinner" aria-hidden="true" /> : <Icon n={playing ? 'pauseFill' : 'playFill'} size="18px" />}</button>
    <div class="tkc-ap__meta" data-part="meta">
      <span class="tkc-ap__row" data-part="row"><span class="tkc-ap__lab" data-part="label">{label}</span><span class="tkc-ap__time" data-part="time" aria-label={`${time} played of ${length}`}>{time} / {length}</span></span>
      <span class="tkc-ap__track" data-part="track" aria-hidden="true"><i style={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }} /></span>
    </div>
  </div>;
}
/** 0.2 (381): one line under the pill, `space-2` below it, the caption type in ink-2. Not a link, not a button, no icon; a screen reader reads it after the player. */
/** 0.3 (frame-lock-13 §5 B, 440 y): an optional link after the note, in the source line's own link style (caption, ink-2, underlined, a 44 px tap area by padding). The note and its link read as one quiet line; at 390 and 320 the link wraps under. */
export const AudioNote = ({ children, link, onLink, linkAria }: { children: ComponentChildren; link?: string; onLink?: () => void; linkAria?: string }) =>
  <p class="tkc-ap-note ty-caption" data-tkc="TKC-051" data-part="note">{children}{link && <>{' '}<a href="#hymnal" class="tkc-ap-note__lk" data-part="note-link" aria-label={linkAria} onClick={(e) => { e.preventDefault(); onLink?.(); }}>{link}</a></>}</p>;
