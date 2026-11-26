// TKC-050 MetricTile 0.1: the four outward counts, two by two (spec C, D). The grid is part of the component; the screen owns the gutter.
import './metrictile.css';
export interface MetricTileProps {
  /** Tile order is fixed (1149): times you prayed for someone, nations prayed for, Bible chapters read, prayers answered. */
  tiles: Array<{ n: number; label: string }>;
}
/** At a count of exactly 1 the label reads singular (537). */
export const METRIC_ONE: Record<string, string> = { 'times you prayed for someone': 'time you prayed for someone', 'nations prayed for': 'nation prayed for', 'Bible chapters read': 'Bible chapter read', 'prayers answered': 'prayer answered' };
export const METRIC_LABELS = ['times you prayed for someone', 'nations prayed for', 'Bible chapters read', 'prayers answered'] as const;
export function MetricTile({ tiles }: MetricTileProps) {
  return <div class="tkc-mt-grid" data-tkc="TKC-050">
    {tiles.map((t) => { const n = t.n.toLocaleString('en-US');
      return <div class="tkc-mt" data-part="tile" key={t.label}><b class="tkc-mt__n" data-part="number">{n}</b><span class="tkc-mt__l" data-part="label">{t.n === 1 ? (METRIC_ONE[t.label] ?? t.label) : t.label}</span></div>; })}
  </div>;
}
