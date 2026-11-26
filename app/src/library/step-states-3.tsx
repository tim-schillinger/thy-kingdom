// Evening steps 1 to 4 for the library page: the same pattern and parts the app's EveningStep screen uses, with the words written out
// (Psalm 141:2 in the World English Bible, the Review's own samples for the three books) so the page needs no engine or Bible data.
import { StepScreenView, StepMeaning, StepMissing, StepSource, StepSourceUnder, StepWords, StepOwn, StepNote, StepCredit } from '../ui/patterns/StepScreen';
import { SheetHost } from '../ui/patterns/SheetHost';
import { SourceLine } from '../ui/TKC-031-SourceLine/SourceLine';
import { StepInstruction } from '../ui/TKC-030-StepHeader/StepHeader';
import { PrayerWords } from '../ui/TKC-035-PrayerWords/PrayerWords';
import { ReadingBlock } from '../ui/TKC-032-ReadingBlock/ReadingBlock';
import { AnchorLine } from '../ui/TKC-052-AnchorLine/AnchorLine';
import { BottomSheet, Choices } from '../ui/TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../ui/TKC-012-ChoiceRow/ChoiceRow';
import { EmptyState } from '../ui/TKC-019-EmptyState/EmptyState';
import { STEP_COPY, BOOK_SHEETS, OWN_LINES, TURN_MEANING } from '../copy';
import { SAMPLE_CLASSIC, EVENING_SAMPLE } from './book-samples';

const noop = () => {};
const WEB = 'World English Bible';
const segs = (marks: Record<number, 'done' | 'skip'> = {}) => Array.from({ length: 7 }, (_, k) => (marks[k] ?? 'open')) as Array<'done' | 'skip' | 'open'>;
const before = (n: number) => Object.fromEntries(Array.from({ length: n }, (_, k) => [k, 'done' as const]));
type Mark = 'open' | 'done' | 'skipped';
const foot = (revisited: boolean, back = true) => (revisited ? { back, skip: false, next: 'Next', onBack: noop, onNext: noop } : { back, skip: true, next: 'Next', onBack: noop, onSkip: noop, onNext: noop });
const PSA141 = 'Let my prayer be set before you like incense; the lifting up of my hands like the evening sacrifice.';
const romans = EVENING_SAMPLE.notes['ROM 12'], luk = EVENING_SAMPLE.dig['LUK 8'], mat = EVENING_SAMPLE.dig['MAT 13'];

