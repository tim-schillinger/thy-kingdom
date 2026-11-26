// Morning steps 1 to 3 for the library page: the same pattern and parts the app's screen file uses, with the words written out
// so the page needs no engine or Bible data. Psalm 97:1-3 is the World English Bible text.
import { StepScreenView, StepSource, StepSourceUnder, StepPlayer, StepWords, StepWriter, StepOwn } from '../ui/patterns/StepScreen';
import { SourceLine } from '../ui/TKC-031-SourceLine/SourceLine';
import { StepInstruction } from '../ui/TKC-030-StepHeader/StepHeader';
import { AudioPlayer, AudioNote } from '../ui/TKC-051-AudioPlayer/AudioPlayer';
import { HymnBlock } from '../ui/TKC-034-HymnBlock/HymnBlock';
import { PrayerWords } from '../ui/TKC-035-PrayerWords/PrayerWords';
import { ReadingBlock } from '../ui/TKC-032-ReadingBlock/ReadingBlock';
import { Button } from '../ui/TKC-006-Button/Button';
import { SheetHost } from '../ui/patterns/SheetHost';
import { BottomSheet, Choices } from '../ui/TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../ui/TKC-012-ChoiceRow/ChoiceRow';
import { STEP_COPY, DOXOLOGY, OWN_LINES, HYMNAL_SHEET, HYMN_AUDIO } from '../copy';
import { SAMPLE_HYMN } from './book-samples';

const noop = () => {};
type Mark = 'open' | 'done' | 'skipped';
const segs = (cur: number, marks: Record<number, 'done' | 'skip'> = {}) => Array.from({ length: 7 }, (_, k) => (marks[k] ?? 'open')) as Array<'done' | 'skip' | 'open'>;
const foot = (mark: Mark, ahead = false, back = true) => ahead || mark !== 'open' ? { back, skip: false, next: 'Next', onBack: noop, onNext: noop } : { back, skip: true, next: 'Next', onBack: noop, onSkip: noop, onNext: noop };
const hymn = SAMPLE_HYMN;

