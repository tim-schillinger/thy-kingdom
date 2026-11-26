// Fold: the one body that opens and closes under a Disclosure row or a folding chapter title (M15, frame-lock-6 §4, 1805).
// The body stays mounted in a grid wrapper (rows 0fr → 1fr) and is `inert` while closed; foldMotion does the grow, fade and settle.
import type { ComponentChildren } from 'preact';
import { useLayoutEffect, useRef } from 'preact/hooks';
import { foldMotion } from './motion';
import './fold.css';
export function Fold({ open, children }: { open: boolean; children?: ComponentChildren }) {
  const wrap = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null), seen = useRef(false);
  useLayoutEffect(() => {
    const w = wrap.current, i = inner.current; if (!w || !i) return;
    (w as HTMLElement & { inert: boolean }).inert = !open;
    if (seen.current) foldMotion(w, i, open); else seen.current = true;
  }, [open]);
  return <div ref={wrap} class="tkc-fold" data-fold={open ? 'open' : 'closed'}><div ref={inner} class="tkc-fold__in">{children}</div></div>;
}
