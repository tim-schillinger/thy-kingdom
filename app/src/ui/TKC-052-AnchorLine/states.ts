import type { AnchorLineProps } from './AnchorLine';
export const ID = 'TKC-052', NAME = 'AnchorLine', VERSION = '0.2';
const Q: AnchorLineProps = { kind: 'quote', text: '“Let your Kingdom come. Let your will be done on earth as it is in heaven.”' };
const QR: AnchorLineProps = { kind: 'quote', text: '“You shall love the Lord your God with all your heart…”', reference: 'Luke 10:27' };
const R: AnchorLineProps = { kind: 'reference', text: 'On this morning’s reading · ', keep: 'Luke 8, Matthew 13' };
export const STATES: Array<{ name: string; props: AnchorLineProps }> = [
  { name: 'quote', props: Q }, { name: 'quote with reference', props: QR }, { name: 'reference', props: R },
  { name: 'note (Classic)', props: { kind: 'note', text: 'This morning: Psalm 97. Tonight, turn your heart back to worship.' } },
  { name: 'quote pressed', props: { ...Q, show: 'pressed' } }, { name: 'quote focus', props: { ...Q, show: 'focus' } },
  { name: 'with reference pressed', props: { ...QR, show: 'pressed' } }, { name: 'reference focus', props: { ...R, show: 'focus' } },
];
