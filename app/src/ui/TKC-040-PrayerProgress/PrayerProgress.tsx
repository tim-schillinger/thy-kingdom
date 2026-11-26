// TKC-040 PrayerProgress 0.2 (frame-lock-10 §2, 3402 a, 3405 y): five cells for Prayer's five parts. A part she has been on and left: a done pill with a check. This part: a wide honey pill
// that names it. Any other: an empty pill with its number. With `onGo` every cell is a button that opens its part (44 px tall hit area, the look stays 32 px); without it (the library, Go Deeper) the cells are look-only.
// Saturday's part 3 is named "Requests".
import { Icon } from '../icon';
import './prayerprogress.css';
export const PARTS = ['Father', 'Kingdom', 'People', 'Trust', 'Amen'] as const;
export interface PrayerProgressProps {
  part: 1 | 2 | 3 | 4 | 5; name?: string;
  /** The parts that show a check (ones she has left, in any direction). Default: the parts before this one (how 0.1 drew it). */
  done?: readonly number[];
  /** Makes every cell a button; called with the part number. The current cell does nothing. */
  onGo?: (n: 1 | 2 | 3 | 4 | 5) => void;
}
export function PrayerProgress({ part, name, done, onGo }: PrayerProgressProps) {
  const nameOf = (n: number) => n === part && name ? name : PARTS[n - 1];
  const label = nameOf(part);
  const isDone = (n: number) => n !== part && (done ? done.includes(n) : n < part);
  const look = (n: number) => n === part
    ? <span class="tkc-ptk__c is-now" data-part="cell"><span class="tkc-ptk__nm" data-part="name">{label}</span></span>
    : isDone(n) ? <span class="tkc-ptk__c is-done" data-part="cell"><Icon n="checkReg" size="calc(16px*min(var(--ts), 1.5))" /></span>
    : <span class="tkc-ptk__c" data-part="cell">{n}</span>;
  if (!onGo) {
    return <div class="tkc-ptk" data-tkc="TKC-040" role="img" aria-label={`Prayer, part ${part} of 5, ${label}`}>{[1, 2, 3, 4, 5].map((n) => <span key={n} class={`tkc-ptk__c${n === part ? ' is-now' : isDone(n) ? ' is-done' : ''}`} data-part="cell">
      {n === part ? <span class="tkc-ptk__nm" data-part="name">{label}</span> : isDone(n) ? <Icon n="checkReg" size="calc(16px*min(var(--ts), 1.5))" /> : n}</span>)}</div>;
  }
  return <div class="tkc-ptk" data-tkc="TKC-040" data-tappable="" role="group" aria-label="Prayer parts">
    {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" class={`tkc-ptk__b${n === part ? ' is-cur' : ''}`} data-part="cell-button" data-n={n}
      aria-current={n === part ? 'step' : undefined}
      aria-label={`Part ${n} of 5, ${nameOf(n)}${n === part ? ', current' : isDone(n) ? ', done' : ''}`}
      onClick={() => { if (n !== part) onGo(n as 1 | 2 | 3 | 4 | 5); }}>{look(n)}</button>)}
  </div>;
}
