// Morning steps 4 to 7 and Walk Complete for the library page: the same pattern and parts the app's screen files use, with the words
// written out (World English Bible: Proverbs 14, Luke 8, Matthew 13) so the page needs no engine or Bible data.
import { StepScreenView, StepSource, StepOwn, StepPrompt, StepVerse, StepTips, StepExtras } from '../ui/patterns/StepScreen';
import { WalkCompleteView } from '../ui/patterns/WalkComplete';
import { SourceLine } from '../ui/TKC-031-SourceLine/SourceLine';
import { StepInstruction } from '../ui/TKC-030-StepHeader/StepHeader';
import { ReadingBlock } from '../ui/TKC-032-ReadingBlock/ReadingBlock';
import { SpokenPrompt } from '../ui/TKC-036-SpokenPrompt/SpokenPrompt';
import { ProverbsExtras } from '../ui/TKC-037-ProverbsExtras/ProverbsExtras';
import { VerseCard } from '../ui/TKC-033-VerseCard/VerseCard';
import { Disclosure } from '../ui/TKC-014-Disclosure/Disclosure';
import { SheetHost } from '../ui/patterns/SheetHost';
import { BottomSheet, Choices } from '../ui/TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../ui/TKC-012-ChoiceRow/ChoiceRow';
import { STEP_COPY, OWN_LINES, MEMORIZE_TIPS, MEMORIZE_SHEET, END } from '../copy';

const noop = () => {};
const WEB = 'World English Bible';
const segs = (marks: Record<number, 'done' | 'skip'> = {}) => Array.from({ length: 7 }, (_, k) => (marks[k] ?? 'open')) as Array<'done' | 'skip' | 'open'>;
// Steps 1 to 3 done, as a person arrives at step 4 or later in the usual order.
const before = (n: number) => Object.fromEntries(Array.from({ length: n }, (_, k) => [k, 'done' as const]));
const foot = (next = 'Next') => ({ back: true, skip: true, next, onBack: noop, onNext: noop });

const PRO14 = [{ n: '1', text: 'Every wise woman builds her house, but the foolish one tears it down with her own hands.' }, { n: '2', text: 'He who walks in his uprightness fears the LORD, but he who is perverse in his ways despises him.' }, { n: '3', text: 'The fool’s talk brings a rod to his back, but the lips of the wise protect them.' }];
const LUK8 = [{ n: '1', text: 'Soon afterwards, he went about through cities and villages, preaching and bringing the good news of God’s Kingdom. With him were the twelve,' }, { n: '2', text: 'and certain women who had been healed of evil spirits and infirmities: Mary who was called Magdalene, from whom seven demons had gone out;' }, { n: '3', text: 'and Joanna, the wife of Chuzas, Herod’s steward; Susanna; and many others who served them from their possessions.' }];
const MAT13 = [{ n: '1', text: 'On that day Jesus went out of the house and sat by the seaside.' }, { n: '2', text: 'Great multitudes gathered to him, so that he entered into a boat and sat; and all the multitude stood on the beach.' }, { n: '3', text: 'He spoke to them many things in parables, saying, “Behold, a farmer went out to sow.' }];
const VERSE = 'Even the Son of Man didn’t come to be served, but to serve, and to give his life as a ransom for many.';
const CUES = ['Psalm 97', 'Proverbs 14', 'Luke 8'];

