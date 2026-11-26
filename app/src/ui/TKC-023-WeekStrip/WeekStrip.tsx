// TKC-023 WeekStrip, spec 0.2: Sunday to Saturday (575); today a honey disc; another day viewed, an ink ring (719).
import { StatusMark, type Mark } from '../TKC-021-StatusMark/StatusMark';
import './weekstrip.css';
export interface Day { date: string; /** "Wednesday, October 14" for the name */ long: string; mark: Mark; today?: boolean; viewed?: boolean; future?: boolean }
const WD = [['Sun', 'S'], ['Mon', 'M'], ['Tue', 'T'], ['Wed', 'W'], ['Thu', 'T'], ['Fri', 'F'], ['Sat', 'S']];
const WORD: Record<Mark, string> = { done: 'done', part: 'part done', open: 'still open', skip: 'skipped', none: '' };
export interface WeekStripProps { days: Day[]; show?: { i: number; state: 'pressed' | 'focus' }; onPick?: (i: number) => void }
export function WeekStrip({ days, show, onPick }: WeekStripProps) {
  return <div class="tkc-ws" data-tkc="TKC-023" role="list">
    {days.map((d, i) => <div role="listitem" key={i} class="tkc-ws__li"><button type="button" class={`tkc-ws__cell${show?.i === i ? ` is-${show.state}` : ''}`} data-part="cell"
      data-today={d.today ? '' : undefined} data-viewed={d.viewed ? '' : undefined} aria-current={d.today ? 'date' : undefined} aria-pressed={d.viewed ? 'true' : undefined}
      aria-label={[d.long, d.today && 'today', d.future ? '' : WORD[d.mark]].filter(Boolean).join(', ')} onClick={() => onPick?.(i)}>
      <span class="tkc-ws__wd ty-caption" data-part="wd"><span class="tkc-ws__full">{WD[i][0]}</span><span class="tkc-ws__one">{WD[i][1]}</span></span>
      <span class="tkc-ws__wn ty-body" data-part="wn"><span>{d.date}</span></span>
      <span class="tkc-ws__wm" data-part="slot">{!d.future && <StatusMark mark={d.mark} size={12} />}</span>
    </button></div>)}
  </div>;
}
