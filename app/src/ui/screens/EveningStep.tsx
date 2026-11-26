// Evening steps 1 to 4 (Turn to God, Classic, Study Notes, Dig Deeper): registry §2 "Evening steps 1–4", locked 920, reworked 1009 (TKC-052).
// A screen file: data and layout only, built from the library (build-standards §5.8). Steps 5 to 7 stay on the skeleton until their turn.
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { getContent } from '../../data/content';
import { restoreRow } from '../motion';
import { useHer, getHer, setMark, removeMarks, setBible, setSources, setReminders, setAsks, setRemoved, today as todayFn } from '../../data/store';
import { planFor, peopleTonight, poolFor, classicPlace, type DayPlan } from '../../engine/plan';
import { markIndex, stepState, stepsOf, nextStop } from '../../engine/progress';
import { formatRef, formatRefs } from '../../engine/refs';
import { fmtShort, monthDay, type CivilDate } from '../../engine/dates';
import { STEP_NAMES, CHECKIN_NAMES, LISTS, type StepId, type Ref, type CheckIn, type Person, type DigSection, type ArticleBlock, type NoteBlock } from '../../engine/types';
import { CHECKIN_IDEAS, ANCHOR_MEANING, TURN_MEANING, STEP_COPY, BOOK_CREDIT, NOTES_NOTICE, DIG_NOTICE, ARTICLE, BOOK_SHEETS, MEDITATE_SHEET, OWN_LINES, CHECKIN, MEDITATE_Q, MEDITATE_MOVE, listAnd, NEED_WORDS, PLATE_EYEBROW, MEDITATE_GROUP, QUESTION_OF } from '../../copy';
import { useVerses, useReading, useStudy, ReadingWait, pickedText } from '../bits';
import { EmptyState } from '../TKC-019-EmptyState/EmptyState';
import { StepAbout, StepWriter, StepScreenView, StepMeaning, StepMissing, StepAsk, StepRows, StepSource, StepSourceUnder, StepWords, StepOwn, StepNote, StepCredit } from '../patterns/StepScreen';
import { SheetHost } from '../patterns/SheetHost';
import { SourceLine } from '../TKC-031-SourceLine/SourceLine';
import { StepInstruction, StepWhy } from '../TKC-030-StepHeader/StepHeader';
import { PrayerWords } from '../TKC-035-PrayerWords/PrayerWords';
import { ReadingBlock, type HelpsBlock } from '../TKC-032-ReadingBlock/ReadingBlock';
import { AnchorLine } from '../TKC-052-AnchorLine/AnchorLine';
import { StepListSheet, type StepRow } from '../TKC-005-StepListSheet/StepListSheet';
import { BottomSheet, Choices, ReadNote, ReadNotice, ReadLearn, ReadBody } from '../TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { meditateVerse, finish as finishWalk } from '../Walk';
import { PrayerIntro, PrayerPartBody, partWords } from './PrayerParts';
import { MovingHalf } from '../TKC-063-MovingHalf/MovingHalf';
import { WordMeaning } from '../TKC-061-WordMeaning/WordMeaning';
import { PeopleContent, PeopleCount, PeopleSheets, askLabel, type PeopleSheet, type PeopleRow } from './PrayerPeople';
import { ToastHost } from '../patterns/ToastHost';
import { NationPageView } from '../patterns/NationPage';
import { nationsFor, nationLine, spotFor, factRows } from '../../engine/nations';
import { PRAYER, PEOPLE_SHEETS, peopleCountLine, whyTonight, LEARN_ASK, LEARN_ITEMS, LEARN_MORE } from '../../copy';
import { AskYourself } from '../TKC-039-AskYourself/AskYourself';
import { anchorQuote } from '../../engine/anchor';
import { SheetRead } from './SheetRead';
import { JoinedCard } from '../TKC-062-JoinedCard/JoinedCard';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { IdeasSheet } from './IdeasSheet';
import { Fold } from '../Fold';
import { CheckInList } from '../TKC-046-CheckInRow/CheckInRow';
import { Scripture, Scriptures, BibleSheet, plain, bibleName, chapterCount } from './MorningStep';
import type { Route, Nav } from '../App';

export const EVENING_BUILT: StepId[] = ['pm.turn', 'pm.classic', 'pm.notes', 'pm.dig', 'pm.prayer', 'pm.checkin', 'pm.meditate'];
const TURN_REF: Ref = { b: 'PSA', c: 141, v: 2 };
type Book = 'classic' | 'studyNotes' | 'digDeeper';
const BOOK_OF: Partial<Record<StepId, Book>> = { 'pm.classic': 'classic', 'pm.notes': 'studyNotes', 'pm.dig': 'digDeeper' };

/** Every chapter a list of references touches, in order ("Luke 8", "Matthew 13"). */
const chaptersOf = (refs: Ref[]): Array<{ b: string; c: number }> =>
  refs.flatMap((r) => (r.c2 ? Array.from({ length: r.c2 - r.c + 1 }, (_, k) => ({ b: r.b, c: r.c + k })) : [{ b: r.b, c: r.c }]));
/** A study note's verses as its label says them ("Verse 3", "Verses 2–3", "Title" for a psalm's title). */
const verseLabel = (v: number[]) => (v[0] === 0 ? 'Title' : v.length === 3 ? `Verses ${v[0]}–${v[2]}:${v[1]}` : v[0] === v[1] ? `Verse ${v[0]}` : `Verses ${v[0]}–${v[1]}`);
const digLabel = (v: DigSection['v']) => (v[0] === v[1] ? `Verse ${v[0]}` : `Verses ${v[0]}–${v[1]}`);

