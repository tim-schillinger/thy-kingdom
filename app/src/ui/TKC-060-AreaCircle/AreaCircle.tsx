// TKC-060 AreaCircle 0.1.1 ("the circle of 12"): where she is in a Go Deeper check-in's areas, and that nothing is scored (1196). 12 arcs (Giving is 12 again, 514), 25 degrees each with a 5 degree gap, starting just right of 12 o'clock.
import { Icon } from '../icon';
import './areacircle.css';
export interface AreaCircleProps {
  /** 96: an area or the center question. 168: the lesson (the same drawing, 1.75 times). */ size?: 96 | 168;
  /** The area she is on (1 to total), "all" at the center question, or none on the lesson. */ area?: number | 'all';
  /** 12 (Giving is 12 areas again, 514). */ total?: number;
}
const C = 48, R = 38;
const pt = (deg: number) => `${(C + R * Math.sin(deg * Math.PI / 180)).toFixed(2)} ${(C - R * Math.cos(deg * Math.PI / 180)).toFixed(2)}`;
export function arcs(total: number) { const step = 360 / total, span = step - 5;
  return Array.from({ length: total }, (_, k) => `M${pt(2.5 + k * step)}A${R} ${R} 0 0 1 ${pt(2.5 + k * step + span)}`); }
export function AreaCircle({ size = 96, area, total = 12 }: AreaCircleProps) {
  const cls = (k: number) => area === 'all' ? 'rd' : area == null ? 'ro' : k + 1 < area ? 'rd' : k + 1 === area ? 'rc' : 'ro';
  const name = area === 'all' ? `All ${total} areas` : area == null ? `${total} areas, none started` : `Area ${area} of ${total}`;
  return <div class="tkc-ac" data-tkc="TKC-060" data-size={size} role="img" aria-label={name}>
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 96 96"><g fill="none" stroke-width="10">{arcs(total).map((d, k) => <path class={cls(k)} d={d} key={k} />)}</g></svg>
    <span class="tkc-ac__c" data-part="center">{area === 'all' ? <Icon n="checkReg" size="24px" /> : area == null ? <>{total}<small>areas</small></> : `${area} of ${total}`}</span>
  </div>;
}
