import type { VerseCardProps } from './VerseCard';
export const ID = 'TKC-033', NAME = 'VerseCard', VERSION = '0.1.5';
const W = 'World English Bible';
export const STATES: Array<{ name: string; props: VerseCardProps }> = [
  { name: "This Week's Verse", props: { label: 'This Week’s Verse', verse: 'Your word is a lamp to my feet, and a light for my path.', reference: 'Psalm 119:105', translation: W } },
  { name: 'Take This Into Your Day', props: { label: 'Take This Into Your Day', verse: 'For the Son of Man also came not to be served, but to serve, and to give his life as a ransom for many.', reference: 'Mark 10:45', translation: W } },
  { name: 'Take This Into Your Day (two verses, a week verse)', props: { label: 'Take This Into Your Day', verse: 'But I tell you who hear: love your enemies, do good to those who hate you, bless those who curse you, and pray for those who mistreat you.', reference: 'Luke 6:27–28', translation: W } },
  { name: 'no label (Day Complete)', props: { verse: 'It is a good thing to give thanks to Yahweh, to sing praises to your name, Most High, to proclaim your loving kindness in the morning, and your faithfulness every night, with the ten-stringed lute, with the harp, and with the melody of the lyre.', reference: 'Psalm 92:1–3', translation: W } },
];
STATES.push({ name: 'Memorize (Change)', props: { ...STATES[1].props, label: 'This Week’s Verse', change: true } });