/** The day's Study Notes range as the SourceLine and the My Own line say it ("Romans 12–14"), and the chapters it covers. */
function studyRange(plan: DayPlan) {
  const c = getContent(), st = plan.day?.study;
  if (!st) return { text: '', chapters: [] as Array<{ b: string; c: number }> };
  if ('article' in st) return { text: c.articles.nights[monthDay(plan.date)]?.title ?? 'Article', chapters: [] };
  if (!st.from) return { text: '', chapters: [] };
  const [fb, fc] = st.from, [tb, tc] = st.to ?? st.from;
  const sameBook = fb === tb;
  const text = formatRef(c, { b: fb, c: fc, ...(sameBook && tc !== fc ? { c2: tc } : {}) }) + (sameBook ? '' : `, ${formatRef(c, { b: tb, c: tc })}`);
  const chapters = sameBook ? chaptersOf([{ b: fb, c: fc, ...(tc !== fc ? { c2: tc } : {}) }]) : [{ b: fb, c: fc }];
  return { text, chapters };
}

/** An article's blocks as Study Notes helps: each head is a section label, and the blocks between heads read as one note. */
const articleHelps = (bs: ArticleBlock[]): HelpsBlock[] => {
  const out: HelpsBlock[] = []; let run: NoteBlock[] = [];
  const flush = () => { if (run.length) out.push({ kind: 'rich', blocks: run }); run = []; };
  for (const b of bs) { if (b[0] === 'h') { flush(); out.push({ kind: 'section', text: b[1] }); } else run.push(b); }
  flush(); return out;
};

/** The step list's rows (TKC-005): number, name, the reference, then the mark. */
export function eveningRows(date: CivilDate, current: number): StepRow[] {
  const c = getContent(), her = getHer(), plan = planFor(c, her, date), idx = markIndex(her.dayMarks), steps = stepsOf('evening');
  const refOf = (s: StepId): string | undefined => {
    if (s === 'pm.turn') return formatRef(c, TURN_REF);
    if (s === 'pm.classic') return her.sources.classic === 'own' ? undefined : c.classic.readings[classicPlace(c, her, date)].part;
    if (s === 'pm.notes') return studyRange(plan).text || undefined;
    if (s === 'pm.dig') return plan.day?.reading.length ? formatRefs(c, plan.day.reading) : undefined;
    if (s === 'pm.checkin') return plan.checkIns[0] ? CHECKIN_NAMES[plan.checkIns[0]] : undefined;
    if (s === 'pm.meditate') { const w = meditateVerse(plan); return w && !(plan.meditation?.question !== 'all' && her.sources.meditate === 'own') ? formatRef(c, w) : undefined; }
    return undefined;
  };
  return steps.map((s, k) => { const st = stepState(idx, date, s);
    return { n: k + 1, name: STEP_NAMES[s], ref: refOf(s), mark: k === current ? 'current' : st === 'done' ? 'done' : st === 'skipped' ? 'skipped' : 'none' } as StepRow; });
}

/** "LUK 10:27" → a Ref (the check-in anchors are the Author's chart epigraphs, stored with USFM book codes). */
const usfm = (s: string): Ref => { const [b, cv] = s.split(' '); const [c, v] = cv.split(':'); return { b, c: +c, ...(v ? { v: +v } : {}) }; };

