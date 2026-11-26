// Go Deeper (Guide; claude/content/go-deeper.md, approved Nov 18, 2026): the Lord's Prayer part by part, and a check-in's lesson page, twelve swipe area cards, and the center question.
// Data and layout only (build-standards §5.8). Nothing is marked or counted (1196). The words are copy.ts's GODEEPER and CHECKIN, and the area's name and description are sheets.json's.
import { useState } from 'preact/hooks';
import { useHer } from '../../data/store';
import { getContent } from '../../data/content';
import { formatRef } from '../../engine/refs';
import type { Ref } from '../../engine/types';
import { CHECKIN_NAMES, type CheckIn } from '../../engine/types';
import { GODEEPER, PRAYER, CHECKIN } from '../../copy';
import { GuideRun, GuideShell, GuideTitle, GuideLine, GuideText, GuideSection } from '../patterns/GuidePage';
import { GDProgress, GDAnchor, GDAim, GDWays, GDMove, GDBible, GDArea, GDCenter, GDCircle } from '../patterns/GoDeeperPage';
import { SheetHost } from '../patterns/SheetHost';
import { BottomSheet, ReadNote } from '../TKC-004-BottomSheet/BottomSheet';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { PrayerProgress } from '../TKC-040-PrayerProgress/PrayerProgress';
import { PrayerWords } from '../TKC-035-PrayerWords/PrayerWords';
import { AnchorLine } from '../TKC-052-AnchorLine/AnchorLine';
import { Stepper } from '../TKC-028-Stepper/Stepper';
import { Disclosure } from '../TKC-014-Disclosure/Disclosure';
import { AreaCircle } from '../TKC-060-AreaCircle/AreaCircle';
import { JoinedCard } from '../TKC-062-JoinedCard/JoinedCard';
import { SwipeCard } from '../TKC-063-MovingHalf/SwipeCard';
import { AskYourself } from '../TKC-039-AskYourself/AskYourself';
import { Button } from '../TKC-006-Button/Button';
import { ActionBar } from '../TKC-003-ActionBar/ActionBar';
import { Verse } from './GuideVerse';
import { Scripture, bibleName, plain } from './MorningStep';
import { useVerses } from '../bits';
import { anchorQuote } from '../../engine/anchor';
import type { Nav, Route } from '../App';
import type { Place } from '../patterns/SettingsPage';
import { ANCHOR_MEANING } from '../../copy';

const usfm = (s: string): Ref => { const [b, cv] = s.split(' '); const [c, v] = cv.split(':'); return { b, c: +c, ...(v ? { v: +v } : {}) }; };
const PART_REF: Ref[] = [{ b: 'MAT', c: 6, v: 9 }, { b: 'MAT', c: 6, v: 9, v2: 10 }, { b: 'MAT', c: 6, v: 11, v2: 13 }, { b: 'MAT', c: 6, v: 13 }, { b: 'MAT', c: 6, v: 13 }];

export type GoDeeperRoute = Extract<Route, { s: 'godeeper' }>;

/** The Lord's Prayer, part n of 5 (TKC-035 0.3). */
export function GoDeeperPrayer({ part, nav }: { part: 1 | 2 | 3 | 4 | 5; nav: Nav }) {
  const her = useHer(), trans = her.sources.bible, c = getContent();
  const [open, setOpen] = useState(false), [sheet, setSheet] = useState(false);
  const p = GODEEPER.parts[part - 1];
  const quote = trans === 'kjv' ? ('anchorKjv' in p && p.anchorKjv ? p.anchorKjv : PRAYER.anchorText.kjv[part - 1]) : p.anchor;
  const go = (to: number) => nav({ s: 'godeeper', what: 'prayer', part: to as 1 });
  const leave = () => nav({ s: 'guide' });
  return <GuideRun view={`godeeper-prayer-${part}`} top={<TopBar variant="run" label={GODEEPER.prayer.name} onClose={leave} />}
    foot={<ActionBar skip={false} back={part > 1} foot="step" next={part === 5 ? GODEEPER.area.done : GODEEPER.area.nextBtn} onBack={() => go(part - 1)} onNext={() => (part === 5 ? leave() : go(part + 1))} />}>
    <GDProgress><PrayerProgress part={part} /></GDProgress>
    <GDAnchor><AnchorLine kind="quote" text={quote} label={`From the Lord’s Prayer, ${p.ref}. Open the passage`} onOpen={() => setSheet(true)} /></GDAnchor>
    <GDAim><PrayerWords kind="aim" text={p.aim} /></GDAim>
    <GDWays head={GODEEPER.prayer.ways}><Stepper steps={p.ways.map(([name, line]) => ({ name, line }))} /></GDWays>
    {p.move && <GDMove><PrayerWords kind="move" text={p.move} /></GDMove>}
    <GDBible><Disclosure label={GODEEPER.prayer.bible} open={open} onToggle={() => setOpen(!open)} line={p.line} verses={<Verse v={p.verse} />} /></GDBible>
    {sheet && <SheetHost onClose={() => setSheet(false)}><BottomSheet kind="read" title={p.ref} onClose={() => setSheet(false)}>
      <Scripture r={PART_REF[part - 1]} kjv={trans === 'kjv'} trans={trans} titled={false} joins={false} /></BottomSheet></SheetHost>}
  </GuideRun>;
}

