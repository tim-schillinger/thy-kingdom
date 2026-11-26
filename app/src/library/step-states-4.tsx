// Evening steps 6 and 7 for the library page (Check-In with its More Tonight list, and Meditate): the same pattern and parts the app's
// EveningStep screen uses, with the words written out (the Review's samples) so the page needs no engine or Bible data.
import { StepScreenView, StepRows, StepSource } from '../ui/patterns/StepScreen';
import { SourceLine } from '../ui/TKC-031-SourceLine/SourceLine';
import { AnchorLine } from '../ui/TKC-052-AnchorLine/AnchorLine';
import { AskYourself } from '../ui/TKC-039-AskYourself/AskYourself';
import { JoinedCard } from '../ui/TKC-062-JoinedCard/JoinedCard';
import { TextLink } from '../ui/TKC-007-TextLink/TextLink';
import { StepWhy } from '../ui/TKC-030-StepHeader/StepHeader';
import { CheckInList } from '../ui/TKC-046-CheckInRow/CheckInRow';
import { SheetHost } from '../ui/patterns/SheetHost';
import { BottomSheet, Choices, ReadList } from '../ui/TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../ui/TKC-012-ChoiceRow/ChoiceRow';
import { STEP_COPY, CHECKIN, MEDITATE_Q, MEDITATE_MOVE, MEDITATE_SHEET, OWN_LINES } from '../copy';

const noop = () => {};
const WEB = 'World English Bible';
const segs = (n: number) => Array.from({ length: 7 }, (_, k) => (k < n ? 'done' : 'open')) as Array<'done' | 'skip' | 'open'>;
type Mark = 'open' | 'done';

function CheckIn({ sheet = false, mark = 'open', day }: { sheet?: boolean; mark?: Mark; day?: string }) {
  const k = CHECKIN.burnt, c = STEP_COPY['pm.checkin'];
  return <StepScreenView step="pm.checkin" wash="dusk" card bar={{ walk: 'Evening Walk', steps: segs(5), current: 5, day, reference: 'All of Me', onClose: noop, onSteps: noop }}
    header={{ label: 'Check-In', slot: ' · All of Me', heading: c.heading, why: c.why, state: mark === 'done' ? 'done' : undefined, onUndo: noop }}
    foot={mark === 'done' ? { back: true, skip: false, next: 'Next', onBack: noop, onNext: noop } : { back: true, skip: true, next: 'Next', onBack: noop, onSkip: noop, onNext: noop }}
    overlay={sheet ? <SheetHost onClose={noop}><BottomSheet kind="read" title="Need ideas?" onClose={noop}><ReadList items={k.areas} label="Need ideas?" onPick={noop} /></BottomSheet></SheetHost> : undefined}>
    <JoinedCard label={c.heading} top={<AnchorLine kind="quote" text="“You shall love the Lord your God with all your heart…”" reference="Luke 10:27" onOpen={noop} />}>
      <AskYourself kind="question" text={k.question} /><AskYourself kind="move" text={k.move} /><TextLink kind="more" label="Need ideas?" onOpen={noop} /></JoinedCard>
    <StepWhy why={c.why} />
  </StepScreenView>;
}
function More() {
  return <StepScreenView step="pm.checkin" wash="dusk" bar={{ walk: 'Evening Walk', steps: segs(5), current: 5, day: undefined, reference: 'Check-In', onClose: noop, onSteps: noop }}
    header={{ label: 'Check-In', heading: 'More Tonight?', why: 'Today is the last day of the week and the month, so 2 more check-ins are available.' }}
    foot={{ back: true, skip: false, next: 'Next', onBack: noop, onNext: noop }}>
    <StepRows><CheckInList rows={[{ name: 'Relationships', status: 'done' }, { name: 'Giving', status: 'open', onOpen: noop }, { name: 'All of Me', status: 'open', onOpen: noop }]} /></StepRows>
  </StepScreenView>;
}
function Meditate({ all = false, sheet = false, own = false }: { all?: boolean; sheet?: boolean; own?: boolean }) {
  const q = all ? 1 : 6;
  return <><StepScreenView step="pm.meditate" wash="dusk" bar={{ walk: 'Evening Walk', steps: segs(6), current: 6, reference: all ? 'Revelation 22:13' : own ? 'My own verse' : 'Mark 10:45', onClose: noop, onSteps: noop }}
    header={{ label: 'Meditate', slot: all ? ' · Question 1 of 6' : undefined, heading: all ? STEP_COPY['pm.meditate'].heading : 'Live It Out', why: STEP_COPY['pm.meditate'].why }}
    foot={all ? { back: true, skip: true, next: 'Next', below: 'Complete Evening Walk', onBack: noop, onSkip: noop, onNext: noop, onBelow: noop } : { back: true, skip: true, next: 'Complete Evening Walk', onBack: noop, onSkip: noop, onNext: noop }}>
    <StepSource><SourceLine segments={all ? ['Omega · The Last', 'Revelation 22:13'] : own ? ['My own verse'] : ['This week: Jesus', 'Mark 10:45']} translation={own ? undefined : WEB} onTranslation={noop} change={!all} onChange={noop} /></StepSource>
    <AskYourself kind="meditate"
      ownLine={own ? OWN_LINES.meditate : undefined}
      verse={all ? 'I am the Alpha and the Omega, the First and the Last, the Beginning and the End.' : 'For the Son of Man also came not to be served, but to serve, and to give his life as a ransom for many.'}
      question={MEDITATE_Q[q - 1]} move={MEDITATE_MOVE[q - 1]} />
  </StepScreenView>
  {sheet && <SheetHost onClose={noop}><BottomSheet kind="pick" title={MEDITATE_SHEET.title} line={MEDITATE_SHEET.line} onClose={noop}>
    <Choices kind="full" label={MEDITATE_SHEET.title}>
      <ChoiceRow name={MEDITATE_SHEET.app.name} line={MEDITATE_SHEET.app.line} chosen={!own} onChoose={noop} />
      <ChoiceRow name={MEDITATE_SHEET.own.name} line={MEDITATE_SHEET.own.line} chosen={own} onChoose={noop} /></Choices></BottomSheet></SheetHost>}</>;
}

