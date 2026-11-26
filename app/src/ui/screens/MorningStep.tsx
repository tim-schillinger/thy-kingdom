// Morning steps 1 to 3 (Sing, Ask to Hear, Psalm): registry §2 "Step screen (frame)" and "Morning steps 1–7", locked 773 and 824.
// A screen file: data and layout only, built from the library (build-standards §5.8). Steps 4 to 7 stay on the skeleton until their turn.
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { getContent, refreshContent } from '../../data/content';
import { useHer, getHer, setMark, addMarks, removeMarks, setBible, setSources, setReminders, today as todayFn } from '../../data/store';
import { planFor, whereYouAre } from '../../engine/plan';
import { markIndex, stepState, stepsOf, nextStop } from '../../engine/progress';
import { formatRef, formatRefs } from '../../engine/refs';
import { fmtShort, month, year, daysInMonth, type CivilDate } from '../../engine/dates';
import { STEP_NAMES, type StepId, type Ref } from '../../engine/types';
import { STEP_COPY, SONG_COPY, DOXOLOGY, LEARN_MORE, HYMN_ABOUT, HYMN_AUDIO, PSALM_119, BIBLE_SHEET, READINGS_SHEET, HYMNAL_SHEET, MEMORIZE_SHEET, OWN_LINES, MEMORIZE_TIPS, READING_FAILED, WHERE_YOU_ARE } from '../../copy';
import { useVerses, useReading, useReadings, ReadingWait, pickedText } from '../bits';
import { EmptyState } from '../TKC-019-EmptyState/EmptyState';
import { StepScreenView, StepPlayer, StepSource, StepSourceUnder, StepWords, StepWriter, StepAbout, StepOwn, StepPrompt, StepVerse, StepTips, StepExtras, StepReadings } from '../patterns/StepScreen';
import { SheetHost } from '../patterns/SheetHost';
import { SourceLine } from '../TKC-031-SourceLine/SourceLine';
import { StepInstruction, StepWhy } from '../TKC-030-StepHeader/StepHeader';
import { JoinedCard } from '../TKC-062-JoinedCard/JoinedCard';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { hymnFor, storyFor, writerLine, isFirstSunday, trackFor, fmtTime } from '../../engine/hymns';
import { usePlayback, useAvailable, playHymn, pauseHymn, stopHymn } from '../../data/audio';
import { AudioPlayer, AudioNote } from '../TKC-051-AudioPlayer/AudioPlayer';
import { HymnBlock } from '../TKC-034-HymnBlock/HymnBlock';
import { PrayerWords } from '../TKC-035-PrayerWords/PrayerWords';
import { ReadingBlock, type Part } from '../TKC-032-ReadingBlock/ReadingBlock';
import { Button } from '../TKC-006-Button/Button';
import { SpokenPrompt } from '../TKC-036-SpokenPrompt/SpokenPrompt';
import { ProverbsExtras } from '../TKC-037-ProverbsExtras/ProverbsExtras';
import { VerseCard } from '../TKC-033-VerseCard/VerseCard';
import { StepListSheet, type StepRow } from '../TKC-005-StepListSheet/StepListSheet';
import { BottomSheet, Choices, ReadBody, ReadNote } from '../TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { weekVerse, finish as finishWalk } from '../Walk';
import { navigate, type Route, type Nav } from '../App';

export const MORNING_STEPS: StepId[] = ['am.sing', 'am.ask', 'am.psalm', 'am.proverb', 'am.reading', 'am.respond', 'am.memorize'];
export const bibleName = (b: 'web' | 'kjv') => (b === 'kjv' ? 'King James Version' : 'World English Bible');
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const plain = (t: string) => t.replace(/\[|\]/g, '');

/** Psalm 119's part above verse 1 (frame-lock-5-names-2 §E3): the Hebrew letter, its name in this Bible's spelling, "Hebrew letter n of 22", one sentence, and a link to what the psalm is. */
function LetterBlock({ part, name }: { part: number; name: string }) {
  const [open, setOpen] = useState(false); const glyph = getContent().cal.letters[part - 1].glyph;
  return <>
    <ReadingBlock kind="letter" letter={{ mark: glyph, name, plain: PSALM_119.plain(part), meaning: PSALM_119.meaning(part), more: PSALM_119.more, onMore: () => setOpen(true) }} />
    {open && <SheetHost onClose={() => setOpen(false)}><BottomSheet kind="read" title={PSALM_119.sheetTitle} onClose={() => setOpen(false)}><ReadBody parts={PSALM_119.sheet(part, name)} onMore={() => navigate({ s: 'lesson', step: 'am.psalm' })} /></BottomSheet></SheetHost>}
  </>;
}