function Proverb({ extras = 'none', own = false, left = 3, mark = 'open', day = '' }: { extras?: 'none' | 'offer' | 'after' | 'pace' | 'finished'; own?: boolean; left?: number; mark?: 'open' | 'done' | 'skipped'; day?: string }) {
  const c = STEP_COPY['am.proverb'];
  const ref = extras === 'after' ? 'Proverbs 4–5' : 'Proverbs 14';
  return <StepScreenView step="am.proverb" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(before(3)), current: 3, day: day || undefined, onClose: noop, onSteps: noop }}
    header={{ label: 'Proverb', heading: c.heading, why: c.why, state: mark !== 'open' ? mark : undefined, onUndo: noop }} foot={foot()}>
    <StepSource><SourceLine segments={own ? [ref, 'My own Bible'] : [ref]} translation={own ? undefined : WEB} onTranslation={noop} change onChange={noop} /></StepSource>
    {own ? <StepOwn>{`Read ${ref} in your Bible.`}</StepOwn> : <ReadingBlock kind="passage" verses={PRO14} />}
    {extras === 'offer' && <StepExtras><ProverbsExtras kind="offer" left={left} next={5} onRead={noop} onHide={noop} /></StepExtras>}
    {extras === 'after' && <StepExtras><ProverbsExtras kind="offer" left={1} next={6} onRead={noop} onHide={noop} /></StepExtras>}
    {extras === 'pace' && <StepExtras><ProverbsExtras kind="row" /></StepExtras>}
    {extras === 'finished' && <StepExtras><ProverbsExtras kind="row" finished /></StepExtras>}
  </StepScreenView>;
}
function Reading({ own = false }: { own?: boolean }) {
  const c = STEP_COPY['am.reading'];
  return <StepScreenView step="am.reading" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(before(4)), current: 4, onClose: noop, onSteps: noop }}
    header={{ label: 'Bible Reading', heading: c.heading, why: c.why }} foot={foot()}>
    <StepSource><SourceLine segments={own ? ['Luke 8', 'Matthew 13', 'My own Bible'] : ['Luke 8', 'Matthew 13']} translation={own ? undefined : WEB} onTranslation={noop} change onChange={noop} /></StepSource>
    {own ? <StepOwn>Read Luke 8 and Matthew 13 in your Bible.</StepOwn> : <>
      <ReadingBlock kind="title" text="Luke 8" first /><ReadingBlock kind="passage" verses={LUK8} joins afterTitle />
      <ReadingBlock kind="title" text="Matthew 13" /><ReadingBlock kind="passage" verses={MAT13} afterTitle /></>}
  </StepScreenView>;
}
function Respond({ sheet = false }: { sheet?: boolean }) {
  const c = STEP_COPY['am.respond'];
  return <><StepScreenView step="am.respond" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(before(5)), current: 5, onClose: noop, onSteps: noop }}
    header={{ label: 'Respond', heading: c.heading, why: c.why }} foot={foot()}>
    <StepInstruction text={c.instruction!} />
    <StepPrompt><SpokenPrompt kind="prompt" cues={CUES} onCue={noop} /></StepPrompt>
  </StepScreenView>
  {sheet && <SheetHost onClose={noop}><BottomSheet kind="read" title="Luke 8" onClose={noop}><ReadingBlock kind="passage" verses={LUK8} /></BottomSheet></SheetHost>}</>;
}
function Memorize({ tips = false, mark = 'open', own = false, sheet = false, ownSheet = false }: { tips?: boolean; mark?: 'open' | 'done' | 'skipped'; own?: boolean; sheet?: boolean; ownSheet?: boolean }) {
  const c = STEP_COPY['am.memorize'];
  const revisited = mark !== 'open';
  return <><StepScreenView step="am.memorize" wash="dawn" bar={{ walk: 'Morning Walk', steps: segs(revisited ? before(7) : before(6)), current: 6, onClose: noop, onSteps: noop }}
    header={{ label: 'Memorize', heading: c.heading, why: c.why, state: revisited ? mark : undefined, onUndo: noop }}
    foot={revisited ? { back: true, skip: false, next: 'Done', onBack: noop, onNext: noop } : foot('Complete Morning Walk')}>
    {own ? <><StepSource><SourceLine segments={['My own verse']} change onChange={noop} /></StepSource><StepOwn>{OWN_LINES.memorize}</StepOwn></>
      : <StepVerse><VerseCard label="This Week’s Verse" verse={VERSE} reference="Mark 10:45" translation={WEB} onTranslation={noop} change onChange={noop} /></StepVerse>}
    <StepTips><Disclosure label="Tips for Memorizing" open={tips} items={[...MEMORIZE_TIPS]} onToggle={noop} /></StepTips>
  </StepScreenView>
  {(sheet || ownSheet) && <SheetHost onClose={noop}><BottomSheet kind="pick" title={MEMORIZE_SHEET.title} line={MEMORIZE_SHEET.line} onClose={noop}>
    <Choices kind="full" label="Memory Verse">
      <ChoiceRow name={MEMORIZE_SHEET.app.name} line={MEMORIZE_SHEET.app.line} chosen={!ownSheet} onChoose={noop} />
      <ChoiceRow name={MEMORIZE_SHEET.own.name} line={MEMORIZE_SHEET.own.line} chosen={ownSheet} onChoose={noop} /></Choices></BottomSheet></SheetHost>}</>;
}
function Done({ past = false }: { past?: boolean }) {
  const names = ['Sing', 'Ask to Hear', 'Psalm', 'Proverb', 'Bible Reading', 'Respond', 'Memorize'];
  return <WalkCompleteView wash="dawn" bar={{ walk: 'Morning Walk', steps: Array(7).fill('done'), day: past ? 'Sun, Nov 1' : undefined, onClose: noop, onSteps: noop } as any}
    heading={END.morningDone} line={past ? END.pastLine : END.morningLine}
    done={names.map((name, k) => ({ name, skipped: k === 1 }))}
    verse={{ label: 'Take This Into Your Day', verse: VERSE, reference: 'Mark 10:45', translation: WEB }}
    comingUp={past ? [] : [{ title: 'Evening Walk', when: 'Tonight' }]} />;
}