/** The "More Tonight?" line: which last days today is (week, month, quarter, year) and how many more check-ins that makes available. */
function moreLine(cis: CheckIn[], state: (x: CheckIn) => string) {
  const parts = [cis.includes('grain') && 'the week', cis.includes('peace') && 'the month', cis.includes('sin') && 'the quarter', cis.includes('trespass') && 'the year'].filter(Boolean) as string[];
  const joined = parts.length <= 2 ? parts.join(' and ') : `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
  const left = cis.filter((x) => state(x) === 'open').length, n = cis.length - 1;
  return left === 1 ? 'One more completes tonight’s check-ins.' : left === 0 ? 'Every check-in done tonight.' : `Today is the last day of ${joined}, so ${n} more check-in${n === 1 ? ' is' : 's are'} available.`;
}

export function EveningStep({ route, nav }: { route: Extract<Route, { s: 'step' }>; nav: Nav }) {
  const her = useHer(); const c = getContent(); const t = todayFn();
  const { walk, date, step, from } = route;
  const plan = planFor(c, her, date);
  const steps = stepsOf(walk); const i = steps.indexOf(step);
  const idx = markIndex(her.dayMarks);
  const mark = stepState(idx, date, step);
  const ahead = date > t;                                  // read ahead: nothing is marked (TKC-003 0.6)
  const trans = her.sources.bible;
  const [sheet, setSheet] = useState<null | 'steps' | 'bible' | 'book' | 'notice' | 'cue' | 'civerse' | 'med' | 'prayer' | 'ideas' | 'list' | 'learn' | 'info' | 'words' | 'about'>(null);
  const [idea, setIdea] = useState<number | null>(null);   // the open page inside the ideas sheet; null is the list
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({});   // a long Study Notes night folds by chapter: the first is open (736)
  const close = () => nav(from === 'opendays' ? { s: 'today', date, from: 'opendays' } : { s: 'today' });
  const go = (n: number) => nav({ ...route, step: steps[n] });
  const others = () => steps.filter((s) => s !== step && stepState(markIndex(getHer().dayMarks), date, s) === 'open');
  /** Frame lock 8 L1, L2 (3178 y, 3179 a): the main button goes to the next step still open, else Still Open (steps open behind her), else the walk's end (Walk Complete, or Day Complete when both walks are done). `review`: she is looking again at a step already handled. */
  const review = mark !== 'open';
  const stop = nextStop(steps, idx, date, i, review);
  const next = () => { const s = nextStop(steps, markIndex(getHer().dayMarks), date, i, review); if ('step' in s) go(s.step); else if (s.end === 'still') nav({ s: 'still', walk, date, from }); else finishWalk(walk, date, from, nav); };
  const finishStep = (state: 'done' | 'skipped') => { if (!ahead && mark === 'open') setMark(date, step, state, step === 'pm.classic' && state === 'done' ? classicPlace(c, getHer(), date) : undefined); next(); };
  const undo = () => removeMarks([`${date}|${step}`]);
  const dayLabel = date === t ? undefined : fmtShort(date);

  const book = BOOK_OF[step], own = !!book && her.sources[book] === 'own';
  const psalmRefs = plan.day?.psalm ?? [], readingRefs = plan.day?.reading ?? [];
  const base = plan.proverbChapter;
  const turnR = useReading(step === 'pm.turn' ? TURN_REF : null, trans), turn = turnR.chs;
  const range = studyRange(plan);
  const article = step === 'pm.notes' && plan.day?.study && 'article' in plan.day.study ? c.articles.nights[monthDay(date)] : undefined;   // an article night (Books 2): the first and last day of each month, and Christmas
  const readChapters = chaptersOf(readingRefs);
  // The three books (C1): the Classic's reading for tonight, and the notes and commentary for the books the day touches, loaded like the Bible text.
  const night = c.classic.readings[classicPlace(c, her, date)];
  const notesR = useStudy('notes', step === 'pm.notes' && !own ? range.chapters.map((x) => x.b) : []);
  const digR = useStudy('dig', step === 'pm.dig' && !own ? readChapters.map((x) => x.b) : []);
  const notesChs = notesR.data ? range.chapters.filter((x) => notesR.data![x.b]?.[String(x.c)]?.length) : [];
  const digChs = digR.data ? readChapters.filter((x) => digR.data![x.b]?.[String(x.c)]?.length) : [];

  // Check-In (step 6): one check-in a day, or on a last day of the week, month, quarter or year, a "More Tonight?" list (TKC-046) of them.
  const cis = plan.checkIns;
  const ciState = (x: CheckIn) => stepState(idx, date, `pm.checkin.${x}` as StepId);
  const [ciView, setCiView] = useState<CheckIn | 'more' | null>(null);
  const ciDefault: CheckIn | 'more' = cis.length <= 1 || ahead ? (cis[0] ?? 'burnt') : (cis.find((x) => ciState(x) === 'open') ?? 'more');
  const cv = ciView ?? ciDefault;
  const ciRef = step === 'pm.checkin' && cv !== 'more' ? usfm(CHECKIN[cv].anchor) : null;
  const ciVerse = useVerses(ciRef, trans);
  // The quote line: stored per Bible where the cut would start on narration (All of Me), else the verse's opening words to a pause (TKC-052; engine/anchor.ts).
  const ciQuote = (() => { const v = ciVerse?.[0]?.verses[0]?.t; return v && cv !== 'more' ? anchorQuote(plain(v), CHECKIN[cv].quote?.[trans]) : ''; })();
  // "Need ideas? ›" is one link in the card that opens a sheet (frame-lock-7 R5, 1865); the page no longer remembers open or shut (1690, 1697 are replaced).

  // Meditate (step 7): a Name or an attribute gets six questions on one night, a block of days one question a day (the plan says which).
  const med = plan.meditation, medAll = med?.question === 'all';
  const ownMed = step === 'pm.meditate' && !medAll && her.sources.meditate === 'own';   // "My own" replaces the week's verse only; a Name night keeps its own verse
  const medRef = step === 'pm.meditate' && !ownMed ? meditateVerse(plan) : null;
  const medVerse = useVerses(medRef, trans);
  const qMark = idx.get(`${date}|pm.meditate.q`);
  const [qSel, setQSel] = useState<number | null>(null);
  const q = qSel ?? (medAll ? (typeof qMark?.value === 'number' ? qMark.value : 1) : (med?.question as number) ?? 1);
  // Prayer (step 5): 0 is the intro, 1 to 5 the parts. Her place is kept for the night (mark `pm.prayer.part`); "Don't show this again" starts her at Father.
  const pMark = idx.get(`${date}|pm.prayer.part`);
  const [pPart, setPPart] = useState<number | null>(null);
  const prayerPart = pPart ?? (typeof pMark?.value === 'number' ? pMark.value : her.reminders.prayerIntroHidden ? 1 : 0);
  const prayerPartName = prayerPart === 3 && plan.list === 6 ? 'Requests' : PRAYER.parts[Math.max(prayerPart, 1) - 1].name;
  const onCard = (step === 'pm.checkin' && cv !== 'more') || step === 'pm.turn' || step === 'pm.meditate' || (step === 'pm.prayer' && prayerPart >= 1);
  // The parts she has been on and left show a check, in any direction (frame-lock-10 §2, 3405 y). Stored as `pm.prayer.seen` ("1,2"); a day with no such mark reads the parts below her place as left (how it was drawn before 3-5y).
  // On a future day the set lives only in this screen: the pills move and nothing is written.
  const seenMark = idx.get(`${date}|pm.prayer.seen`);
  const [pSeen, setPSeen] = useState<number[] | null>(null);
  const leftParts: number[] = pSeen ?? (typeof seenMark?.value === 'string' ? seenMark.value.split(',').map(Number).filter((x) => x >= 1 && x <= 5) : [1, 2, 3, 4, 5].filter((x) => x < prayerPart));
  const goPart = (n: number) => {
    if (n !== prayerPart && prayerPart >= 1) {
      const next = [...new Set([...leftParts, prayerPart])].sort();
      setPSeen(next);
      if (!ahead) { setMark(date, 'pm.prayer.seen', 'set', next.join(',')); if (prayerPart === 2) setMark(date, 'pm.prayer.kingdom', 'done'); }
    }
    setPPart(n); if (!ahead) setMark(date, 'pm.prayer.part', 'set', n); scrollTo(0, 0);
  };
  // Kingdom's nation page opens over the prayer; ‹ Prayer comes back to the same part at the same scroll (945).
  const [nationId, setNationId] = useState<string | null>(null);
  const savedScroll = useRef<number | null>(null);
  const openNation = (id: string) => { savedScroll.current = scrollY; setNationId(id); };
  useLayoutEffect(() => { if (nationId) scrollTo(0, 0); else if (savedScroll.current != null) { scrollTo(0, savedScroll.current); savedScroll.current = null; } }, [nationId]);
  // People (part 3): tonight's rows, the count line and the Learn More sheet (frame-lock-6 §5; the key list that opened on its own is gone), the sheets over it, and the toast after an add or a remove.
  const onPeople = step === 'pm.prayer' && prayerPart === 3;
  const [pSheet, setPSheet] = useState<PeopleSheet>(null);
  const [toast, setToast] = useState<null | { message: string; action?: string; onAction?: () => void }>(null);
  const people = onPeople ? peopleTonight(her, date, plan.list, plan.prayerCount) : [];
  const askMarks = new Map(her.prayerMarks.filter((m) => m.date === date).map((m) => [m.personId, m.asks]));
  const peopleRows: PeopleRow[] = people.map(({ person: x, addedTonight }) => ({
    id: x.id, name: x.name, request: x.list === 6 ? undefined : x.request || undefined, asks: (askMarks.get(x.id) ?? []).map(askLabel),
    onAsk: (a) => { const now = askMarks.get(x.id) ?? [], k = a.toLowerCase() as (typeof now)[number]; setAsks(x.id, date, now.includes(k) ? now.filter((y) => y !== k) : [...now, k]); },
    onMore: () => setPSheet({ k: 'menu', id: x.id }) }));
  const addedN = people.filter((x) => x.addedTonight).length, why = whyTonight(plan.list, plan.prayerCount, poolFor(her, date, plan.list).length, addedN);
  const friday = onPeople && plan.list === 5;
  const fVerse = useVerses(friday ? { b: 'MAT', c: 5, v: 44 } : null, trans);
  const scrollToPerson = (id: string) => setTimeout(() => document.querySelector(`[data-person="${id}"]`)?.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }), 60);
  const personAdded = (x: Person) => {
    scrollToPerson(x.id);
    if (!getHer().reminders.firstAddNoteShown) { setReminders({ firstAddNoteShown: true }); setToast({ message: PEOPLE_SHEETS.firstAdd(LISTS[x.list].name) }); }
  };
  const personRemoved = (x: Person) => setToast({ message: PEOPLE_SHEETS.removed(x.name), action: PEOPLE_SHEETS.undo, onAction: () => { setRemoved(x.id, false); setToast(null); setTimeout(() => { const r = document.querySelector<HTMLElement>(`[data-person="${x.id}"]`); if (r) restoreRow(r); }, 0); } });
  const nights = step === 'pm.prayer' && prayerPart === 2 ? nationsFor(c, plan.day?.nations ?? []) : [];
  const nation = nationId ? nights.find((x) => x.nation.id === nationId) : undefined;
  const REV: Ref = { b: 'REV', c: 7, v: 9 };
  const nationVerse = useVerses(nation ? REV : null, trans);
  useEffect(() => { setCiView(null); setNoteOpen({}); setIdea(null); setQSel(null); setPPart(null); setPSeen(null); setNationId(null); setPSheet(null); setToast(null); savedScroll.current = null; }, [step, date]);
  const goQ = (n: number) => { setQSel(n); setMark(date, 'pm.meditate.q', 'set', n); };   // her scroll stays (frame-lock-7 §4, 1023)
  // The bar names the chapter being read: as the next chapter's title's top passes the bar's bottom edge plus 8 px, the bar's reference follows it (Review erE3 script: `data-sec` top < bar bottom + 8).
  const [chapAt, setChapAt] = useState(0);
  useEffect(() => {
    setChapAt(0);
    if (own || (step !== 'pm.dig' && step !== 'pm.notes')) return;
    const on = () => {
      const ts = [...document.querySelectorAll('.tkc-rb-ct')];
      const bb = document.querySelector('.tkc-tb')?.getBoundingClientRect().bottom ?? 0;
      let at = 0; ts.forEach((t, k) => { if (t.getBoundingClientRect().top < bb + 8) at = k; });
      setChapAt(at);
    };
    on(); addEventListener('scroll', on, { passive: true }); addEventListener('resize', on);
    return () => { removeEventListener('scroll', on); removeEventListener('resize', on); };
  }, [step, own]);

  const firstTitle = step === 'pm.notes' ? (article ? article.title : notesChs[0] ? formatRef(c, notesChs[0]) : range.chapters[0] ? formatRef(c, range.chapters[0]) : undefined) : step === 'pm.dig' ? (digChs[0] ? formatRef(c, digChs[0]) : readChapters[0] ? formatRef(c, readChapters[0]) : undefined) : undefined;
  const chapList = step === 'pm.dig' ? (digChs.length ? digChs : readChapters) : step === 'pm.notes' ? (notesChs.length ? notesChs : range.chapters) : [];
  const reference = step === 'pm.checkin' ? (cv === 'more' ? 'Check-In' : CHECKIN_NAMES[cv]) : step === 'pm.meditate' ? (ownMed ? 'My own verse' : medRef ? formatRef(c, medRef) : undefined) : step === 'pm.turn' ? formatRef(c, TURN_REF) : step === 'pm.classic' ? (own ? undefined : night.part) : (chapList[chapAt] ? formatRef(c, chapList[chapAt]) : firstTitle);

  const sourceLine = (segments: string[], about?: { onOpen: () => void; label: string }) => <SourceLine segments={segments} onAbout={about?.onOpen} aboutLabel={about?.label} change onChange={() => setSheet('book')} />;
  /** A book's About (frame-lock-12 §2): the Classic's per book, from its content; Dig Deeper's waits for its words (424). */
  const bookAbout = step === 'pm.classic' && !own ? c.classic.about?.[night.title] : undefined;

  const body = step === 'pm.turn' ? <>
      <JoinedCard kind="single" label={STEP_COPY['pm.turn'].heading} why={STEP_COPY['pm.turn'].why}>
        <StepInstruction text={STEP_COPY['pm.turn'].instruction!} />
        {turn ? <PrayerWords kind="verse" text={plain(turn.flatMap((x) => x.verses.map((v) => v.t)).join(' '))} /> : <ReadingWait phase={turnR.phase} retry={turnR.retry} />}
        <SourceLine segments={[formatRef(c, TURN_REF)]} translation={bibleName(trans)} onTranslation={() => setSheet('bible')} />
      </JoinedCard>
      <StepWhy><PrayerWords kind="meaning" text={TURN_MEANING} /></StepWhy>
    </> : step === 'pm.classic' ? <>
      <StepSource>{sourceLine(own ? ['My own book'] : [night.title, night.part], bookAbout ? { onOpen: () => setSheet('about'), label: bookAbout.title } : undefined)}</StepSource>
      {own ? <StepOwn>{OWN_LINES.classic}</StepOwn> : <>
        <ReadingBlock kind="prose" paragraphs={night.paras} />
        <StepCredit><ReadingBlock kind="credit" text={night.writer} /></StepCredit>
        {bookAbout && <StepWriter><StepAbout><TextLink kind="more" label={bookAbout.title} aria={`${bookAbout.title}. Opens where this book comes from`} onOpen={() => setSheet('about')} /></StepAbout></StepWriter>}</>}
    </> : step === 'pm.notes' ? <>
      <StepSource>{sourceLine(own ? ['My own book'] : article ? [ARTICLE.source, article.title] : ['Study notes', ...(range.text ? [range.text] : [])], own ? undefined : { onOpen: () => setSheet('notice'), label: (article ? ARTICLE.notice : NOTES_NOTICE).title })}</StepSource>
      {own ? <StepOwn>{range.text && !article ? `Read your study notes on ${range.text}.` : OWN_LINES.notes}</StepOwn>
        : article ? <>
        <ReadingBlock kind="title" text={article.title} first />
        <ReadingBlock kind="helps" afterTitle blocks={articleHelps(article.blocks)} />
        <StepCredit><ReadingBlock kind="credit" text={BOOK_CREDIT.articles} onOpen={() => setSheet('notice')} /></StepCredit></>
        : !notesR.data ? (range.chapters.length ? <ReadingWait phase={notesR.phase} retry={notesR.retry} padded /> : null)
        : notesChs.length ? <>
        {notesChs.map((ch, k, a) => { const key = `${ch.b} ${ch.c}`, folds = a.length > 1, open = !folds || (noteOpen[key] ?? k === 0); return <>
          <ReadingBlock kind="title" text={formatRef(c, ch)} first={k === 0} fold={folds ? { open, onToggle: () => setNoteOpen({ ...noteOpen, [key]: !open }) } : undefined} />
          {(() => { const b = <ReadingBlock kind="helps" afterTitle joins={k < a.length - 1} blocks={notesR.data![ch.b][String(ch.c)].map((n): HelpsBlock => ({ kind: 'rich', verse: verseLabel(n.v), blocks: n.b }))} />; return folds ? <Fold open={open}>{b}</Fold> : b; })()}
        </>; })}
        <StepCredit><ReadingBlock kind="credit" text={BOOK_CREDIT.notes} onOpen={() => setSheet('notice')} /></StepCredit></>
        : <StepMissing><EmptyState kind="missing" line={`The app doesn’t have notes for ${range.text || 'this reading'}. If you have a study Bible, read its notes on these chapters, then go on.`} actionLabel="Use My Own Study Notes" onAction={() => setSources({ studyNotes: 'own' })} /></StepMissing>}
    </> : step === 'pm.dig' ? <>
      {readChapters.length > 0 && <StepNote><AnchorLine kind="reference" text="On this morning’s reading · " keep={formatRefs(c, readingRefs)} label={`On this morning’s reading: ${formatRefs(c, readingRefs)}. Opens the reading.`} onOpen={() => setSheet('cue')} /></StepNote>}
      <StepSource after={readChapters.length ? 'anchor' : undefined}>{sourceLine(own ? ['My own book'] : ['Commentary'], own ? undefined : { onOpen: () => setSheet('notice'), label: DIG_NOTICE.title })}</StepSource>
      {own ? <StepOwn>{readChapters.length ? `Read your commentary on ${listAnd(readChapters.map((x) => formatRef(c, x)))}.` : OWN_LINES.dig}</StepOwn>
        : !digR.data ? (readChapters.length ? <ReadingWait phase={digR.phase} retry={digR.retry} padded /> : null)
        : digChs.length ? <>
        {digChs.map((ch, k, a) => <>
          <ReadingBlock kind="title" text={formatRef(c, ch)} first={k === 0} />
          <ReadingBlock kind="helps" afterTitle joins={k < a.length - 1} blocks={digR.data![ch.b][String(ch.c)].flatMap((s): HelpsBlock[] => [{ kind: 'section', text: digLabel(s.v) }, { kind: 'note', text: s.t }])} />
        </>)}
        <StepCredit><ReadingBlock kind="credit" text={BOOK_CREDIT.dig} /></StepCredit>
        <StepWriter><StepAbout><TextLink kind="more" label={DIG_NOTICE.title} aria={`${DIG_NOTICE.title}. Opens where this commentary comes from`} onOpen={() => setSheet('notice')} /></StepAbout></StepWriter></>
        : <StepMissing><EmptyState kind="missing" line={`The app doesn’t have a commentary on ${listAnd(readChapters.map((x) => formatRef(c, x))) || 'this reading'}. If you have one, read what it says about these chapters, then go on.`} actionLabel="Use My Own Commentary" onAction={() => setSources({ digDeeper: 'own' })} /></StepMissing>}
    </> : step === 'pm.prayer' ? (prayerPart === 0
      ? <PrayerIntro hidden={her.reminders.prayerIntroHidden} onHidden={(v) => setReminders({ prayerIntroHidden: v })} />
      : <PrayerPartBody part={prayerPart as 1 | 2 | 3 | 4 | 5} partName={prayerPartName} label={prayerPart === 1 ? STEP_COPY[step].heading : prayerPartName} why={prayerPart === 1 ? STEP_COPY[step].why : undefined}
        bible={trans} onAnchor={() => setSheet('prayer')} onWords={() => setSheet('words')} requests={plan.list === 6}
        nations={nights.map(({ nation: n, facts }) => ({ name: n.name, line: nationLine(facts), at: spotFor(n, facts), onOpen: () => openNation(n.id) }))}
        done={leftParts} onPart={goPart}
        count={prayerPart === 3 && !ahead && peopleRows.length > 0 ? <PeopleCount text={peopleCountLine(plan.list, people.length)} onOpen={() => setSheet('learn')} /> : undefined}
        people={prayerPart === 3 ? <PeopleContent list={plan.list} who={c.sheets.lists[plan.list].a} onList={() => setSheet('list')} rows={peopleRows} ahead={ahead} aheadDate={date} onAdd={() => setPSheet({ k: 'add' })}
          verse={friday && fVerse ? { text: plain(fVerse.flatMap((x) => x.verses.map((v) => v.t)).join(' ')), reference: 'Matthew 5:44', translation: bibleName(trans), onTranslation: () => setSheet('bible') } : undefined} /> : undefined} />)
    : step === 'pm.checkin' ? (cv === 'more'
      ? <StepRows><CheckInList rows={cis.map((x) => ({ name: CHECKIN_NAMES[x], status: ciState(x), onOpen: () => setCiView(x) }))} /></StepRows>
      : <>
        <JoinedCard band label={STEP_COPY[step].heading} why={STEP_COPY[step].why}
          top={<AnchorLine kind="quote" text={ciQuote} reference={ciRef ? formatRef(c, ciRef) : undefined} label={`${ciRef ? formatRef(c, ciRef) : ''}. Show the whole verse`} onOpen={() => setSheet('civerse')} />}>
          <AskYourself kind="question" text={CHECKIN[cv].question} />
          <AskYourself kind="move" text={CHECKIN[cv].move} />
          <TextLink kind="more" label={CHECKIN_IDEAS} aria={`${CHECKIN_IDEAS} Opens a list of ideas`} onOpen={() => { setIdea(null); setSheet('ideas'); }} />
        </JoinedCard></>)
    : <>{(() => {
      const verseBlock = ownMed ? <AskYourself kind="own" text={OWN_LINES.meditate} /> : <AskYourself kind="verse" text={medVerse ? pickedText(medVerse, trans) : undefined} />;
      const src = med && <SourceLine segments={ownMed ? ['My own verse'] : [...(medAll ? [] : [`This week: ${med.title}`]), ...(medRef ? [formatRef(c, medRef)] : [])]} translation={ownMed ? undefined : bibleName(trans)} onTranslation={() => setSheet('bible')} change={!medAll} onChange={medAll ? undefined : () => setSheet('med')} />;
      const night = medAll ? med?.night : undefined;
      return <>
        {night
          ? <JoinedCard plate band label={MEDITATE_GROUP[q - 1]} why={STEP_COPY[step].why} top={<WordMeaning eyebrow={PLATE_EYEBROW[night.kind]} mark={night.mark} name={night.word} plain={night.plain} meaning={night.meaning} kjv={trans === 'kjv' ? night.bibleNote?.kjv : undefined} />} verse={<>{src}{verseBlock}</>}>
              <MovingHalf slides={MEDITATE_Q.map((x, k) => ({ label: MEDITATE_GROUP[k], question: x, move: MEDITATE_MOVE[k] }))} at={q} onGo={goQ} count={QUESTION_OF} bare />
            </JoinedCard>
          : <JoinedCard band label={MEDITATE_GROUP[q - 1] ?? STEP_COPY[step].heading} why={STEP_COPY[step].why} verse={<>{src}{verseBlock}</>}>
              <AskYourself kind="question" text={MEDITATE_Q[q - 1]} /><AskYourself kind="move" text={MEDITATE_MOVE[q - 1]} />
            </JoinedCard>}</>;
    })()}</>;

  // The foot (TKC-003 0.6, G3): untouched → Back · Skip · Next; revisited or read ahead → Back · Next (these four are never the last step).
  const open = !ahead && mark === 'open';
  const last = i === steps.length - 1, rest = others().length;
  const walkWord = 'step' in stop || stop.end === 'still' ? 'Next' : 'Complete Evening Walk';
  /** TKC-003 0.7 (571, 572): the primary names where it goes: the next step still open, "Still Open", or nothing when the walk ends (the button then says "Complete Evening Walk"). */
  const nextTo = 'step' in stop ? STEP_NAMES[steps[stop.step]] : stop.end === 'still' ? 'Still Open' : undefined;
  /** 605: moving on from a skipped step marks it done. */
  const moveOn = () => { if (!ahead && mark === 'skipped') setMark(date, step, 'done', step === 'pm.classic' ? classicPlace(c, getHer(), date) : undefined); next(); };
  const ciDone = (state: 'done' | 'skipped') => {
    if (!ahead) setMark(date, `pm.checkin.${cv}`, state);
    if (cis.length > 1 && !ahead && cv !== 'more') { if (state === 'done') setMark(date, 'pm.checkin', 'done'); setCiView('more'); scrollTo(0, 0); }
    else finishStep(state);
  };
  const plainFoot = open
    ? { back: i > 0, skip: true, next: walkWord, to: nextTo, onBack: () => go(i - 1), onSkip: () => finishStep('skipped'), onNext: () => finishStep('done') }
    : last && (ahead || rest === 0) ? { back: i > 0, skip: false, next: 'Done', onBack: () => go(i - 1), onNext: close }
    : { back: i > 0, skip: false, next: walkWord, to: nextTo, onBack: () => go(i - 1), onNext: moveOn };
  const anyCiDone = cis.some((x) => ciState(x) === 'done');
  const prayerNext = () => { if (prayerPart < 5) goPart(prayerPart + 1); else { if (prayerPart === 2 && !ahead) setMark(date, 'pm.prayer.kingdom', 'done'); finishStep('done'); } };
  const foot = step === 'pm.prayer' && prayerPart === 0 ? { back: false, skip: false, next: 'Begin', onNext: () => goPart(1) }
    : step === 'pm.prayer' ? { back: true, skip: open, next: prayerPart < 5 ? 'Next' : walkWord, to: prayerPart < 5 ? (prayerPart === 2 && plan.list === 6 ? 'Requests' : PRAYER.parts[prayerPart].name) : nextTo, onBack: prayerPart > 1 ? () => goPart(prayerPart - 1) : () => go(i - 1), onSkip: () => finishStep('skipped'), onNext: prayerNext }
    : step === 'pm.checkin' && cv === 'more'
    ? { back: true, skip: false, next: walkWord, to: nextTo, onBack: () => go(i - 1), onNext: () => (ahead ? next() : finishStep(anyCiDone ? 'done' : 'skipped')) }
    : step === 'pm.checkin' && cis.length > 1 && !ahead && cv !== 'more' && ciState(cv) === 'open' ? { back: true, skip: true, next: 'Next', to: 'More Tonight?', onBack: () => go(i - 1), onSkip: () => ciDone('skipped'), onNext: () => ciDone('done') }
    : step === 'pm.checkin' && open ? { ...plainFoot, onSkip: () => ciDone('skipped'), onNext: () => ciDone('done') }
    : step === 'pm.meditate' && medAll ? {   // frame-lock-8 L6 (3182 y): questions 1–5 are Back and "Question N →" only (no Skip, no link under); question 6 is the step's own foot (Skip, and the main button per L1). A revisited night still walks the six questions (1872, 3017 y).
        back: true, skip: q === 6 && plainFoot.skip, next: q < 6 ? 'Next' : plainFoot.next, to: q < 6 ? `Question ${q + 1}` : plainFoot.to,
        onBack: q > 1 ? () => goQ(q - 1) : () => go(i - 1), onSkip: () => finishStep('skipped'), onNext: q < 6 ? () => goQ(q + 1) : plainFoot.onNext }
    : plainFoot;

  const rows = eveningRows(date, i);
  const learnMore = article ? ARTICLE.learn : LEARN_MORE[step];
  const pick = book && BOOK_SHEETS[book];
  if (nation) {
    const { nation: n, facts } = nation, rows = factRows(facts);
    return <NationPageView name={n.name} back="Prayer" onBack={() => setNationId(null)}
      mapLabel={`Map showing where ${n.name} is${facts?.region ? `, in ${facts.region}` : ''}`} at={spotFor(n, facts)}
      facts={rows} source={rows.length ? c.factsSource : undefined}
      verse={nationVerse ? { verse: plain(nationVerse.flatMap((x) => x.verses.map((v) => v.t)).join(' ')), reference: formatRef(c, REV), translation: bibleName(trans), onTranslation: () => setSheet('bible') } : undefined}
      overlay={sheet === 'bible' ? <BibleSheet current={trans} onPick={(b) => { setBible(b); setSheet(null); }} onClose={() => setSheet(null)} /> : undefined} />;
  }
  return <StepScreenView step={step} wash="dusk" card={onCard} ahead={ahead}
    bar={{ walk: 'Evening Walk', steps: steps.map((s) => { const x = stepState(idx, date, s); return x === 'done' ? 'done' : x === 'skipped' ? 'skip' : 'open'; }), current: i, day: dayLabel, reference, onClose: close, onSteps: () => setSheet('steps') }}
    header={{ label: STEP_NAMES[step],
      slot: step === 'pm.checkin' && cv !== 'more' ? ` · ${CHECKIN_NAMES[cv].replace(/ /g, '\u00a0')}` : undefined,
      heading: step === 'pm.prayer' ? (prayerPart === 0 ? PRAYER.introHeading : prayerPart === 1 ? STEP_COPY[step].heading : undefined) : step === 'pm.checkin' && cv === 'more' ? 'More Tonight?' : step === 'pm.meditate' && q > 3 ? 'Live It Out' : article ? ARTICLE.heading : STEP_COPY[step].heading,
      why: step === 'pm.prayer' ? (prayerPart === 1 ? STEP_COPY[step].why : undefined) : step === 'pm.checkin' && cv === 'more' ? moreLine(cis, ciState) : article ? ARTICLE.why : STEP_COPY[step].why,
      state: !ahead && mark !== 'open' && !(step === 'pm.checkin' && cis.length > 1) ? mark : undefined, onUndo: undo, onInfo: learnMore ? () => setSheet('info') : undefined }}
    foot={foot}
    overlay={<>
      {step === 'pm.prayer' && <PeopleSheets sheet={pSheet} her={her} date={date} today={t} list={plan.list} tonightIds={new Set(people.map((x) => x.person.id))}
        onClose={() => setPSheet(null)} onOpen={setPSheet} onAdded={personAdded} onRemoved={personRemoved} />}
      {toast && <ToastHost key={toast.message} message={toast.message} action={toast.action} onAction={toast.onAction} onDone={() => setToast(null)} lift />}
      {sheet === 'steps' && <SheetHost onClose={() => setSheet(null)}><StepListSheet walk="Evening Walk" steps={rows} onClose={() => setSheet(null)} onPick={(n) => { setSheet(null); if (n - 1 !== i) go(n - 1); }} /></SheetHost>}
      {sheet === 'civerse' && ciRef && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={formatRef(c, ciRef)} onClose={() => setSheet(null)}>
        <Scripture r={ciRef} kjv={trans === 'kjv'} trans={trans} titled={false} joins={false} />
        {cv !== 'more' && ANCHOR_MEANING[cv] && <ReadNote>{ANCHOR_MEANING[cv]}</ReadNote>}</BottomSheet></SheetHost>}
      {sheet === 'ideas' && cv !== 'more' && <IdeasSheet title={CHECKIN_IDEAS} set={c.sheets.checkin[cv]} idea={idea} onPick={setIdea} onBack={() => setIdea(null)} bible={trans} bibleName={bibleName(trans)} onClose={() => { setSheet(null); setIdea(null); }} />}
      {sheet === 'list' && step === 'pm.prayer' && <SheetRead title={c.sheets.lists[plan.list].name} titles={c.sheets.lists[plan.list].sections} item={c.sheets.lists[plan.list]} bible={trans} bibleName={bibleName(trans)} onClose={() => setSheet(null)} />}
      {sheet === 'info' && learnMore && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={STEP_NAMES[step]} onClose={() => setSheet(null)}><ReadBody parts={learnMore} onMore={() => { setSheet(null); nav({ s: 'lesson', step, back: route }); }} /></BottomSheet></SheetHost>}
      {sheet === 'learn' && step === 'pm.prayer' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" bare title="Tonight’s List" onClose={() => setSheet(null)}>
        <ReadLearn sections={[{ head: why.title, paragraphs: [why.body] }, { head: LEARN_ASK, items: LEARN_ITEMS(trans) }]} /></BottomSheet></SheetHost>}
      {sheet === 'words' && step === 'pm.prayer' && prayerPart >= 1 && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={NEED_WORDS} onClose={() => setSheet(null)}>
        <ReadNote>{partWords(prayerPart as 1 | 2 | 3 | 4 | 5, nights.map((x) => x.nation.name), plan.list === 6).starter ?? ''}</ReadNote></BottomSheet></SheetHost>}
      {sheet === 'prayer' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title="Matthew 6:9–13" onClose={() => setSheet(null)}>
        <Scripture r={{ b: 'MAT', c: 6, v: 9, v2: 13 }} kjv={trans === 'kjv'} trans={trans} titled={false} joins={false} /></BottomSheet></SheetHost>}
      {sheet === 'bible' && <BibleSheet current={trans} onPick={(b) => { setBible(b); setSheet(null); }} onClose={() => setSheet(null)} />}
      {sheet === 'notice' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={(step === 'pm.dig' ? DIG_NOTICE : article ? ARTICLE.notice : NOTES_NOTICE).title} onClose={() => setSheet(null)}>
        <ReadNotice sections={(step === 'pm.dig' ? DIG_NOTICE : article ? ARTICLE.notice : NOTES_NOTICE).sections} links={(step === 'pm.dig' ? DIG_NOTICE : article ? ARTICLE.notice : NOTES_NOTICE).links} /></BottomSheet></SheetHost>}
      {sheet === 'about' && bookAbout && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={bookAbout.title} onClose={() => setSheet(null)}>
        <ReadNotice sections={bookAbout.sections} links={bookAbout.links} /></BottomSheet></SheetHost>}
      {sheet === 'cue' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={formatRefs(c, readingRefs)} onClose={() => setSheet(null)}>
        <Scriptures refs={readingRefs} kjv={trans === 'kjv'} trans={trans} /></BottomSheet></SheetHost>}
      {sheet === 'med' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="pick" title={MEDITATE_SHEET.title} line={MEDITATE_SHEET.line} onClose={() => setSheet(null)}>
        <Choices kind="full" label={MEDITATE_SHEET.title}>
          <ChoiceRow name={MEDITATE_SHEET.app.name} line={MEDITATE_SHEET.app.line} chosen={!ownMed} onChoose={() => { setSources({ meditate: 'app' }); setSheet(null); }} />
          <ChoiceRow name={MEDITATE_SHEET.own.name} line={MEDITATE_SHEET.own.line} chosen={ownMed} onChoose={() => { setSources({ meditate: 'own' }); setSheet(null); }} /></Choices></BottomSheet></SheetHost>}
      {sheet === 'book' && pick && book && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="pick" title={pick.title} line={pick.line} onClose={() => setSheet(null)}>
        <Choices kind="full" label={pick.title}>
          <ChoiceRow name={pick.app.name} line={pick.app.line} chosen={!own} onChoose={() => { setSources({ [book]: 'app' }); setSheet(null); }} />
          <ChoiceRow name={pick.own.name} line={pick.own.line} chosen={own} onChoose={() => { setSources({ [book]: 'own' }); setSheet(null); }} /></Choices></BottomSheet></SheetHost>}
    </>}>
    {body}
  </StepScreenView>;
}
