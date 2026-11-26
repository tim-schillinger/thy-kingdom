// TKC-042 LocatorMap 0.1 (placeholder look): a frame with a globe and one spot where the nation is. Small (48, in a row) or large (full width x 200, the nation page).
// `at` is the spot's place as a share of the globe's radius from its center (sample positions until the real map). `at: null` is a map with no spot data: the globe alone.
import './locatormap.css';
export interface LocatorMapProps { size: 'small' | 'large'; at?: { x: number; y: number } | null; label?: string }
export function LocatorMap({ size, at, label }: LocatorMapProps) {
  const frame = 200, g = size === 'small' ? 40 : 192, c = g / 2, r = c - (size === 'small' ? 2 : 2), rr = size === 'small' ? 48 : frame;
  const spot = at === null ? null : at ?? { x: 0.15, y: 0.45 };
  const f = (n: number) => +n.toFixed(2);
  return <span class={`tkc-lm is-${size}`} data-tkc="TKC-042" data-size={size} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
    <svg data-part="globe" width={g} height={g} viewBox={`0 0 ${g} ${g}`} aria-hidden="true" focusable="false">
      <circle class="oc" cx={f(c)} cy={f(c)} r={f(r)} /><ellipse class="gr" cx={f(c)} cy={f(c)} rx={f(r * 0.45)} ry={f(r)} />
      <line class="gr" x1={f(c - r)} y1={f(c)} x2={f(c + r)} y2={f(c)} /><line class="gr" x1={f(c - r * 0.87)} y1={f(c - r * 0.5)} x2={f(c + r * 0.87)} y2={f(c - r * 0.5)} />
      <line class="gr" x1={f(c - r * 0.87)} y1={f(c + r * 0.5)} x2={f(c + r * 0.87)} y2={f(c + r * 0.5)} />
      {spot && <circle data-part="spot" class="sp" cx={f(c + spot.x * r)} cy={f(c + spot.y * r)} r={f(Math.max(3, rr / 22))} />}</svg></span>;
}
