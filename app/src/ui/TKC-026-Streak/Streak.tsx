// TKC-026 Streak 0.3: the chip on Today's title line (710, 1139), the badge on Day Complete (692) and the Progress card. The plant is TKC-055 at the earned stage everywhere (1163).
// Motion (count-up, join glow, the milestone moment) belongs to the screens that play it; this file draws the still kinds.
import { GrowthPlant, type PlantStage } from '../TKC-055-GrowthPlant/GrowthPlant';
import { motionOff } from '../motion';
import './streak.css';
const JOIN_PTS = Array.from({ length: 8 }, (_, k) => k);   // eight dots (TKC-026 H)
export interface StreakProps {
  kind?: 'chip' | 'badge' | 'card';
  days: number;
  /** The highest milestone ever earned (never shrinks, 1156). */ stage?: PlantStage;
  /** card: the longest streak there ever was. None on a first streak below 2 (1154). */ longest?: number;
  /** card, motion only: two streaks joined, so a soft glow rises behind the number and eight dots fly out (H). Not drawn with Reduce Motion (592). */ join?: boolean;
  show?: 'pressed' | 'focus'; onOpen?: () => void;
}
const fmt = (n: number) => n.toLocaleString('en-US');
export function Streak({ kind = 'chip', days, stage: earned, longest, join, show, onOpen }: StreakProps) {
  // Until the screen passes the earned stage, the streak itself says the least that was earned (7, 30, 100, 365).
  const stage: PlantStage = earned ?? (days >= 365 ? 4 : days >= 100 ? 3 : days >= 30 ? 2 : days >= 7 ? 1 : 0);
  if (kind === 'badge') return <span class="tkc-badge" data-tkc="TKC-026" data-kind="badge" aria-label={`${fmt(days)}-day streak`}>
    <GrowthPlant stage={stage} size={40} /><b class="tkc-badge__n" data-part="number">{fmt(days)}</b><span class="tkc-badge__u" data-part="unit">day streak</span></span>;
  if (kind === 'card') return <div class="tkc-scard" data-tkc="TKC-026" data-kind="card">
    <GrowthPlant stage={stage} size={104} label={`Your plant: ${['a sprout', 'two leaves, grown at 7 days', 'a young plant, grown at 30 days', 'a small tree, grown at 100 days', 'a tree bearing fruit, grown at 365 days'][stage]}`} />
    {days >= 2 ? <><span class="tkc-scard__nw">
      {join && !motionOff() && <><span class="tkc-scard__glow" data-part="glow" aria-hidden="true" />
        {JOIN_PTS.map((k) => { const a = k * Math.PI / 4, d = k % 2 ? 74 : 64; return <i class="tkc-scard__pt" data-part="particle" aria-hidden="true" style={{ '--dx': `${(Math.cos(a) * d).toFixed(0)}px`, '--dy': `${(Math.sin(a) * d).toFixed(0)}px`, animationDelay: `${600 + 30 * k}ms` }} />; })}</>}
      <span class="tkc-scard__n" data-part="number">{fmt(days)}</span></span><span class="tkc-scard__u" data-part="unit">days in a row</span></>
      : <p class="tkc-scard__g" data-part="grow">Each day you finish both walks, your streak grows.</p>}
    {longest && longest >= 2 ? <p class="tkc-scard__l" data-part="longest">{days >= longest ? 'Your longest streak yet' : `Longest streak: ${fmt(longest)} days`}</p> : null}
  </div>;
  const label = days >= 2 ? `${fmt(days)}-day streak` : 'Progress';
  return <button type="button" class={`tkc-chip ty-label${show ? ` is-${show}` : ''}`} data-tkc="TKC-026" data-kind="chip"
    aria-label={days >= 2 ? `${label}. Open Progress` : 'Progress'} onClick={onOpen}>
    <GrowthPlant stage={stage} size={20} /><span data-part="label">{label}</span></button>;
}
