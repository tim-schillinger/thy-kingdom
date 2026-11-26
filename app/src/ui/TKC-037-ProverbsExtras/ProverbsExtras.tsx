// TKC-037 ProverbsExtras 0.1 (Specced; 1421, 1422, 1427, 1428): in a short month, the extra chapters that finish Proverbs, one tap at a time.
// offer: TKC-059's card ("Proverbs Has 31 Chapters", the line, outline "Read Proverbs N Too", ✕). row: the compact row, ◐ on pace, amber ✓ finished.
// Never a count of what she didn't read (rule 14). The month's rule lives in the engine (plan.proverbExtrasLeft), not here.
import { StartHereCard } from '../TKC-059-StartHereCard/StartHereCard';
import { StatusMark } from '../TKC-021-StatusMark/StatusMark';
import './proverbsextras.css';
export interface ProverbsExtrasProps {
  kind: 'offer' | 'row';
  /** offer: extras still to read this month (1, 2 or 3) */ left?: number;
  /** offer: the next chapter from her place */ next?: number;
  /** offer: the month's name and length ("November", 30), for the line (578) */ monthName?: string; days?: number;
  /** row: finished (amber ✓) or on pace (◐) */ finished?: boolean; /** row: how many extra chapters the month had (1, 2 or 3), for the words (587) */ extras?: number;
  show?: { which: 'x' | 'button'; state: 'pressed' | 'focus' };
  onRead?: () => void; onHide?: () => void;
}
/** 578: every claim holds for someone who started mid-month; the line says what the month is and what one more chapter does. */
export const offerLine = (left: number, monthName = 'This month', days = 30) => `${monthName} has ${days} days. Read ${left === 1 ? 'one extra chapter' : `${left} extra chapters`}, and the month still ends on chapter 31.`;
export function ProverbsExtras({ kind, left = 1, next = 5, monthName, days, finished = false, extras = 1, show, onRead, onHide }: ProverbsExtrasProps) {
  if (kind === 'offer') return <div class="tkc-px" data-tkc="TKC-037" data-kind="offer" role="region" aria-label="Proverbs Has 31 Chapters">
    <StartHereCard kind="proverbs" text={{ line: offerLine(left, monthName, days), button: `Read Proverbs ${next} Too` }} show={show} onGo={onRead} onClose={onHide} /></div>;
  return <p class="tkc-px tkc-px--row" data-tkc="TKC-037" data-kind="row" data-state={finished ? 'finished' : 'on-pace'}>
    <StatusMark mark={finished ? 'done' : 'part'} size={12} /><span class="tkc-px__words" data-part="words">{finished ? 'You read to the end of Proverbs.' : extras === 1 ? 'You’ve read this month’s extra chapter.' : 'You’ve read this month’s extra chapters.'}</span></p>;
}
