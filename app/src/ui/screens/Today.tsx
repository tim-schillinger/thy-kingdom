// Today (Flow 1; F18). A screen file: data and layout only, built from the library (build-standards §5.8).
// tools/lint-screens.mjs fails the build on any class, style or stylesheet here.
import { useEffect, useState } from 'preact/hooks';
import { isFirstOpenToday } from '../motion';
import { prefetchDay } from '../../data/prefetch';
import { syncHymnAudio } from '../../data/audio';
import { getContent } from '../../data/content';
import { useHer, today as todayFn, setReminders, setSettings } from '../../data/store';
import { now } from '../../data/clock';
import { planFor } from '../../engine/plan';
import { comingUp } from '../../engine/comingup';
import { formatRef } from '../../engine/refs';
import { markIndex, walkState, walkCounts, nextOpenStep, streaks, dayFinished, stepsOf } from '../../engine/progress';
import { EveningSheet } from './SettingsSheets';
import { addDays, daysBetween, weekday, fmtClock, fmtLong, fmtShort, eveningLeads, startOfWeek, dom, type CivilDate } from '../../engine/dates';
import { STEP_NAMES, type Walk as W } from '../../engine/types';
import { WALK, COMING_SHEETS } from '../../copy';
import { useVerses, pickedText } from '../bits';
import { weekVerse } from '../Walk';
import { TodayView } from '../patterns/Today';
import { SheetHost } from '../patterns/SheetHost';
import { StepListSheet } from '../TKC-005-StepListSheet/StepListSheet';
import { BottomSheet, ReadBody } from '../TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { morningRows } from './MorningStep';
import { eveningRows } from './EveningStep';
import { backupCardDue, saveBackup, PickADay, type Route, type Nav } from '../App';

