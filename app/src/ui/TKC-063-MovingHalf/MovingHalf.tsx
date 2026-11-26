// TKC-063 MovingHalf 0.1 (frame-lock-7 R7, 1864, 1872 y): several questions about one verse. The top half of the card stays; this lower half moves, one question at a time.
// Swipe, or ‹ and › beside the dots (44 px each); the main button keeps naming the next question, so nobody is stranded. Six even dots; "Question n of 6" sits in the card.
// Only the question she is on is in the page, so a screen reader reads that one (R12). The move is the page-swap motion (motion-lock M1: the new half arrives from the side she is going
// to, 48 px and a fade; Reduce Motion is one fade, in motion.ts). Her scroll stays where it is (1023).
import { useLayoutEffect, useRef } from 'preact/hooks';
import { CardLabel } from '../TKC-062-JoinedCard/JoinedCard';
import { AskYourself } from '../TKC-039-AskYourself/AskYourself';
import { arrive } from '../motion';
import './movinghalf.css';
export interface MovingHalfProps {
  /** Each question: the group's name (the label), the question and the thing to do */
  slides: Array<{ label: string; question: string; move: string }>;
  /** band lock (R18): the label is in the card's band, so the head shows only the count */
  bare?: boolean;
  /** The question she is on, 1-based */
  at: number;
  onGo: (n: number) => void;
  /** "Question 2 of 6" */
  count: (n: number, of: number) => string;
}
export function MovingHalf({ slides, at, onGo, count, bare }: MovingHalfProps) {
  const slide = useRef<HTMLDivElement>(null), was = useRef(at), down = useRef<{ x: number; y: number } | null>(null);
  const n = slides.length, s = slides[Math.min(Math.max(at, 1), n) - 1];
  useLayoutEffect(() => {
    const from = was.current; was.current = at;
    if (from !== at && slide.current) arrive(slide.current, { from: at > from ? 'right' : 'left', token: 'short', ease: 'gentle' });
  }, [at]);
  const go = (d: number) => { const to = at + d; if (to >= 1 && to <= n) onGo(to); };
  return <div class="tkc-mh" data-tkc="TKC-063"
    onPointerDown={(e) => { down.current = { x: e.clientX, y: e.clientY }; }}
    onPointerUp={(e) => { const d = down.current; down.current = null; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(dx < 0 ? 1 : -1); }}
    onPointerCancel={() => { down.current = null; }}>
    <div class="tkc-mh__slide" data-part="slide" ref={slide}>
      <div class={`tkc-mh__head${bare ? ' is-bare' : ''}`}>{!bare && <CardLabel>{s.label}</CardLabel>}<span class="tkc-mh__count" data-part="count">{count(at, n)}</span></div>
      <AskYourself kind="question" text={s.question} />
      <AskYourself kind="move" text={s.move} />
    </div>
    <div class="tkc-mh__nav" data-part="nav">
      <button type="button" class="tkc-mh__b" aria-label="Previous question" disabled={at <= 1} onClick={() => go(-1)}><span aria-hidden="true">‹</span></button>
      <div class="tkc-mh__dots" aria-hidden="true">{slides.map((_, k) => <i key={k} data-state={k === at - 1 ? 'on' : k < at - 1 ? 'done' : 'ahead'} />)}</div>
      <button type="button" class="tkc-mh__b" aria-label="Next question" disabled={at >= n} onClick={() => go(1)}><span aria-hidden="true">›</span></button>
    </div>
  </div>;
}
