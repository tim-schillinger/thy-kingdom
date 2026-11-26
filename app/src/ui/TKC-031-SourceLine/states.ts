import type { SourceLineProps } from './SourceLine';
export const ID = 'TKC-031', NAME = 'SourceLine', VERSION = '0.4';
export const STATES: Array<{ name: string; props: SourceLineProps }> = [
  { name: 'scripture', props: { reference: 'Psalm 97', translation: 'World English Bible' } },
  { name: 'scripture + Change', props: { reference: 'Psalm 97', translation: 'World English Bible', change: true } },
  { name: 'several passages', props: { reference: 'Luke 8, Matthew 13', translation: 'King James Version', change: true } },
  { name: 'work (hymn) + Change', props: { segments: ['Hymn 113', 'Holy, Holy, Holy'], change: true } },
  { name: 'my own', props: { segments: ['Hymn 113', 'My own hymnal'], change: true } },
  { name: 'book + Change', props: { segments: ['The Practice of the Presence of God', 'First Letter'], change: true } },
  { name: 'data', props: { segments: ['Facts from Wikidata'] } },
  { name: 'translation pressed', props: { reference: 'Psalm 97', translation: 'World English Bible', show: { link: 'translation', state: 'pressed' } } },
  { name: 'translation focus', props: { reference: 'Psalm 97', translation: 'World English Bible', show: { link: 'translation', state: 'focus' } } },
  { name: 'Change pressed', props: { reference: 'Psalm 97', translation: 'World English Bible', change: true, show: { link: 'change', state: 'pressed' } } },
  { name: 'Change focus', props: { reference: 'Psalm 97', translation: 'World English Bible', change: true, show: { link: 'change', state: 'focus' } } },
];