type S = { name: string; sheet?: boolean; note: string; theme?: 'dark'; el: () => preact.JSX.Element };
export const STEPS2: S[] = [
  { name: 'Proverb', note: 'Proverbs 14, the usual day. No approved whole phone: by components and rule.', el: () => <Proverb /> },
  { name: 'Proverb · offer', note: 'A short month: TKC-037’s offer, TKC-059’s card (1428). No approved phone: your eye.', el: () => <Proverb extras="offer" /> },
  { name: 'Proverb · after a tap', note: 'The reading is now Proverbs 4–5 and the offer shows what is left.', el: () => <Proverb extras="after" /> },
  { name: 'Proverb · on pace', note: 'The compact row, ◐.', el: () => <Proverb extras="pace" /> },
  { name: 'Proverb · finished', note: 'The compact row, amber ✓.', el: () => <Proverb extras="finished" /> },
  { name: 'Proverb · My own Bible', note: 'TKC-038 on Proverb.', el: () => <Proverb own /> },
  { name: 'Bible Reading', note: 'Two chapters stacked: Luke 8, Matthew 13 (824).', el: () => <Reading /> },
  { name: 'Bible Reading · My own Bible', note: 'TKC-038 on Bible Reading.', el: () => <Reading own /> },
  { name: 'Respond', note: 'The sentence, the helper line, and one chip per reading. No approved whole phone.', el: () => <Respond /> },
  { name: 'Respond · cue sheet', sheet: true, note: 'A cue tap opens the reading again (444 y).', el: () => <Respond sheet /> },
  { name: 'Memorize · tips closed', note: 'This Week’s Verse, Change on its source line, tips closed.', el: () => <Memorize /> },
  { name: 'Memorize · tips open', note: 'The four tips.', el: () => <Memorize tips /> },
  { name: 'Memorize · revisited', note: 'The last step of a finished walk reads “Done”. No approved phone.', el: () => <Memorize mark="done" /> },
  { name: 'Memorize · My own verse', note: 'TKC-038: one line in the verse’s place.', el: () => <Memorize own /> },
  { name: 'Change verse', sheet: true, note: 'Memorize, Change: pick one, like Bible Readings (445). Copy is a best guess to approve (450).', el: () => <Memorize sheet /> },
  { name: 'Change verse · My own', sheet: true, note: 'The same sheet with My Own Verse chosen.', el: () => <Memorize own ownSheet /> },
  { name: 'Walk Complete · today', note: 'Morning Walk Complete (locked 865, States approved 890). ✕ is the only way out.', el: () => <Done /> },
  { name: 'Walk Complete · past day', note: 'A day she is catching up on: the date shows, no Coming Up.', el: () => <Done past /> },
  { name: 'Walk Complete · dark', theme: 'dark', note: 'The same screen in dark.', el: () => <Done /> },
];