/** A step's passages from the bundled Bible, shown together (they arrive as one, so nothing that showed moves); a chapter title first when several chapters stack (824). */
export function Scriptures({ refs, kjv, trans, picked, source }: { refs: Ref[]; kjv: boolean; trans: 'web' | 'kjv'; /** A verse the app picks: no psalm title, no red (A18, 750) */ picked?: boolean; /** The SourceLine: above the reading, or under Psalm 119's letter card when the reading opens a part (frame-lock-7 part 2, C2) */ source?: ComponentChildren }) {
  const { chs, phase, retry } = useReadings(refs, trans); const c = getContent();
  // Psalm 119 at the first verse of a part: the card comes first, then the source line. Known from the reference alone, so nothing moves when the Bible loads.
  const lead119 = !picked && refs[0]?.b === 'PSA' && refs[0].c === 119 && refs[0].v !== undefined && (refs[0].v - 1) % 8 === 0;
  if (!chs) return <>{!lead119 && source}<ReadingWait phase={phase} retry={retry} padded /></>;
  const titled = chapterCount(refs) > 1;
  return <>{!lead119 && source}{chs.map((one, i) => one.map(({ c: ch, title, letter, verses }, k) => <>
    {titled && <ReadingBlock kind="title" text={formatRef(c, { b: refs[i].b, c: ch })} first={i === 0 && k === 0} />}
    {!picked && letter && <LetterBlock part={letter.part} name={letter.name} />}
    {lead119 && i === 0 && k === 0 && source}
    <ReadingBlock kind="passage" psalmTitle={!picked && title ? plain(title) : undefined}
      verses={verses.map((v) => ({ n: String(v.n), text: plain(v.t), ...(!picked && v.r ? { parts: v.r.map((q) => (q[1] ? [plain(q[0]), 1] : [plain(q[0])]) as Part) } : {}) }))}
      kjv={kjv} joins={i < refs.length - 1 && k === one.length - 1} afterTitle={titled} />
  </>))}</>;
}
export const Scripture = ({ r, kjv, trans }: { r: Ref; kjv: boolean; trans: 'web' | 'kjv'; titled?: boolean; joins?: boolean }) => <Scriptures refs={[r]} kjv={kjv} trans={trans} picked />;

/** The step list's rows (TKC-005): number, name, the reference, then the mark. `current` is the step being viewed, or -1 from Walk Complete (no current row). */
export function morningRows(date: CivilDate, current: number): StepRow[] {
  const c = getContent(), her = getHer(), plan = planFor(c, her, date), idx = markIndex(her.dayMarks), steps = stepsOf('morning');
  const psalmRefs = plan.day?.psalm ?? [];
  const refOf = (s: StepId): string | undefined => {
    if (s === 'am.sing') return hymnFor(c, date, her.sources.hymnal === 'recorded').title;
    if (s === 'am.ask') return formatRef(c, ASK_REF);
    if (s === 'am.psalm') return psalmRefs.length ? formatRefs(c, psalmRefs) : undefined;
    if (s === 'am.proverb') return plan.proverbChapter ? `Proverbs ${plan.proverbChapter}` : undefined;
    if (s === 'am.reading') return plan.day?.reading.length ? formatRefs(c, plan.day.reading) : undefined;
    if (s === 'am.memorize') { const w = weekVerse(plan); return w ? formatRef(c, w) : undefined; }
    return undefined;
  };
  return steps.map((s, k) => { const st = stepState(idx, date, s);
    return { n: k + 1, name: STEP_NAMES[s], ref: refOf(s), mark: k === current ? 'current' : st === 'done' ? 'done' : st === 'skipped' ? 'skipped' : 'none' } as StepRow; });
}
export const ASK_REF: Ref = { b: 'PSA', c: 119, v: 18 };
export const chapterCount = (refs: Ref[]) => refs.reduce((n, r) => n + (r.v === undefined && r.c2 ? r.c2 - r.c + 1 : 1), 0);

