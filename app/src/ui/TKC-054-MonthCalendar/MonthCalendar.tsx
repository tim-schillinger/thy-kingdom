// TKC-054 MonthCalendar 0.2: one month at a time, each day showing how its walks went (walk kind) or just the day she picks (date kind). Returns the month row, the grid and the key as siblings
// (they sit in a TKC-004 pick-one sheet under its header); the grid is the component's root.
import { Icon } from '../icon';
import './monthcalendar.css';
export interface CalDay { n: number; mark?: 'both' | 'one'; today?: boolean; out?: boolean; pick?: boolean; show?: 'pressed' | 'focus' }
export interface MonthCalendarProps {
  kind?: 'walk' | 'date';
  /** "October 2026" */ month: string;
  /** Blank cells before the 1st (0 to 6, Sunday first, 575). */ lead: number;
  days: CalDay[];
  /** The arrows at the end of the range stay in place, faded (E). */ prevOff?: boolean; nextOff?: boolean;
  /** Names for the arrows: "September" / "November". */ prevName?: string; nextName?: string;
  arrowShow?: 'prev-pressed' | 'next-pressed' | 'prev-focus' | 'next-focus';
  onDay?: (n: number) => void; onMonth?: (step: -1 | 1) => void;
}
const WD = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const Half = () => <i class="tkc-cal__half" />;
export function MonthCalendar({ kind = 'walk', month, lead, days, prevOff, nextOff, prevName = 'September', nextName = 'November', arrowShow, onDay, onMonth }: MonthCalendarProps) {
  const name = month.split(' ')[0];
  const say = (d: CalDay) => `${WEEKDAYS[(lead + d.n - 1) % 7]}, ${name} ${d.n}${d.today ? ', today' : ''}${kind === 'date' ? (d.pick ? ', picked' : '') : d.mark === 'both' ? ', both walks' : d.mark === 'one' ? ', one walk' : ''}`;
  return <>
    <div class="tkc-cal__row" data-kind={kind}>
      <b class="tkc-cal__month" data-part="month">{month}</b>
      <span class="tkc-cal__nav">
        {prevOff ? <span class="tkc-cal__arr is-off" role="img" aria-label="No earlier months"><Icon n="caretLeft" size="20px" /></span>
          : <button type="button" class={`tkc-cal__arr${arrowShow === 'prev-pressed' ? ' is-pressed' : arrowShow === 'prev-focus' ? ' is-focus' : ''}`} aria-label={`Previous month, ${prevName}`} onClick={() => onMonth?.(-1)}><Icon n="caretLeft" size="20px" /></button>}
        {nextOff ? <span class="tkc-cal__arr is-off" role="img" aria-label="No later months"><Icon n="caretRight" size="20px" /></span>
          : <button type="button" class={`tkc-cal__arr${arrowShow === 'next-pressed' ? ' is-pressed' : arrowShow === 'next-focus' ? ' is-focus' : ''}`} aria-label={`Next month, ${nextName}`} onClick={() => onMonth?.(1)}><Icon n="caretRight" size="20px" /></button>}
      </span>
    </div>
    <div class="tkc-cal" data-part="cal" data-tkc="TKC-054" data-kind={kind} role="grid" aria-label={month}>
      {WD.map((w, k) => <span class="tkc-cal__wd" data-part="weekday" aria-hidden="true" key={k}>{w}</span>)}
      {Array.from({ length: lead }, (_, k) => <span aria-hidden="true" key={`b${k}`} />)}
      {days.map((d) => d.out
        ? <span class="tkc-cal__d is-out" data-part="day" role="img" aria-label={`${WEEKDAYS[(lead + d.n - 1) % 7]}, ${name} ${d.n}, not open yet`} key={d.n}><span class="tkc-cal__n" data-part="numeral">{d.n}</span><span class="tkc-cal__m" data-part="mark" /></span>
        : <button type="button" class={`tkc-cal__d${d.today ? ' is-today' : ''}${d.pick ? ' is-pick' : ''}${d.show ? ` is-${d.show}` : ''}`} data-part="day" aria-label={say(d)} onClick={() => onDay?.(d.n)} key={d.n}>
          <span class="tkc-cal__n" data-part="numeral">{d.n}</span>
          <span class="tkc-cal__m" data-part="mark">{kind === 'walk' ? d.mark === 'both' ? <Icon n="check" size="calc(14px*var(--ts))" /> : d.mark === 'one' ? <Half /> : null : null}</span></button>)}
    </div>
    {kind === 'walk' ? <div class="tkc-cal__key" aria-hidden="true"><span><span class="tkc-cal__m"><Icon n="check" size="calc(14px*var(--ts))" /></span>Both walks</span><span><span class="tkc-cal__m"><Half /></span>One walk</span></div> : null}
  </>;
}
