import type { ReadingBlockProps } from './ReadingBlock';
export const ID = 'TKC-032', NAME = 'ReadingBlock', VERSION = '0.7';
const PS97 = [{ n: '1', text: 'Yahweh reigns! Let the earth rejoice! Let the multitude of islands be glad!' }, { n: '2', text: 'Clouds and darkness are around him. Righteousness and justice are the foundation of his throne.' }, { n: '3', text: 'A fire goes before him, and burns up his adversaries on every side.' }];
const KJV = [{ n: '1', text: 'The LORD reigneth; let the earth rejoice; let the multitude of isles be glad thereof.' }, { n: '2', text: 'Clouds and darkness are round about him: righteousness and judgment are the habitation of his throne.' }];
const L8 = [{ n: '55', text: 'Her spirit returned, and she rose up immediately. He commanded that something be given to her to eat.' }, { n: '56', text: 'Her parents were amazed, but he commanded them to tell no one what had been done.' }];
const M13 = [{ n: '1', text: 'On that day Jesus went out of the house and sat by the seaside.' }, { n: '2', text: 'Great multitudes gathered to him, so that he entered into a boat and sat; and all the multitude stood on the beach.' }];
export const STATES: Array<{ name: string; props: ReadingBlockProps }> = [
  { name: 'one passage (WEB)', props: { kind: 'passage', verses: PS97 } }, { name: 'one passage (KJV, LORD)', props: { kind: 'passage', verses: KJV, kjv: true } },
  { name: 'stacked passages', props: { kind: 'stacked', parts: [{ title: 'Luke 8', verses: L8 }, { title: 'Matthew 13', verses: M13 }] } },
  { name: 'prose (Classic)', props: { kind: 'prose', paragraphs: ['Having found in many books different methods of going to GOD, and divers practices of the spiritual life, I thought this would serve rather to puzzle me.', 'I made it my business to give myself up to GOD, and to renounce everything that I thought was not of Him.'] } },
  { name: 'helps (Study Notes)', props: { kind: 'helps', blocks: [{ kind: 'note', verse: 'Verse 1', lemma: 'I beseech you.', text: 'The apostle, having finished the argument of this Epistle, proceeds now to close it with a practical application.' }, { kind: 'note', verse: 'Verse 1', lemma: 'That ye present.', text: 'The word used here commonly denotes the action of bringing and presenting an animal before an altar.' }] } },
  { name: 'helps (Dig Deeper section)', props: { kind: 'helps', blocks: [{ kind: 'section', text: 'Verses 1–3 · The ministry of Christ' }, { kind: 'note', text: 'We are here told what Christ made the constant business of his life, it was teaching the gospel.' }] } },
  { name: 'chapter title', props: { kind: 'title', text: 'Romans 12', first: true } }, { name: 'writer credit', props: { kind: 'credit', text: 'Albert Barnes, Notes on the New Testament' } },
];
