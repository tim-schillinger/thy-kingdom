// TKC-055 GrowthPlant 0.1: the plant that gains a stage at each milestone and never shrinks. Drawn on an 80 x 80 grid (the studio's drawing, carried as paths).
// Small sizes (40, 32, 20) are the icon pass: each stage is cropped to its own square and its strokes are thickened (spec D).
import './growthplant.css';
export type PlantStage = 0 | 1 | 2 | 3 | 4;
export type PlantSize = 104 | 56 | 40 | 32 | 20;
export interface GrowthPlantProps {
  stage: PlantStage; size?: PlantSize;
  /** Progress only: the plant is an image with a name. Everywhere else it is hidden from screen readers. */
  label?: string;
  /** Progress only: grow, then sway, when something was gained since the last visit (H). */
  play?: boolean;
}
const CROP: Record<PlantStage, [number, number, number]> = { 0: [16, 30, 46], 1: [15, 20, 54], 2: [8, 8, 66], 3: [9, 9, 64], 4: [8, 10, 68] };
const CANOPY = 'M40 10c10 0 18 7 18 16 6 2 9 7 9 12 0 8-7 13-15 13H28c-8 0-15-5-15-13 0-5 3-10 9-12 0-9 8-16 18-16z';
const TREE = 'M40 72V40M40 56l-9-8M40 50l9-8';
const GROUND = 'M24 72h32';
const WATER = 'M12 77c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8 3 12 0 8-3 12 0';
export const STAGE_NAMES: Record<PlantStage, string> = {
  0: 'a sprout', 1: 'two leaves, grown at 7 days', 2: 'a young plant, grown at 30 days', 3: 'a small tree, grown at 100 days', 4: 'a tree bearing fruit, grown at 365 days' };

export function GrowthPlant({ stage, size = 104, label, play }: GrowthPlantProps) {
  const small = size <= 40;
  const [cx, cy, side] = small ? CROP[stage] : [0, 0, 80];
  // Stroke on screen: about 1.7 px at 20 px and 2.3 px at 32 and 40 px (unit width x px / 2.4 / scale).
  const k = small ? (size === 20 ? 1.7 : 2.3) / 2.4 / (size / side) : 1;
  const s = (w: number) => +(w * k).toFixed(4);
  const line = { fill: 'none', stroke: 'currentColor', 'stroke-width': s(2.4), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } as const;
  const leaf = { stroke: 'currentColor', 'stroke-width': s(2.2), 'stroke-linejoin': 'round' } as const;
  const outline = { ...leaf, fill: 'none' } as const;
  const body = (() => {
    if (stage === 0) return <><path d="M40 72V48" {...line} /><path class="lf" d="M40 55c0-8.5 6-13.5 15-13.5 0 8.5-6 13.5-15 13.5z" {...leaf} /><path d="M40 61c0-7-5-11-12-11 0 7 5 11 12 11z" {...outline} /><path d={GROUND} {...line} /></>;
    if (stage === 1) return <><path d="M40 70V38" {...line} /><path class="lf" d="M40 46c0-13 9-21 24-21 0 14-9 21-24 21z" {...leaf} /><path d="M40 54c0-11-7-17-20-17 0 11 7 17 20 17z" {...outline} /><path d="M26 70h28" {...line} /></>;
    if (stage === 2) return <><path d="M40 72V20" {...line} /><path class="lf" d="M40 50c0-11 8-17 20-17 0 11-8 17-20 17z" {...leaf} /><path d="M40 60c0-10-7-15-18-15 0 10 7 15 18 15z" {...outline} /><path d="M40 34c0-8 5-12 13-12 0 8-5 12-13 12z" {...outline} /><path class="lf" d="M40 40c0-8-6-12-14-12 0 8 6 12 14 12z" {...leaf} /><path class="lf" d="M40 21c-3-4-3-8 0-11 3 3 3 7 0 11z" {...leaf} /><path d={GROUND} {...line} /></>;
    const twenty = size === 20;
    return <><path class="lf2" d={CANOPY} {...leaf} /><path d={TREE} {...line} />
      {stage === 4 ? (twenty
        ? <><circle class="fr" cx="27" cy="36" r="8.5" /><circle class="fr" cx="47" cy="22" r="8.5" /><circle class="fr" cx="55" cy="41" r="8.5" /></>
        : <><circle class="fr" cx="29" cy="34" r="3" /><circle class="fr" cx="47" cy="24" r="3" /><circle class="fr" cx="53" cy="40" r="3" /><circle class="fr" cx="36" cy="22" r="2.6" />
          <path class="wt" d={WATER} fill="none" stroke-width="2" stroke-linecap="round" /></>) : null}
      <path d={GROUND} {...line} /></>;
  })();
  return <svg class={`tkc-plant${play ? ' is-play' : ''}`} data-tkc="TKC-055" data-stage={stage} viewBox={`${cx} ${cy} ${side} ${side}`} style={{ width: `${size}px`, height: `${size}px` }}
    role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">{body}</svg>;
}
