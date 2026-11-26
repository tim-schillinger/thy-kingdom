// TKC-063 MovingHalf 0.2, card kind (the Guide's Go Deeper areas, 3306, 3307, 3312 A): the WHOLE card moves, one area at a time. Each area is a TKC-062 joined card whose top half is the TKC-061 plate
// (small line, the area's name, its one-line description) and whose lower half is the area's question and the check-in's move, all on one left edge. Swipe, or ‹ and › beside the dots (44 px each).
// The card arrives from the side she is going to (motion.ts arrive, the page-swap motion, as MovingHalf). Only the area she is on is in the page, so a screen reader reads that one. Her scroll stays where it is.
import { useLayoutEffect, useRef } from 'preact/hooks';
import { JoinedCard } from '../TKC-062-JoinedCard/JoinedCard';
import { WordMeaning } from '../TKC-061-WordMeaning/WordMeaning';
import { AskYourself } from '../TKC-039-AskYourself/AskYourself';
import { arrive } from '../motion';
import './movinghalf.css';
export interface SwipeSlide { eyebrow: string; name: string; meaning: string; question: string; move: string }
export interface SwipeCardProps {
  slides: SwipeSlide[];
  /** The area she is on, 1-based */
  at: number;
  onGo: (n: number) => void;
  /** The screen reader's names for the two buttons ("Previous area", "Next area") */
  prev: string; next: string;
}
export function SwipeCard({ slides, at, onGo, prev, next }: SwipeCardProps) {
  const slide = useRef<HTMLDivElement>(null), was = useRef(at), down = useRef<{ x: number; y: number } | null>(null);
  const n = slides.length, k = Math.min(Math.max(at, 1), n), s = slides[k - 1];
  useLayoutEffect(() => {
    const from = was.current; was.current = at;
    if (from !== at && slide.current) arrive(slide.current, { from: at > from ? 'right' : 'left', token: 'short', ease: 'gentle' });
  }, [at]);
  const go = (d: number) => { const to = at + d; if (to >= 1 && to <= n) onGo(to); };
  return <div class="tkc-mh tkc-mh--card" data-tkc="TKC-063" data-kind="card"
    onPointerDown={(e) => { down.current = { x: e.clientX, y: e.clientY }; }}
    onPointerUp={(e) => { const d = down.current; down.current = null; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) go(dx < 0 ? 1 : -1); }}
    onPointerCancel={() => { down.current = null; }}>
    <div class="tkc-mh__slide" data-part="slide" ref={slide}>
      <JoinedCard plate label={s.name} quietLabel top={<WordMeaning eyebrow={s.eyebrow} name={s.name} meaning={s.meaning} />}>
        <AskYourself kind="question" text={s.question} />
        <AskYourself kind="move" text={s.move} />
      </JoinedCard>
    </div>
    <div class="tkc-mh__nav" data-part="nav">
      <button type="button" class="tkc-mh__b" aria-label={prev} disabled={at <= 1} onClick={() => go(-1)}><span aria-hidden="true">‹</span></button>
      <div class="tkc-mh__dots" aria-hidden="true">{slides.map((_, j) => <i key={j} data-state={j === at - 1 ? 'on' : j < at - 1 ? 'done' : 'ahead'} />)}</div>
      <button type="button" class="tkc-mh__b" aria-label={next} disabled={at >= n} onClick={() => go(1)}><span aria-hidden="true">›</span></button>
    </div>
  </div>;
}
