// TKC-005 StepListSheet, spec 0.2 (a `look` form for a future day, 646, 1617), 0.1: every step of the walk in order with where she stands, so she can jump to any in one tap.
// A TKC-004 pick one whose rows are its own. The foot (Today only) repeats the walk card's button, pinned on a band.
import { Icon } from '../icon';
import { BottomSheet } from '../TKC-004-BottomSheet/BottomSheet';
import { Button } from '../TKC-006-Button/Button';
import { Tag } from '../TKC-017-Tag/Tag';
import './steplist.css';

export type StepMark = 'done' | 'skipped' | 'current' | 'none';
export interface StepRow { n: number; name: string; ref?: string; mark?: StepMark }
export interface StepListSheetProps {
  walk: 'Morning Walk' | 'Evening Walk';
  steps: StepRow[];
  /** Today only: the card's button, repeated ("Start Your Walk", "Next: Sing"). */
  foot?: { label: string; sub: string };
  /** 0.2: `look` is a future day's list: plain list items, no buttons, no pressed look, no marks, no foot. */
  look?: boolean;
  show?: { row?: number; state: 'pressed' | 'focus' };
  onPick?: (n: number) => void;
  onClose?: () => void;
}

const SAY = { done: 'done', skipped: 'skipped', current: 'you’re here', none: '' } as const;
export function StepListSheet({ walk, steps, foot, look, show, onPick, onClose }: StepListSheetProps) {
  return <BottomSheet kind="pick" tkc="TKC-005" title={walk} label={`${walk} steps`} focusTitle={look} onClose={onClose}>
    <ul class="tkc-steps" aria-label={`Steps of the ${walk}`} data-part="list">
      {steps.map((s, i) => { const mark = s.mark ?? 'none'; const st = show?.row === i ? show.state : undefined;
        const Row = look ? 'div' : 'button';
        return <li key={s.n}><Row {...(look ? {} : { type: 'button', onClick: () => onPick?.(s.n), 'aria-label': [`Step ${s.n}`, s.name, s.ref, SAY[mark]].filter(Boolean).join(', ') })}
          class={`tkc-steps__row${st && !look ? ` is-${st}` : ''}`} data-part="row" data-mark={look ? 'none' : mark} data-look={look ? '' : undefined}>
          <span class="tkc-steps__num" data-part="num" data-now={mark === 'current' ? '' : undefined} aria-hidden="true">{s.n}</span>
          <span class="tkc-steps__rb"><span class="tkc-steps__tn"><b data-part="name">{s.name}</b>{s.ref ? <span class="tkc-steps__ref" data-part="ref">{s.ref}</span> : null}</span>
            {!look && mark !== 'none' ? <span class="tkc-steps__mk" data-part="mark">
              {mark === 'done' ? <span class="tkc-steps__done" role="img" aria-label="done"><Icon n="check" size="calc(14px*min(var(--ts),1.5))" /></span> : null}
              {mark === 'skipped' ? <span class="tkc-steps__skip">Skipped<span class="tkc-steps__dash" aria-hidden="true" /></span> : null}
              {mark === 'current' ? <Tag label="You’re here" /> : null}</span> : null}</span></Row></li>; })}
    </ul>
    {foot && !look ? <div class="tkc-steps__fband" data-part="foot"><Button label={foot.label} sub={foot.sub} kind="primary" /></div> : null}
  </BottomSheet>;
}