/** A check-in's areas: name, description (sheets.json's first section) for each. */
const areasOf = (ci: CheckIn) => getContent().sheets.checkin[ci].items as Array<{ word: string; a: string }>;

/** The check-in's lesson page (entry; registry row 133, words 3325–3330): title, line, body, the circle of 12, Begin, then In the Bible (the TKC-014 prose accordion, closed). */
export function GoDeeperEntry({ ci, nav }: { ci: CheckIn; nav: Nav }) {
  const n = areasOf(ci).length, E = GODEEPER.entry[ci], B = GODEEPER.entryBody;
  const [open, setOpen] = useState(false);
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  return <GuideShell view={`godeeper-${ci}`} onTab={go} top={<TopBar variant="page" label="Guide" onClose={() => nav({ s: 'guide' })} />}>
    <GuideTitle>{CHECKIN_NAMES[ci]}</GuideTitle>
    <GuideLine>{E.line}</GuideLine>
    <GuideText>{`${B.before}${E.when}${B.after} ${B.more(n)}${E.note ? ` ${E.note}` : ''}`}</GuideText>
    <GDCircle><AreaCircle size={168} total={n} /></GDCircle>
    <Button kind="primary" width="full" label={GODEEPER.area.begin} onClick={() => nav({ s: 'godeeper', what: 'checkin', ci, at: 1 })} />
    <GuideSection><Disclosure label={GODEEPER.prayer.bible} open={open} onToggle={() => setOpen(!open)} line={E.bible} verses={<>{E.verses.map((v) => <Verse key={`${v.ref.b}${v.ref.c}${v.ref.v}`} v={v} />)}</>} /></GuideSection>
  </GuideShell>;
}

/** One swipe card per area, then the center question. */
export function GoDeeperAreas({ ci, at, nav }: { ci: CheckIn; at: number | 'center'; nav: Nav }) {
  const items = areasOf(ci), n = items.length, W = GODEEPER.checkins[ci], C = CHECKIN[ci];
  const name = CHECKIN_NAMES[ci], leave = () => nav({ s: 'guide' });
  // Area to area keeps her place on the page (Nov 20); the center question is a new page and starts at the top.
  const to = (a: number | 'center') => nav({ s: 'godeeper', what: 'checkin', ci, at: a }, { keepScroll: a !== 'center' });
  const slides = items.map((x) => ({ eyebrow: W.small, name: x.word, meaning: x.a, question: W.question, move: C.move }));
  if (at === 'center') return <CenterQuestion ci={ci} n={n} onBack={() => to(n)} onDone={leave} onClose={leave} />;
  return <GuideRun view={`godeeper-${ci}-area`} top={<TopBar variant="run" label={name} onClose={leave} />}
    foot={<ActionBar skip={false} foot="step" next={GODEEPER.area.nextBtn} onBack={() => (at > 1 ? to(at - 1) : nav({ s: 'godeeper', what: 'checkin', ci, at: 0 }))} onNext={() => (at < n ? to(at + 1) : to('center'))} />}>
    <GDArea circle={<AreaCircle size={96} area={at} total={n} />} label={GODEEPER.area.of(at, n)}>
      <SwipeCard slides={slides} at={at} onGo={to} prev={GODEEPER.area.prev} next={GODEEPER.area.next} /></GDArea>
  </GuideRun>;
}

function CenterQuestion({ ci, n, onBack, onDone, onClose }: { ci: CheckIn; n: number; onBack: () => void; onDone: () => void; onClose: () => void }) {
  const her = useHer(), trans = her.sources.bible, c = getContent(), [sheet, setSheet] = useState(false);
  const r = usfm(CHECKIN[ci].anchor), verse = useVerses(r, trans)?.[0]?.verses[0]?.t;
  // The same quote line the Check-In step shows for this verse in her Bible (3331 y): stored per Bible where the cut would start on narration, else the opening words to a pause (TKC-052; engine/anchor.ts).
  const quote = verse ? anchorQuote(plain(verse), CHECKIN[ci].quote?.[trans]) : '';
  return <GuideRun view={`godeeper-${ci}-center`} top={<TopBar variant="run" label={CHECKIN_NAMES[ci]} onClose={onClose} />}
    foot={<ActionBar skip={false} foot="step" next={GODEEPER.area.done} onBack={onBack} onNext={onDone} />}>
    <GDCenter circle={<AreaCircle size={96} area="all" total={n} />} title={GODEEPER.area.center}>
      <JoinedCard top={quote ? <AnchorLine kind="quote" text={quote} reference={formatRef(c, r)} label={`${formatRef(c, r)}. Show the whole verse`} onOpen={() => setSheet(true)} /> : undefined} label={GODEEPER.area.center} quietLabel>
        <AskYourself kind="question" text={CHECKIN[ci].question} />
        <AskYourself kind="move" text={CHECKIN[ci].move} /></JoinedCard></GDCenter>
    {sheet && <SheetHost onClose={() => setSheet(false)}><BottomSheet kind="read" title={formatRef(c, r)} onClose={() => setSheet(false)}>
      <Scripture r={r} kjv={trans === 'kjv'} trans={trans} titled={false} joins={false} />
      {ANCHOR_MEANING[ci] && <ReadNote>{ANCHOR_MEANING[ci]}</ReadNote>}</BottomSheet></SheetHost>}
  </GuideRun>;
}
