// TKC-056 MilestonePath 0.1: the four milestones (7, 30, 100, 365 days), the earned ones filled, the next one a soft dashed ring (spec C, D).
import './milestonepath.css';
export interface MilestonePathProps {
  /** How many are earned, 0 to 4 (always the first N: they are earned for good, 1156). */
  earned: 0 | 1 | 2 | 3 | 4;
  /** The header's right words: "77 days to 100", "1 day to 7", "Next: 100 days", "All four reached". */
  far: string;
  /** Progress only: the track fills and the next ring pulses once when something was gained (H). */
  play?: boolean;
}
const DAYS = [7, 30, 100, 365];
export function MilestonePath({ earned, far, play }: MilestonePathProps) {
  const fill = earned <= 1 ? 0 : ((earned - 1) / 3) * 100;
  return <div class={`tkc-mp${play ? ' is-play' : ''}`} data-tkc="TKC-056">
    <div class="tkc-mp__h"><b data-part="head">Milestones</b><span class="tkc-mp__far" data-part="far">{far}</span></div>
    <ol class="tkc-mp__path" aria-label="Milestones" data-part="path">
      <span class="tkc-mp__trk" aria-hidden="true" data-part="track"><i data-part="fill" style={{ width: `${fill}%` }} /></span>
      {DAYS.map((d, k) => { const st = k < earned ? 'got' : k === earned ? 'next' : 'later';
        return <li class={`tkc-mp__d is-${st}`} data-part="disc" data-state={st} key={d} aria-label={`${d} days${st === 'got' ? ', earned' : st === 'next' ? ', next' : ''}`}>{d}{st === 'next' ? <span class="tkc-mp__pls" aria-hidden="true" /> : null}</li>; })}
    </ol>
  </div>;
}