export function MorningStep({ route, nav }: { route: Extract<Route, { s: 'step' }>; nav: Nav }) {
  const her = useHer(); const c = getContent(); const t = todayFn();
  const { walk, date, step, from } = route;
  const plan = planFor(c, her, date);
  const steps = stepsOf(walk); const i = steps.indexOf(step);
  const idx = markIndex(her.dayMarks);
  const mark = stepState(idx, date, step);
  const ahead = date > t;                                  // read ahead: nothing is marked (TKC-003 0.6)
  const trans = her.sources.bible;
  const [sheet, setSheet] = useState<null | 'steps' | 'learn' | 'bible' | 'readings' | 'hymnal' | 'hymn' | 'verse' | 'cue' | 'tips'>(null);
  const [cue, setCue] = useState<{ label: string; refs: Ref[] } | null>(null);
  const close = () => nav(from === 'opendays' ? { s: 'today', date, from: 'opendays' } : { s: 'today' });
  const go = (n: number) => nav({ ...route, step: steps[n] });
  const others = (after = idx) => steps.filter((s) => s !== step && stepState(after, date, s) === 'open');
  /** Frame lock 8 L1 (3178 y): the main button goes to the next step still open, else Still Open (steps open behind her), else the walk's end (Walk Complete, or Day Complete when both walks are done). `review`: she is looking again at a step already handled. */
  const review = mark !== 'open';
  const stop = nextStop(steps, idx, date, i, review);
  const next = () => { const s = nextStop(steps, markIndex(getHer().dayMarks), date, i, review); if ('step' in s) go(s.step); else if (s.end === 'still') nav({ s: 'still', walk, date, from }); else finishWalk(walk, date, from, nav); };
  const finish = (state: 'done' | 'skipped') => { if (!ahead && mark === 'open') setMark(date, step, state); next(); };
  const undo = () => removeMarks([`${date}|${step}`]);
  const dayLabel = date === t ? undefined : fmtShort(date);
  /** TKC-003 0.7 (571, 572): the primary names where it goes. */
  const nextTo = 'step' in stop ? STEP_NAMES[steps[stop.step]] : stop.end === 'still' ? 'Still Open' : undefined;
  /** TKC-003 0.7 H (605): moving on from a skipped step marks it done. */
  const moveOn = () => { if (!ahead && mark === 'skipped') setMark(date, step, 'done'); next(); };

  // ---- what each step holds
  const hymn = hymnFor(c, date, her.sources.hymnal === 'recorded'), doxology = isFirstSunday(date);   // 3163 a: a first Sunday is an ordinary Sing morning; only the song and its instruction differ
  const ownHymnal = step === 'am.sing' && her.sources.hymnal === 'own';
  // 3-5p (frame-lock-9): the day's recording, if any. No player without a recording, from her own hymnal, offline with the file not kept (828), or if the file would not play. Never autoplays; leaving the step stops it.
  const track = step === 'am.sing' && !ownHymnal ? trackFor(c, hymn) : null;
  const pb = usePlayback(track?.file ?? null), canPlay = useAvailable(track?.file ?? null);
  useEffect(() => () => stopHymn(), [step, date]);
  const showPlayer = !!track && canPlay && !pb.failed;
  const length = track ? pb.duration || track.seconds : 0;
  const toggle = () => { if (!track) return; if (pb.status === 'playing' || pb.status === 'loading') pauseHymn(); else playHymn(track.file, track.seconds); };
  const listen = showPlayer && track && pb.status !== 'idle' ? { playing: pb.status === 'playing' || pb.status === 'loading', progress: length ? pb.time / length : 0, time: fmtTime(pb.time), onToggle: toggle } : undefined;
  const ownBible = her.sources.readings === 'own';
  const psalmRefs = plan.day?.psalm ?? [];
  const readingRefs = plan.day?.reading ?? [];
  const song = step === 'am.psalm' && !!plan.day?.song;
  const askR = useReading(step === 'am.ask' ? ASK_REF : null, trans), ask = askR.chs;

  // Proverb: the day's chapter, then the extras she has read today (TKC-037)
  const dim = daysInMonth(year(date), month(date)), monthKey = date.slice(0, 7);
  const extrasToday = her.dayMarks.filter((m) => m.step === 'am.proverb.extra' && m.date === date).length;
  const base = plan.proverbChapter;
  const proverbRefs: Ref[] = base ? Array.from({ length: Math.min(31, base + extrasToday) - base + 1 }, (_, k) => ({ b: 'PRO', c: base + k })) : [];
  const proverbText = proverbRefs.length > 1 ? formatRef(c, { b: 'PRO', c: base!, c2: proverbRefs[proverbRefs.length - 1].c }) : proverbRefs.length ? formatRef(c, proverbRefs[0]) : '';
  const shortMonth = dim < 31 && date === t && !ahead && !ownBible && !!base;
  const left = plan.proverbExtrasLeft;
  const offer = step === 'am.proverb' && shortMonth && left > 0 && her.reminders.notThisMonth !== monthKey;
  const extrasRow = step === 'am.proverb' && shortMonth && left === 0;
  const readExtra = () => addMarks([{ key: `${date}|am.proverb.extra|${extrasToday + 1}`, date, step: 'am.proverb.extra', state: 'done', at: Date.now() }]);
  const hideExtras = () => { setReminders({ notThisMonth: monthKey }); queueMicrotask(() => document.querySelector<HTMLElement>('[data-tkc="TKC-003"] [data-kind="primary"]')?.focus()); };
  const seen = useRef(extrasToday);
  useEffect(() => {                                         // after a tap: the new chapter's title lands under the bar and takes focus (TKC-037 E, I)
    if (extrasToday <= seen.current) { seen.current = extrasToday; return; }
    seen.current = extrasToday;
    let tries = 0; const want = proverbRefs.length;
    const timer = setInterval(() => {
      const titles = document.querySelectorAll<HTMLElement>('.tkc-step__main [data-kind="title"]');
      if (titles.length >= want || ++tries > 20) { clearInterval(timer); const el = titles[titles.length - 1]; if (el) { el.tabIndex = -1; el.focus({ preventScroll: true }); el.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } }
    }, 50);
    return () => clearInterval(timer);
  }, [extrasToday]);

  // Memorize: this week's verse
  const ownVerse = step === 'am.memorize' && her.sources.verse === 'own';
  const verseRef = step === 'am.memorize' && !ownVerse ? weekVerse(plan) : null;
  const vr = useReading(verseRef, trans), verse = vr.chs;   // A23: the card's stand-in needs the phase, not only the text

  // Respond: today's readings as cues, each opening again in a sheet (the Review: "She returns here when she closes it")
  const cues: Array<{ label: string; refs: Ref[] }> = step === 'am.respond' ? [
    ...psalmRefs.map((r) => ({ label: formatRef(c, r), refs: [r] })),
    ...(base ? [{ label: proverbText, refs: proverbRefs }] : []),
    ...readingRefs.map((r) => ({ label: formatRef(c, r), refs: [r] })),
  ] : [];

  /** A TKC-062 step (frame-lock-7): the card carries the heading, so the header is not drawn above it. Memorize with no verse and no My Own line keeps the page with its failure line. */
  const onCard = step === 'am.ask' || step === 'am.respond' || (step === 'am.memorize' && (!!verseRef || ownVerse));
  const copy = song ? { label: SONG_COPY.label, heading: SONG_COPY.heading, why: SONG_COPY.why } : { label: STEP_NAMES[step], heading: STEP_COPY[step].heading, why: STEP_COPY[step].why };
  const reference = step === 'am.sing' ? hymn.title : step === 'am.ask' ? formatRef(c, ASK_REF) : step === 'am.psalm' ? formatRefs(c, psalmRefs)
    : step === 'am.proverb' ? proverbText : step === 'am.reading' ? formatRefs(c, readingRefs) : step === 'am.respond' ? 'Respond' : ownVerse ? 'My own verse' : verseRef ? formatRef(c, verseRef) : undefined;
  const rows = morningRows(date, i);

  /** A passage (or several, stacked) from the bundled Bible, or the My Own line (TKC-038). */
  const source = (text: string) => <StepSource><SourceLine segments={[text, ...(ownBible ? ['My own Bible'] : [])]} translation={ownBible ? undefined : bibleName(trans)} onTranslation={() => setSheet('bible')} change onChange={() => setSheet('readings')} /></StepSource>;
  /** The SourceLine and the passage: the line sits above the reading, or under Psalm 119's letter card (C2). */
  const reading = (refs: Ref[], noun: string, text: string) => ownBible ? <>{source(text)}<StepOwn>{`Read ${noun} in your Bible.`}</StepOwn></>
    : refs.length ? <Scriptures refs={refs} kjv={trans === 'kjv'} trans={trans} source={source(text)} />
    : <>{source(text)}<StepOwn>This day has no reading in the calendar. What it holds is set later (1363).</StepOwn></>;

  const body = step === 'am.sing' ? <>
      <StepSource><SourceLine segments={ownHymnal ? ['My own hymnal'] : [hymn.title]} onAbout={ownHymnal ? undefined : () => setSheet('hymn')} aboutLabel="About This Hymn" change onChange={() => setSheet('hymnal')} /></StepSource>
      {ownHymnal ? <StepOwn>{OWN_LINES.sing}</StepOwn> : <>
        {showPlayer && track && <StepPlayer><AudioPlayer state={pb.status === 'ended' ? 'playing' : pb.status === 'idle' ? 'idle' : pb.status} time={fmtTime(pb.time)} length={fmtTime(length)} progress={length ? pb.time / length : 0} onToggle={toggle} /><AudioNote>{HYMN_AUDIO.note}</AudioNote></StepPlayer>}
        {!track && her.sources.hymnal === 'app' && <StepPlayer><AudioNote link={HYMN_AUDIO.noneLink} linkAria={HYMN_AUDIO.noneAria} onLink={() => setSheet('hymnal')}>{HYMN_AUDIO.none}</AudioNote></StepPlayer>}
        <StepInstruction text={doxology ? DOXOLOGY.instruction : STEP_COPY['am.sing'].instruction!} />
        <HymnBlock stanzas={hymn.stanzas.map((lines, k) => ({ n: hymn.stanzas.length === 1 ? '' : k + 1, lines }))} refrain={hymn.refrain} />
        <StepWriter><HymnBlock kind="writer" writer={writerLine(hymn)} />
          <>{!doxology && <HymnBlock kind="credit" writer={HYMN_ABOUT.credit} />}<StepAbout><TextLink kind="more" label={HYMN_ABOUT.link} aria={showPlayer && track ? (doxology ? HYMN_AUDIO.aboutAriaDoxology : HYMN_AUDIO.aboutAria) : `${HYMN_ABOUT.link}. Opens its writer and its hymnal`} onOpen={() => setSheet('hymn')} /></StepAbout></></StepWriter></>}
    </> : step === 'am.ask' ? <>
      <JoinedCard kind="single" label={STEP_COPY['am.ask'].heading} why={STEP_COPY['am.ask'].why}>
        <StepInstruction text={STEP_COPY['am.ask'].instruction!} />
        {ask ? <PrayerWords kind="verse" text={plain(ask.flatMap((x) => x.verses.map((v) => v.t)).join(' '))} /> : <ReadingWait phase={askR.phase} retry={askR.retry} />}
        <SourceLine segments={[formatRef(c, ASK_REF)]} translation={bibleName(trans)} onTranslation={() => setSheet('bible')} />
      </JoinedCard>
      <StepWhy />
    </> : step === 'am.psalm' ? <>
      {reading(psalmRefs, formatRefs(c, psalmRefs), formatRefs(c, psalmRefs))}
    </> : step === 'am.proverb' ? <>
      {reading(proverbRefs, proverbText, proverbText)}
      {offer && <StepExtras><ProverbsExtras kind="offer" left={left} monthName={MONTH_NAMES[month(date) - 1]} days={dim} next={Math.min(31, base! + extrasToday + 1)} onRead={readExtra} onHide={hideExtras} /></StepExtras>}
      {extrasRow && <StepExtras><ProverbsExtras kind="row" extras={31 - dim} finished={Math.min(31, base! + extrasToday) >= 31} /></StepExtras>}
    </> : step === 'am.reading' ? <>
      {(() => { const t = formatRefs(c, readingRefs), w = whereYouAre(her, date, ahead);
        if (!w || (!ownBible && !readingRefs.length)) return reading(readingRefs, t, t);
        const line = <StepPlayer><AudioNote>{WHERE_YOU_ARE[w]}</AudioNote></StepPlayer>;
        return ownBible ? <>{source(t)}{line}<StepOwn>{`Read ${t} in your Bible.`}</StepOwn></>
          : <Scriptures refs={readingRefs} kjv={trans === 'kjv'} trans={trans} source={<>{source(t)}{line}</>} />; })()}
    </> : step === 'am.respond' ? <>
      <JoinedCard kind="single" label={STEP_COPY['am.respond'].heading} why={STEP_COPY['am.respond'].why}>
        <StepInstruction text={STEP_COPY['am.respond'].instruction!} />
        <SpokenPrompt kind="sentence" /><SpokenPrompt kind="helper" />
      </JoinedCard>
      {cues.length > 0 && <StepReadings><SpokenPrompt kind="cues" cues={cues.map((x) => x.label)} onCue={(label) => { setCue(cues.find((x) => x.label === label) ?? null); setSheet('cue'); }} /></StepReadings>}
    </> : onCard ? <>
      <JoinedCard kind="single" label={STEP_COPY['am.memorize'].heading} why={STEP_COPY['am.memorize'].why}>
        {verseRef && (verse
          ? <VerseCard verse={pickedText(verse, trans)!} reference={formatRef(c, verseRef)} translation={bibleName(trans)} onTranslation={() => setSheet('bible')} change onChange={() => setSheet('verse')} />
          : <ReadingWait phase={vr.phase} retry={vr.retry} />)}
        {ownVerse && <><SourceLine segments={['My own verse']} change onChange={() => setSheet('verse')} /><StepOwn>{OWN_LINES.memorize}</StepOwn></>}
        <TextLink kind="more" label="Tips for Memorizing" aria="Tips for Memorizing. Opens a list of tips" onOpen={() => setSheet('tips')} />
      </JoinedCard>
      <StepWhy />
    </> : <>
      {/* A23: the week's verse is in every calendar day. If this copy of the calendar has none, say so, with a way to get a fresh one. */}
      <StepVerse><EmptyState kind="failed" line={READING_FAILED} actionLabel="Try Again" onAction={() => refreshContent(route)} /></StepVerse>
    </>;

  // The foot (TKC-003 0.6, G3): untouched → Back · Skip · Next (the last step reads "Complete Morning Walk" once nothing else is open);
  // revisited or read ahead → Back · Next, and on the last step of a complete walk or of read ahead "Done" returns to Today.
  const last = i === steps.length - 1, open = !ahead && mark === 'open', rest = others().length;
  const foot = open
    ? { back: i > 0, skip: true, next: 'Complete Morning Walk', to: nextTo, onBack: () => go(i - 1), onSkip: () => finish('skipped'), onNext: () => finish('done') }
    : last && (ahead || rest === 0) ? { back: i > 0, skip: false, next: 'Done', onBack: () => go(i - 1), onNext: close }
    : { back: i > 0, skip: false, next: nextTo ? 'Next' : 'Complete Morning Walk', to: nextTo, onBack: () => go(i - 1), onNext: moveOn };

  return <StepScreenView step={step} wash="dawn" card={onCard} ahead={ahead}
    bar={{ walk: 'Morning Walk', steps: steps.map((s) => { const x = stepState(idx, date, s); return x === 'done' ? 'done' : x === 'skipped' ? 'skip' : 'open'; }), current: i, day: dayLabel, reference, listen, onClose: close, onSteps: () => setSheet('steps') }}
    header={{ label: copy.label, heading: copy.heading, why: copy.why,
      state: !ahead && mark !== 'open' ? mark : undefined, onUndo: undo, onInfo: LEARN_MORE[step] ? () => setSheet('learn') : undefined }}
    foot={foot}
    overlay={<>
      {sheet === 'steps' && <SheetHost onClose={() => setSheet(null)}><StepListSheet walk="Morning Walk" steps={rows} onClose={() => setSheet(null)} onPick={(n) => { setSheet(null); if (n - 1 !== i) go(n - 1); }} /></SheetHost>}
      {sheet === 'learn' && LEARN_MORE[step] && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={copy.label} onClose={() => setSheet(null)}><ReadBody parts={LEARN_MORE[step]!} onMore={() => { setSheet(null); nav({ s: 'lesson', step, back: route }); }} /></BottomSheet></SheetHost>}
      {sheet === 'tips' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title="Tips for Memorizing" onClose={() => setSheet(null)}>{MEMORIZE_TIPS.map((t) => <ReadNote key={t}>{t}</ReadNote>)}</BottomSheet></SheetHost>}
      {sheet === 'cue' && cue && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={cue.label} onClose={() => setSheet(null)}>
        <Scriptures refs={cue.refs} kjv={trans === 'kjv'} trans={trans} /></BottomSheet></SheetHost>}
      {sheet === 'bible' && <BibleSheet current={trans} onPick={(b) => { setBible(b); setSheet(null); }} onClose={() => setSheet(null)} />}
      {sheet === 'hymn' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={hymn.title} onClose={() => setSheet(null)}><ReadBody parts={[{ head: HYMN_ABOUT.words, body: writerLine(hymn) }, { head: HYMN_ABOUT.writer, body: storyFor(c, hymn) }, ...(doxology ? [] : [{ head: HYMN_ABOUT.hymnal, body: HYMN_ABOUT.hymnalText }]), ...(showPlayer && track ? [{ head: HYMN_AUDIO.heading, body: HYMN_AUDIO.body(track) }] : [])]} action={null} /></BottomSheet></SheetHost>}
      {sheet === 'hymnal' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="pick" title={HYMNAL_SHEET.title} line={HYMNAL_SHEET.line} onClose={() => setSheet(null)}>
        <Choices kind="full" label="Hymnal">
          <ChoiceRow name={HYMNAL_SHEET.app.name} line={HYMNAL_SHEET.app.line} chosen={her.sources.hymnal === 'app'} onChoose={() => { setSources({ hymnal: 'app' }); setSheet(null); }} />
          <ChoiceRow name={HYMNAL_SHEET.recorded.name} line={HYMNAL_SHEET.recorded.line} chosen={her.sources.hymnal === 'recorded'} onChoose={() => { setSources({ hymnal: 'recorded' }); setSheet(null); }} />
          <ChoiceRow name={HYMNAL_SHEET.own.name} line={HYMNAL_SHEET.own.line} chosen={her.sources.hymnal === 'own'} onChoose={() => { setSources({ hymnal: 'own' }); setSheet(null); }} /></Choices></BottomSheet></SheetHost>}
      {sheet === 'verse' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="pick" title={MEMORIZE_SHEET.title} line={MEMORIZE_SHEET.line} onClose={() => setSheet(null)}>
        <Choices kind="full" label="Memory Verse">
          <ChoiceRow name={MEMORIZE_SHEET.app.name} line={MEMORIZE_SHEET.app.line} chosen={!ownVerse} onChoose={() => { setSources({ verse: 'app' }); setSheet(null); }} />
          <ChoiceRow name={MEMORIZE_SHEET.own.name} line={MEMORIZE_SHEET.own.line} chosen={ownVerse} onChoose={() => { setSources({ verse: 'own' }); setSheet(null); }} /></Choices></BottomSheet></SheetHost>}
      {sheet === 'readings' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="pick" title={READINGS_SHEET.title} line={READINGS_SHEET.line} onClose={() => setSheet(null)}>
        <Choices kind="full" label="Bible Readings">
          <ChoiceRow name="In the App" line={`The ${bibleName(trans)}, right on the screen`} chosen={!ownBible} onChoose={() => { setSources({ readings: 'app' }); setSheet(null); }} />
          <ChoiceRow name={READINGS_SHEET.own.name} line={READINGS_SHEET.own.line} chosen={ownBible} onChoose={() => { setSources({ readings: 'own' }); setSheet(null); }} /></Choices></BottomSheet></SheetHost>}
    </>}>
    {body}
  </StepScreenView>;
}

export function BibleSheet({ current, onPick, onClose }: { current: 'web' | 'kjv'; onPick: (b: 'web' | 'kjv') => void; onClose: () => void }) {
  const web = useVerses({ b: 'PSA', c: 23, v: 1 }, 'web'), kjv = useVerses({ b: 'PSA', c: 23, v: 1 }, 'kjv');
  const sample = (v: typeof web) => v?.flatMap((x) => x.verses.map((s) => s.t)).join(' ').replace(/\[|\]/g, '') ?? '';
  return <SheetHost onClose={onClose}><BottomSheet kind="pick" title={BIBLE_SHEET.title} line={BIBLE_SHEET.line} onClose={onClose}>
    <Choices kind="full" label="Bible">{BIBLE_SHEET.rows.map((b) => <ChoiceRow key={b.key} name={b.name} line={b.line} sample={sample(b.key === 'web' ? web : kjv)} reference={BIBLE_SHEET.reference} chosen={current === b.key} onChoose={() => onPick(b.key)} />)}</Choices>
  </BottomSheet></SheetHost>;
}