function Sing({ mark = 'open', ahead = false, day = false, own = false, none = false }: { mark?: Mark; ahead?: boolean; day?: boolean; own?: boolean; none?: boolean }) {
  const c = STEP_COPY['am.sing'], s = DOXOLOGY;
  return <StepScreenView step="am.sing" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(0, mark === 'done' ? { 0: 'done' } : mark === 'skipped' ? { 0: 'skip' } : {}), current: 0, day: ahead ? 'Sun, Nov 1' : undefined, onClose: noop, onSteps: noop }}
    header={{ label: 'Sing', heading: c.heading, why: c.why, state: !ahead && mark !== 'open' ? mark : undefined, onUndo: noop, onInfo: undefined }}
    foot={foot(mark, ahead, false)}>
    <StepSource><SourceLine segments={own ? ['My own hymnal'] : day ? [s.title] : [hymn.title]} change /></StepSource>
    {own ? <StepOwn>{OWN_LINES.sing}</StepOwn> : <>
      {none && <StepPlayer><AudioNote link={HYMN_AUDIO.noneLink} linkAria={HYMN_AUDIO.noneAria} onLink={noop}>{HYMN_AUDIO.none}</AudioNote></StepPlayer>}
      {!day && !none && <StepPlayer><AudioPlayer state="idle" onToggle={noop} /><AudioNote>The recording can differ from the words here.</AudioNote></StepPlayer>}
      <StepInstruction text={day ? s.instruction : c.instruction!} />
      <HymnBlock stanzas={day ? [{ n: '', lines: s.stanzas[0] }] : hymn.stanzas.map((lines, k) => ({ n: k + 1, lines }))} />
      <StepWriter><HymnBlock kind="writer" writer={day ? 'Thomas Ken, 1695' : hymn.writer} /></StepWriter></>}
  </StepScreenView>;
}
function Ask({ mark = 'open', ahead = false }: { mark?: Mark; ahead?: boolean }) {
  const c = STEP_COPY['am.ask'];
  return <StepScreenView step="am.ask" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(1), current: 1, onClose: noop, onSteps: noop }}
    header={{ label: 'Ask to Hear', heading: c.heading, why: c.why, state: !ahead && mark !== 'open' ? mark : undefined, onUndo: noop }} foot={foot(mark, ahead)}>
    <StepInstruction text={c.instruction!} />
    <StepWords><PrayerWords kind="verse" text="Open my eyes, that I may see wondrous things out of your law." /></StepWords>
    <StepSourceUnder><SourceLine segments={['Psalm 119:18']} translation="World English Bible" onTranslation={noop} /></StepSourceUnder>
  </StepScreenView>;
}
function Psalm({ own = false }: { own?: boolean }) {
  const c = STEP_COPY['am.psalm'];
  return <StepScreenView step="am.psalm" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(2), current: 2, onClose: noop, onSteps: noop }}
    header={{ label: 'Psalm', heading: c.heading, why: c.why, onInfo: noop }} foot={foot('open')}>
    <StepSource><SourceLine segments={own ? ['Psalm 97', 'My own Bible'] : ['Psalm 97']} translation={own ? undefined : 'World English Bible'} onTranslation={noop} change onChange={noop} /></StepSource>
    {own ? <StepOwn>Read Psalm 97 in your Bible.</StepOwn>
      : <ReadingBlock kind="passage" verses={[{ n: '1', text: 'Yahweh reigns! Let the earth rejoice! Let the multitude of islands be glad!' }, { n: '2', text: 'Clouds and darkness are around him. Righteousness and justice are the foundation of his throne.' }, { n: '3', text: 'A fire goes before him, and burns up his adversaries all around.' }]} kjv={false} joins={false} afterTitle={false} />}
  </StepScreenView>;
}
function HymnalSheet({ own = false, rec = false }: { own?: boolean; rec?: boolean }) {
  return <><Sing own={own} /><SheetHost onClose={noop}><BottomSheet kind="pick" title={HYMNAL_SHEET.title} line={HYMNAL_SHEET.line} onClose={noop}>
    <Choices kind="full" label="Hymnal">
      <ChoiceRow name={HYMNAL_SHEET.app.name} line={HYMNAL_SHEET.app.line} chosen={!own && !rec} onChoose={noop} />
      <ChoiceRow name={HYMNAL_SHEET.recorded.name} line={HYMNAL_SHEET.recorded.line} chosen={rec} onChoose={noop} />
      <ChoiceRow name={HYMNAL_SHEET.own.name} line={HYMNAL_SHEET.own.line} chosen={own} onChoose={noop} /></Choices></BottomSheet></SheetHost></>;
}
export const STEPS: Array<{ name: string; sheet?: boolean; note: string; theme?: 'dark'; el: () => preact.JSX.Element }> = [
  { name: 'Sing', note: 'Wed Oct 14. Against the Review’s Sing phone.', el: () => <Sing /> },
  { name: 'Sing · dark', note: 'The Review’s dark Sing phone: parity checked.', theme: 'dark', el: () => <Sing /> },
  { name: 'Ask to Hear', note: 'Against the Review’s Ask tile. No approved whole phone.', el: () => <Ask /> },
  { name: 'Psalm', note: 'Psalm 97. No approved whole phone: by components and rule.', el: () => <Psalm /> },
  { name: 'Revisited · Done', note: 'G3 (TKC-003 0.6, TKC-030 0.6). No approved phone: your eye.', el: () => <Sing mark="done" /> },
  { name: 'Revisited · Skipped', note: 'G3. No approved phone: your eye.', el: () => <Ask mark="skipped" /> },
  { name: 'First Sunday', note: 'An ordinary Sing morning with the Doxology as its song (3163 a). No approved phone.', el: () => <Sing day /> },
  { name: 'My own hymnal', note: 'TKC-038: one line in the hymn’s place. No approved phone.', el: () => <Sing own /> },
  { name: 'My own Bible', note: 'TKC-038 on Psalm. No approved phone.', el: () => <Psalm own /> },
  { name: 'Change hymnal', sheet: true, note: 'Sing, Change: pick one, like Bible Readings (437). Copy is a best guess to approve. No approved phone: your eye.', el: () => <HymnalSheet /> },
  { name: 'Sing · no recording', note: 'TKC-051 0.3 (frame-lock-13): the quiet line and its link on a morning with no recording, In the App.', el: () => <Sing none /> },
  { name: 'Change hymnal · Hymns With a Recording', sheet: true, note: 'The same sheet with the third row chosen (frame-lock-13).', el: () => <HymnalSheet rec /> },
  { name: 'Change hymnal · My own', sheet: true, note: 'The same sheet with My Own Hymnal chosen.', el: () => <HymnalSheet own /> },
];
