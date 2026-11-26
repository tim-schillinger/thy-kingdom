// TKC-064 Tip, spec 0.1 (3-5z, frame-lock-11): a first-time tip that sits in the flow under what it points at, with an arrow up at it and a ✕.
// It pushes the page down and never covers it. In: after the page's own move, the room opens while the tip fades in and settles (§4a). Out: it fades and the room closes.
// The tip does not decide when it shows: `open` does (useStepTip, tips.ts). It takes no focus and blocks nothing.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Icon } from '../icon';
import { motionOff, ms, tipMotion } from '../motion';
import './tip.css';

export interface TipProps {
  /** Whether the tip should be showing. It comes in after the page's own move and goes out smoothly when this turns false. */
  open: boolean;
  message: string;
  /** The ✕'s name for a screen reader ("Close tip"). */
  closeLabel: string;
  onClose?: () => void;
  /** The text's id, so the button the tip points at can be described by it. */
  id?: string;
  /** Library and tests only: drawn at once, with no motion, and the ✕ in one of its states. */
  still?: boolean | 'pressed' | 'focus';
}
/** The page's own move in is `arrive` with a 50 ms delay and `motion-calm` (StepScreen M1): the tip waits for it. */
const afterPage = () => (motionOff() ? 0 : 50 + ms('calm'));

export function Tip({ open, message, closeLabel, onClose, id, still }: TipProps) {
  const [mounted, setMounted] = useState(!!still), [leaving, setLeaving] = useState(false);
  const wrap = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null), want = useRef(open);
  want.current = open;
  useEffect(() => {
    if (still) return;
    if (open) {
      setLeaving(false);
      if (mounted) return;
      const t = setTimeout(() => setMounted(true), afterPage());
      return () => clearTimeout(t);
    }
    if (mounted && !leaving) {
      setLeaving(true);
      const w = wrap.current, b = box.current;
      (w && b ? tipMotion(w, b, false) : Promise.resolve()).then(() => { if (!want.current) setMounted(false); setLeaving(false); });
    }
  }, [open]);
  useLayoutEffect(() => { if (mounted && !still && wrap.current && box.current) void tipMotion(wrap.current, box.current, true); }, [mounted]);
  if (!mounted) return null;
  return (
    <div class="tkc-tip" data-tkc="TKC-064" ref={wrap} data-leaving={leaving ? '' : undefined}>
      <div class="tkc-tip__room">
        <div class="tkc-tip__box" ref={box} role="status" data-part="box">
          <span class="tkc-tip__text" data-part="text" id={id}>{message}</span>
          <button type="button" class={`tkc-tip__x${typeof still === 'string' ? ` is-${still}` : ''}`} data-part="close" aria-label={closeLabel} onClick={onClose}><Icon n="x" size="18px" /></button>
        </div>
      </div>
    </div>
  );
}
