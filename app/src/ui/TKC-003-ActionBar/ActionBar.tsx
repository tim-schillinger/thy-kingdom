// TKC-003 ActionBar, spec 0.9 (frame-lock-7 part 2, C4, 3016 y): stacked, Back sits at the left edge and Skip at the right, the main button full width under them; a link under the primary stays under it. 0.8 (the link on Back and Skip's row) is retired. Spec 0.7 (the primary names where it goes, 52 px edged Back and Skip); 0.5: a walk's foot. Every button is TKC-006 (Back and Skip quiet, Next primary).
// The bottom padding is space-3 plus the phone's safe area (--safe-bottom; the Review drew 16 for a home bar).
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Button } from '../TKC-006-Button/Button';
import './actionbar.css';

export interface ActionBarProps {
  /** The row: Back (left out on step 1), Skip (left out where nothing can be skipped), then the primary. */
  back?: boolean;
  skip?: boolean;
  next?: string;
  /** 0.7 (571, 572): where the primary goes ("Proverb", "Question 2", "Still Open"). When given it replaces `next` and an arrow follows. Leave out for Complete, Done, Amen. */
  to?: string;
  /** Completion foot (Day Complete): one primary with a second line, full width (862). */
  sub?: string;
  /** A quiet full-width button under the row or the primary: "Back to Today" (895), "Complete Evening Walk" (0.4). */
  below?: string;
  /** 'step' (the row) · 'completion' (Amen) · 'two' (primary over quiet Back to Today) */
  foot?: 'step' | 'completion' | 'two';
  /** Library and tests only: which button shows a state. */
  show?: { which: 'back' | 'skip' | 'next' | 'below'; state: 'pressed' | 'focus' };
  /** At 200% text when Next would need more than two lines (E): Back and Skip on a row, Next under them. */
  stacked?: boolean;
  onBack?: () => void; onSkip?: () => void; onNext?: () => void; onBelow?: () => void;
}

export function ActionBar({ back = true, skip = true, next = 'Next', to, sub, below, foot = 'step', show, stacked, onBack, onSkip, onNext, onBelow }: ActionBarProps) {
  const st = (w: string) => (show?.which === w ? show.state : undefined);
  // E (200% text): stack when Next can't hold its label in two lines on the row (the Review fits it by script, data-evfit).
  const row = useRef<HTMLDivElement>(null); const [fit, setFit] = useState(false); const isStackedRef = useRef(false);
  useLayoutEffect(() => {
    const el = row.current; if (!el || stacked !== undefined) return;
    // Measure a hidden copy of the row at its natural width; never touch the rendered row.
    const check = () => {
      const c = el.cloneNode(true) as HTMLElement;
      Object.assign(c.style, { position: 'absolute', visibility: 'hidden', width: 'max-content', flexWrap: 'nowrap', left: '0', top: '0' });
      el.parentElement!.appendChild(c); const need = c.getBoundingClientRect().width; c.remove();
      const lab = el.querySelector<HTMLElement>('[data-kind="primary"] [data-part="label"]');
      const lh = lab ? parseFloat(getComputedStyle(lab).lineHeight) : 0;
      setFit(need > el.clientWidth + 1 || (!!lab && !isStackedRef.current && lab.offsetHeight > 2 * lh + 1));
    };
    check(); document.fonts.ready.then(check); const ro = new ResizeObserver(check); ro.observe(el); el.querySelectorAll('[data-part="label"]').forEach((l) => ro.observe(l)); return () => ro.disconnect();
  }, [next, to, back, skip, stacked]);
  const isStacked = stacked ?? fit; isStackedRef.current = isStacked;
  if (foot !== 'step') return (
    <div class="tkc-ab" data-tkc="TKC-003" data-foot={foot}>
      <Button kind="primary" place="actionbar" label={next} sub={sub} show={st('next')} onClick={onNext} />
      {below && <Button kind="quiet" width="full" label={below} show={st('below')} onClick={onBelow} />}
    </div>
  );
  return (
    <div class="tkc-ab" data-tkc="TKC-003" data-foot="step" data-stacked={isStacked ? '' : undefined}>
      <div class="tkc-ab__row" ref={row}>
        {back && <Button kind="quiet" place="actionbar" label="Back" which="back" show={st('back')} onClick={onBack} />}
        {skip && <Button kind="quiet" place="actionbar" label="Skip" which="skip" show={st('skip')} onClick={onSkip} />}
        <Button kind="primary" place="actionbar" label={to ?? next} arrow={!!to} show={st('next')} onClick={onNext} />
      </div>
      {below && <Button kind="quiet" width="full" label={below} show={st('below')} onClick={onBelow} />}
    </div>
  );
}