type P = { step: 'pm.turn' | 'pm.classic' | 'pm.notes' | 'pm.dig'; k: number; reference?: string; mark?: Mark; sheet?: 'book' | 'cue' | 'own'; own?: boolean; day?: string; children: preact.ComponentChildren };
function Frame({ step, k, reference, mark = 'open', sheet, own, day, children }: P) {
  const c = STEP_COPY[step]; const revisited = mark !== 'open';
  const book = step === 'pm.classic' ? BOOK_SHEETS.classic : step === 'pm.notes' ? BOOK_SHEETS.studyNotes : BOOK_SHEETS.digDeeper;
  return <><StepScreenView step={step} wash="dusk" bar={{ walk: 'Evening Walk', steps: segs(before(k)), current: k, day, reference, onClose: noop, onSteps: noop }}
    header={{ label: step === 'pm.turn' ? 'Turn to God' : step === 'pm.classic' ? 'Classic' : step === 'pm.notes' ? 'Study Notes' : 'Dig Deeper', heading: c.heading, why: c.why, state: revisited ? mark : undefined, onUndo: noop }} foot={foot(revisited, k > 0)}>
    {children}
  </StepScreenView>
  {sheet === 'book' && <SheetHost onClose={noop}><BottomSheet kind="pick" title={book.title} line={book.line} onClose={noop}>
    <Choices kind="full" label={book.title}>
      <ChoiceRow name={book.app.name} line={book.app.line} chosen={!own} onChoose={noop} />
      <ChoiceRow name={book.own.name} line={book.own.line} chosen={!!own} onChoose={noop} /></Choices></BottomSheet></SheetHost>}
  {sheet === 'cue' && <SheetHost onClose={noop}><BottomSheet kind="read" title="Luke 8, Matthew 13" onClose={noop}>
    <ReadingBlock kind="title" text="Luke 8" first /><ReadingBlock kind="passage" joins afterTitle verses={[{ n: '1', text: 'Soon afterwards, he went about through cities and villages, preaching and bringing the good news of God’s Kingdom. With him were the twelve,' }]} />
    <ReadingBlock kind="title" text="Matthew 13" /><ReadingBlock kind="passage" afterTitle verses={[{ n: '1', text: 'On that day Jesus went out of the house and sat by the seaside.' }]} /></BottomSheet></SheetHost>}</>;
}
function Turn({ mark = 'open' }: { mark?: Mark }) {
  return <Frame step="pm.turn" k={0} reference="Psalm 141:2" mark={mark}>
    <StepInstruction text={STEP_COPY['pm.turn'].instruction!} />
    <StepWords><PrayerWords kind="verse" text={PSA141} /></StepWords>
    <StepSourceUnder><SourceLine segments={['Psalm 141:2']} translation={WEB} onTranslation={noop} /></StepSourceUnder>
    <StepMeaning><PrayerWords kind="meaning" text={TURN_MEANING} /></StepMeaning>
  </Frame>;
}
function Classic({ own = false, mark = 'open' as Mark, sheet }: { own?: boolean; mark?: Mark; sheet?: 'book' }) {
  const s = SAMPLE_CLASSIC;
  return <Frame step="pm.classic" k={1} reference={own ? undefined : s.part} mark={mark} sheet={sheet} own={own}>
    <StepSource><SourceLine segments={own ? ['My own book'] : [s.title, s.part]} change onChange={noop} /></StepSource>
    {own ? <StepOwn>{OWN_LINES.classic}</StepOwn> : <><ReadingBlock kind="prose" paragraphs={s.paras} /><StepCredit><ReadingBlock kind="credit" text={s.writer} /></StepCredit></>}
  </Frame>;
}
function Notes({ own = false, missing = false }: { own?: boolean; missing?: boolean }) {
  return <Frame step="pm.notes" k={2} reference={missing ? undefined : 'Romans 12'}>
    <StepSource><SourceLine segments={own ? ['My own book'] : ['Study notes', 'Romans 12–14']} change onChange={noop} /></StepSource>
    {missing ? <StepMissing><EmptyState kind="missing" line="The app doesn’t have notes for Matthew 7–9. If you have a study Bible, read its notes on these chapters, then go on." actionLabel="Use My Own Study Notes" onAction={noop} /></StepMissing> : own ? <StepOwn>Read your study notes on Romans 12–14.</StepOwn> : <>
      <ReadingBlock kind="title" text="Romans 12" first />
      <ReadingBlock kind="helps" afterTitle blocks={romans.map((n) => ({ kind: 'note' as const, verse: n.verse, lemma: n.lemma, text: n.text }))} />
      <StepCredit><ReadingBlock kind="credit" text={EVENING_SAMPLE.notesCredit} /></StepCredit></>}
  </Frame>;
}
function Dig({ own = false, sheet, missing = false }: { own?: boolean; sheet?: 'cue'; missing?: boolean }) {
  const sec = (a: typeof luk) => a.flatMap((x) => [{ kind: 'section' as const, text: x.section }, { kind: 'note' as const, text: x.text }]);
  return <Frame step="pm.dig" k={3} reference="Luke 8" sheet={sheet}>
    <StepNote><AnchorLine kind="reference" text="On this morning’s reading · " keep="Luke 8, Matthew 13" onOpen={noop} /></StepNote>
    <StepSource after="anchor"><SourceLine segments={own ? ['My own book'] : ['Commentary']} change onChange={noop} /></StepSource>
    {missing ? <StepMissing><EmptyState kind="missing" line="The app doesn’t have a commentary on Luke 8 and Matthew 13. If you have one, read what it says about these chapters, then go on." actionLabel="Use My Own Commentary" onAction={noop} /></StepMissing> : own ? <StepOwn>Read your commentary on Luke 8 and Matthew 13.</StepOwn> : <>
      <ReadingBlock kind="title" text="Luke 8" first /><ReadingBlock kind="helps" afterTitle joins blocks={sec(luk)} />
      <ReadingBlock kind="title" text="Matthew 13" /><ReadingBlock kind="helps" afterTitle blocks={sec(mat)} />
      <StepCredit><ReadingBlock kind="credit" text={EVENING_SAMPLE.digCredit} /></StepCredit></>}
  </Frame>;
}

type S = { name: string; sheet?: boolean; note: string; theme?: 'dark'; el: () => preact.JSX.Element };
export const STEPS3: S[] = [
  { name: 'Turn to God', note: 'The Ask to Hear pattern with Psalm 141:2 (907), and the meaning line under it (566, 574).', el: () => <Turn /> },
  { name: 'Classic', note: 'The Review’s approved phone (1009): the note line, the book, the letter, the credit. Scroll it.', el: () => <Classic /> },
  { name: 'Classic · revisited', note: 'A step she already finished reads “✓ Done · Undo” and the foot is Back · Next.', el: () => <Classic mark="done" /> },
  { name: 'Classic · dark', theme: 'dark', note: 'The same step in dark.', el: () => <Classic /> },
  { name: 'Classic · My own book', note: 'TKC-038: one line in the reading’s place. No approved phone.', el: () => <Classic own /> },
  { name: 'Change · Classic', sheet: true, note: 'Pick one, like Bible Readings. The words are a best guess to approve (451).', el: () => <Classic sheet="book" /> },
  { name: 'Study Notes', note: 'The approved phone (1009). Romans 12 is the Review’s sample until the books are chosen (908).', el: () => <Notes /> },
  { name: 'Study Notes · missing', note: '575: no notes for these chapters. The line, then a button to use her own; no chapter title above it.', el: () => <Notes missing /> },
  { name: 'Study Notes · My own book', note: 'TKC-038: “Read your study notes on Romans 12–14.” No approved phone.', el: () => <Notes own /> },
  { name: 'Dig Deeper', note: 'The approved phone (1009). Tap the line to see what opens. Scroll it.', el: () => <Dig /> },
  { name: 'Dig Deeper · reading sheet', sheet: true, note: 'The line opens this morning’s reading again, like Respond’s cues. No approved phone.', el: () => <Dig sheet="cue" /> },
  { name: 'Dig Deeper · missing', note: '575: no commentary for these chapters. The same use as Study Notes.', el: () => <Dig missing /> },
  { name: 'Dig Deeper · My own book', note: 'TKC-038: “Read your commentary on Luke 8 and Matthew 13.” No approved phone.', el: () => <Dig own /> },
];