type S = { name: string; sheet?: boolean; note: string; theme?: 'dark'; el: () => preact.JSX.Element };
export const STEPS4: S[] = [
  { name: 'Check-In · All of Me', note: 'One joined card (TKC-062): the quote on the card top, the label, the question and the thing to do, one help link; the why line and “About This Step ›” sit under it. The quote line opens the whole verse.', el: () => <CheckIn /> },
  { name: 'Check-In · ideas sheet', sheet: true, note: 'The twelve words in one list in a sheet (frame-lock-7 R5). A word opens its page in the same sheet.', el: () => <CheckIn sheet /> },
  { name: 'Check-In · revisited', note: 'A step she already finished reads “✓ Done · Undo” and the foot is Back · Next.', el: () => <CheckIn mark="done" /> },
  { name: 'Check-In · past day', note: 'The date lives in the bar (erE11, 1011).', el: () => <CheckIn day="Mon, Oct 12" /> },
  { name: 'Check-In · dark', theme: 'dark', note: 'The same step in dark (erE7).', el: () => <CheckIn /> },
  { name: 'More Tonight?', note: 'A last day of the week or month: one row per check-in, the done ones kept. Next is always there (I5).', el: () => <More /> },
  { name: 'Meditate · Jesus week', note: 'One question a day. The button finishes the walk (erE5).', el: () => <Meditate /> },
  { name: 'Meditate · name night', note: 'Six questions in one night: Next, and a quiet Complete Evening Walk under it (erE6).', el: () => <Meditate all /> },
  { name: 'Meditate · My own verse', note: 'The verse becomes one line and the question stays (452). Best guess, no approved phone.', el: () => <Meditate own /> },
  { name: 'Change meditation verse', sheet: true, note: 'Pick one: the week’s verse or my own, like the other Change sheets (452). Best-guess words.', el: () => <Meditate sheet /> },
  { name: 'Change meditation verse · My own', sheet: true, note: 'My own chosen (452). Best-guess words.', el: () => <Meditate sheet own /> },
];
