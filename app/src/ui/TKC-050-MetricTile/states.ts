import type { MetricTileProps } from './MetricTile';
import { METRIC_LABELS as L } from './MetricTile';
export const ID = 'TKC-050', NAME = 'MetricTile', VERSION = '0.1';
const tiles = (n: number[]) => n.map((v, i) => ({ n: v, label: L[i] }));
export const STATES: Array<{ name: string; props: MetricTileProps }> = [
  { name: 'typical (Ray)', props: { tiles: tiles([212, 53, 214, 4]) } }, { name: 'zero (Rachel before night one)', props: { tiles: tiles([0, 0, 0, 0]) } },
  { name: 'one', props: { tiles: tiles([1, 1, 1, 1]) } }, { name: 'many', props: { tiles: tiles([1204, 212, 12480, 4]) } },
];