/** Which walks were done the last time Today drew (this visit to the app): a walk that was open then and is done now plays its ✓ (M11). */
const seenDone = new Map<string, boolean>();
// ---------- Today (Flow 1; F18): data only. The look is the library's (TodayView and TKC-001, 006, 021, 023-027, 031, 033, 059).
export function Today({ route, nav }: { route: Extract<Route, { s: 'today' }>; nav: Nav }) {
  const her = useHer(); const c = getContent();
  const t = todayFn();
  const date = route.date ?? t;
  const isToday = date === t, future = date > t;
  const idx = markIndex(her.dayMarks);
  const evening = isToday ? eveningLeads(now(), her.settings.eveningStart) : true;
  const m = walkState(idx, date, 'morning'), e = walkState(idx, date, 'evening');
  const s = streaks(her, t);
  const from = route.from ?? 'today';
  const [sheet, setSheet] = useState(false);
  const [look, setLook] = useState<W | null>(null);
  const [cu, setCu] = useState<string | null>(null);
  const [done, setDone] = useState<W | null>(null);
  const [evSheet, setEvSheet] = useState(false);
  const [opening] = useState(() => isToday && !route.date && isFirstOpenToday(t));
  const earned = (w: W) => seenDone.get(`${date}|${w}`) === false && walkState(idx, date, w) === 'done';
  const earnedNow = { morning: earned('morning'), evening: earned('evening') };
  useEffect(() => { (['morning', 'evening'] as W[]).forEach((w) => seenDone.set(`${date}|${w}`, walkState(idx, date, w) === 'done')); });
  const plan = planFor(c, her, date);
  useEffect(() => { if (!future) prefetchDay(date, her, isToday && evening); }, [date, her.sources.bible, evening]);
  useEffect(() => { if (!isToday) return; const k = setTimeout(() => { syncHymnAudio(c, date, her.sources.hymnal === 'recorded'); }, 3000); return () => clearTimeout(k); }, [date, isToday, her.sources.hymnal]);   // 3-5p: the next 14 days' recordings stay on the phone (frame-lock-9 §4), after the Bible books have started loading
  // Which walk leads: the Evening Walk from her start time (469); a past day leads with whatever is open.
  const eTouched = walkCounts(idx, date, 'evening').touched > 0;
  // Frame Studio 3 (1614, 1617): a future day is look only (no hero); before her evening start, an Evening Walk she has started leads.
  const lead: W | null = future ? null : m === 'done' && e === 'done' ? null
    : isToday ? (evening ? (e !== 'done' ? 'evening' : 'morning') : (m !== 'done' ? 'morning' : e !== 'done' && eTouched ? 'evening' : null))
    : (m !== 'done' ? 'morning' : 'evening');
  const start = (walk: W) => {
    if (future) return setLook(walk);
    const st = nextOpenStep(idx, date, walk);
    if (st) nav({ s: 'step', walk, date, step: st, from });
    else setDone(walk);   // a finished walk opens its step list (frame-lock-6 §3, 1803): every step's mark, no foot
  };
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const openWhen = future ? (daysBetween(t, date) === 1 ? 'You can start it tomorrow' : daysBetween(t, date) < 7 ? `You can start it ${DAYS[weekday(date)]}` : `You can start it ${fmtShort(date)}`) : '';
  const first = her.reminders.firstDay;
  const finished = m === 'done' && e === 'done';
  const verseRef = !lead && !future && isToday && !evening && m === 'done' ? weekVerse(plan) : null;
  const verse = useVerses(verseRef, her.sources.bible);
  const verseText = pickedText(verse, her.sources.bible);
  const every = (her.settings.backupReminder ?? 'week') === 'month' ? 30 : 7;
  const markOf = (d: CivilDate) => dayFinished(idx, d) ? 'done' as const : (walkState(idx, d, 'morning') !== 'open' || walkState(idx, d, 'evening') !== 'open') ? 'part' as const
    : d < t && first && d >= first ? 'open' as const : 'none' as const;
  const heroOf = (w: W) => { const n = walkCounts(idx, date, w).touched, nx = nextOpenStep(idx, date, w);
    return { walk: WALK[w].name as 'Morning Walk' | 'Evening Walk', time: isToday ? WALK[w].time : undefined, purpose: n === 0 && !future ? WALK[w].purpose : undefined,
      count: future ? undefined : `${n} of 7 done`, button: n === 0 ? 'Start Your Walk' : 'Continue Your Walk', next: !future && nx ? `Next: ${STEP_NAMES[nx]}` : undefined,
      onGo: () => start(w), onSteps: () => start(w) }; };
  const walks = (['morning', 'evening'] as W[]).filter((w) => w !== lead).map((w) => {
    const st = walkState(idx, date, w), n = walkCounts(idx, date, w).touched;
    return { key: w, walk: WALK[w].name as 'Morning Walk' | 'Evening Walk', mark: future ? 'none' as const : st === 'done' ? 'done' as const : n ? 'part' as const : 'open' as const,
      line: future ? openWhen : w === 'evening' && isToday && !evening && n === 0 ? `Tonight starting at ${fmtClock(her.settings.eveningStart)}` : `${n} of 7 done`, play: earnedNow[w],
      onChange: w === 'evening' && isToday && !evening && n === 0 && !future ? () => setEvSheet(true) : undefined, onOpen: () => start(w) }; });
  return <TodayView firstOpen={opening} wash={isToday && evening ? 'dusk' : 'dawn'} dateLine={fmtLong(date)} title={isToday ? 'Today' : fmtShort(date)}
    streak={isToday && her.settings.tracking ? s.current : null} onStreak={() => nav({ s: 'progress' })} onDateLine={() => setSheet(true)}
    back={isToday ? undefined : { label: from === 'opendays' ? 'Back to Open Days' : 'Back to Today', onClick: () => nav(from === 'opendays' ? { s: 'opendays' } : { s: 'today' }) }}
    week={{ days: Array.from({ length: 7 }, (_, i) => { const d = addDays(startOfWeek(date), i); return { date: String(dom(d)), long: fmtLong(d), mark: markOf(d), today: d === t, viewed: d === date && d !== t, future: d > t }; }),
      onPick: (i) => { const d = addDays(startOfWeek(date), i); nav(d === t ? { s: 'today' } : { s: 'today', date: d }); } }}
    startHere={isToday && !her.reminders.startHereClosed && !finished ? { onGo: () => nav({ s: 'starthere', page: her.reminders.startHerePage ?? 1, from: 'today' }), onClose: () => setReminders({ startHereClosed: true }) } : undefined}
    hero={lead ? heroOf(lead) : undefined}
    verse={verseRef && verseText ? { label: 'This Week’s Verse', verse: verseText, reference: formatRef(c, verseRef!), translation: her.sources.bible === 'kjv' ? 'King James Version' : 'World English Bible' } : undefined}
    walks={walks}
    readAhead={finished && isToday ? () => nav({ s: 'today', date: addDays(t, 1) }) : undefined} readAheadLabel="See Tomorrow’s Walks"
    backup={isToday && backupCardDue(her, t) ? { onGo: () => saveBackup(), onClose: () => setReminders({ backupCardHiddenUntil: addDays(t, every) }) } : undefined}
    onComingUpInfo={(m) => (COMING_SHEETS[m.title] ? setCu(m.title) : nav({ s: 'year', from: 'today' }))}
    comingUp={isToday ? comingUp(c, her, t, !evening).filter((r) => r.kind !== 'evening')   /* frame-lock-12 §5 (3427 y): the Evening Walk is one row; its time and Change live on it */.map((r) => ({ title: r.title, when: r.when })) : []}
    onTab={(p) => nav({ s: p.toLowerCase() } as Route)}>
    {cu && COMING_SHEETS[cu] && <SheetHost onClose={() => setCu(null)}><BottomSheet kind="read" title={cu} onClose={() => setCu(null)}><ReadBody parts={[{ body: COMING_SHEETS[cu] }]} onMore={() => { setCu(null); nav({ s: 'year', from: 'today' }); }} /></BottomSheet></SheetHost>}
    {look && <SheetHost onClose={() => setLook(null)}><StepListSheet walk={WALK[look].name as 'Morning Walk' | 'Evening Walk'} steps={look === 'morning' ? morningRows(date, -1) : eveningRows(date, -1)} look onClose={() => setLook(null)} /></SheetHost>}
    {done && <SheetHost onClose={() => setDone(null)}><StepListSheet walk={WALK[done].name as 'Morning Walk' | 'Evening Walk'} steps={done === 'morning' ? morningRows(date, -1) : eveningRows(date, -1)} onClose={() => setDone(null)} onPick={(n) => { const w = done; setDone(null); nav({ s: 'step', walk: w, date, step: stepsOf(w)[n - 1], from }); }} /></SheetHost>}
    {evSheet && <EveningSheet onClose={() => setEvSheet(false)} />}
    {sheet && <PickADay date={date} first={first} onClose={() => setSheet(false)} onPick={(d) => { setSheet(false); nav(d === t ? { s: 'today' } : { s: 'today', date: d }); }} />}
  </TodayView>;
}

