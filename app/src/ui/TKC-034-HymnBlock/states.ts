import type { HymnBlockProps } from './HymnBlock';
export const ID = 'TKC-034', NAME = 'HymnBlock', VERSION = '0.1.1';
const HOLY = [{ n: 1, lines: ['Holy, holy, holy! Lord God Almighty!', 'Early in the morning our song shall rise to Thee;', 'Holy, holy, holy! merciful and mighty!', 'God in three Persons, blessed Trinity!'] },
  { n: 2, lines: ['Holy, holy, holy! all the saints adore Thee,', 'Casting down their golden crowns around the glassy sea;', 'Cherubim and seraphim falling down before Thee,', 'Which wert, and art, and evermore shalt be.'] }];
export const STATES: Array<{ name: string; props: HymnBlockProps }> = [
  { name: 'hymn (two stanzas)', props: { kind: 'hymn', stanzas: HOLY } }, { name: 'writer line', props: { kind: 'writer', writer: 'Reginald Heber, 1826' } },
];
