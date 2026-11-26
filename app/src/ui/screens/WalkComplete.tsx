// Morning Walk Complete (registry §2 "Walk Complete", locked 865, States approved 890). A screen file: data and layout only (build-standards §5.8).
// ✕ is the only way out (F19: back to Open Days when catch-up started there). Evening Walk Complete and Day Complete (Sprint 3.1b chat 16) are in this file too.
import { useState } from 'preact/hooks';
import { getContent } from '../../data/content';
import { useHer, today as todayFn } from '../../data/store';
import { planFor } from '../../engine/plan';
import { comingUp } from '../../engine/comingup';
import { markIndex, stepState, stepsOf, walkState, streaks, plantStage } from '../../engine/progress';
import { formatRef } from '../../engine/refs';
import { fmtShort } from '../../engine/dates';
import { STEP_NAMES } from '../../engine/types';
import { END, COMING_SHEETS } from '../../copy';
import { BottomSheet, ReadBody } from '../TKC-004-BottomSheet/BottomSheet';
import { useVerses, pickedText } from '../bits';
import { weekVerse } from '../Walk';
import { WalkCompleteView } from '../patterns/WalkComplete';
import { Streak } from '../TKC-026-Streak/Streak';
import { SheetHost } from '../patterns/SheetHost';
import { StepListSheet } from '../TKC-005-StepListSheet/StepListSheet';
import { morningRows } from './MorningStep';
import { eveningRows } from './EveningStep';
import type { Route, Nav } from '../App';
import type { CivilDate } from '../../engine/dates';

const BIBLE = (b: string) => (b === 'kjv' ? 'King James Version' : 'World English Bible');
const barSteps = (walk: 'morning' | 'evening', date: CivilDate, idx: ReturnType<typeof markIndex>) =>
  stepsOf(walk).map((s) => { const x = stepState(idx, date, s); return x === 'done' ? 'done' as const : x === 'skipped' ? 'skip' as const : 'open' as const; });

/** Morning Walk Complete and Evening Walk Complete (the walk's own end screen). */
export function WalkComplete({ route, nav }: { route: Extract<Route, { s: 'walkdone' }>; nav: Nav }) {
  const her = useHer(); const c = getContent(); const t = todayFn();
  const { walk, date, from } = route;
  const steps = stepsOf(walk), idx = markIndex(her.dayMarks);
  const past = date !== t;
  const plan = planFor(c, her, date);
  const [list, setList] = useState(false);
  const [cu, setCu] = useState<string | null>(null);
  const r = walk === 'morning' ? weekVerse(plan) : null;
  const v = useVerses(r, her.sources.bible);
  const text = pickedText(v, her.sources.bible);
  const backTo = () => nav(from === 'opendays' ? { s: 'opendays' } : { s: 'today' });
  const done = steps.filter((s) => stepState(idx, date, s) !== 'open').map((s) => ({ name: STEP_NAMES[s], skipped: stepState(idx, date, s) === 'skipped' }));
  const bar = { walk: walk === 'morning' ? 'Morning Walk' as const : 'Evening Walk' as const, steps: barSteps(walk, date, idx), day: past ? fmtShort(date) : undefined, onClose: backTo, onSteps: () => setList(true) };
  const info = (m: { title: string }) => (COMING_SHEETS[m.title] ? setCu(m.title) : nav({ s: 'year', from: 'today' }));
  const cuSheet = cu && COMING_SHEETS[cu] && <SheetHost onClose={() => setCu(null)}><BottomSheet kind="read" title={cu} onClose={() => setCu(null)}><ReadBody parts={[{ body: COMING_SHEETS[cu] }]} onMore={() => { setCu(null); nav({ s: 'year', from: 'today' }); }} /></BottomSheet></SheetHost>;
  const sheet = <>{list && <SheetHost onClose={() => setList(false)}><StepListSheet walk={bar.walk} steps={walk === 'morning' ? morningRows(date, -1) : eveningRows(date, -1)} onClose={() => setList(false)} onPick={(n) => { setList(false); nav({ s: 'step', walk, date, step: steps[n - 1], from }); }} /></SheetHost>}{cuSheet}</>;
  if (walk === 'evening') {
    const morningOpen = walkState(idx, date, 'morning') !== 'done';
    const goMorning = () => { const s = stepsOf('morning').find((x) => stepState(idx, date, x) === 'open')!; nav({ s: 'step', walk: 'morning', date, step: s, from }); };
    const back = from === 'opendays' ? 'Back to Open Days' : 'Back to Today';
    return <WalkCompleteView wash="dusk" kind="evening" bar={bar} heading={END.eveningDone} line={past ? END.pastLine : END.eveningLine} done={done}
      nudge={morningOpen ? (past ? END.morningOpenPast : END.morningOpen) : undefined}
      foot={morningOpen ? { foot: 'two', next: 'Go to Morning Walk', below: back, onNext: goMorning, onBelow: backTo } : { foot: 'completion', next: back, onNext: backTo }}
      overlay={sheet} />;
  }
  return <WalkCompleteView wash="dawn" bar={bar}
    heading={END.morningDone} line={past ? END.pastLine : END.morningLine} done={done}
    foot={{ foot: 'completion', next: from === 'opendays' ? 'Back to Open Days' : 'Back to Today', onNext: backTo }}
    verse={r && text ? { label: 'Take This Into Your Day', verse: text, reference: formatRef(c, r), translation: BIBLE(her.sources.bible) } : undefined}
    comingUp={!past ? comingUp(c, her, t, true).slice(0, 1).map((x) => ({ title: x.title, when: x.when })) : []} onComingUpInfo={info}
    overlay={sheet} />;
}

const DAY_VERSE = { b: 'PSA', c: 92, v: 1, c2: 92, v2: 3 } as const;   // Psalm 92:1–3 (1997 y, Nov 13; TKC-033 0.1.5)
/** Day Complete (registry §2, Sprint 3.1b chat 16): the large mark (no burst when tracking is off, 880), the streak badge, the two walks, Psalm 92:1–3, Amen. */
export function DayComplete({ route, nav }: { route: Extract<Route, { s: 'daydone' }>; nav: Nav }) {
  const her = useHer(); const c = getContent(); const t = todayFn();
  const { date, from } = route;
  const past = date !== t;
  const idx = markIndex(her.dayMarks);
  const st = streaks(her, t);
  const [list, setList] = useState(false);
  const r = DAY_VERSE;
  const v = useVerses(r, her.sources.bible);
  // 1468 (c): the card leaves out the psalm's title line ("A Psalm. A song for the Sabbath day."), which the Bible's text carries at the start of verse 1; every other word stays.
  const text = v?.flatMap((x) => x.verses.map((s) => s.t)).join(' ').replace(/\[|\]/g, '').replace(/^A Psalm[^.]*\.\s+(A song[^.]*\.\s+)?/i, '');   // WEB: "A Psalm. A song for the Sabbath day." (two sentences); KJV: "A Psalm or Song for the sabbath day." (one). Chat 18: the first fix took only "A Psalm."
  const amen = () => nav(from === 'opendays' ? { s: 'opendays' } : { s: 'today' });
  const tracking = her.settings.tracking;
  return <WalkCompleteView wash="dusk" kind="day" mark={{ size: 'large', burst: tracking }} doneContent="walks"
    bar={{ walk: 'Evening Walk', steps: barSteps('evening', date, idx), day: past ? fmtShort(date) : undefined, onClose: amen, onSteps: () => setList(true) }}
    heading={END.dayDone} line={past ? END.dayPastLine : END.dayLine}
    badge={tracking && st.current >= 2 ? <Streak kind="badge" days={st.current} stage={plantStage(st.longest)} /> : undefined}
    done={[{ name: 'Morning Walk' }, { name: 'Evening Walk' }]}
    verse={text ? { verse: text, reference: formatRef(c, r), translation: BIBLE(her.sources.bible) } : undefined}
    foot={{ foot: 'completion', next: 'Amen', sub: 'Complete Day', onNext: amen }}
    overlay={list && <SheetHost onClose={() => setList(false)}><StepListSheet walk="Evening Walk" steps={eveningRows(date, -1)} onClose={() => setList(false)} onPick={(n) => { setList(false); nav({ s: 'step', walk: 'evening', date, step: stepsOf('evening')[n - 1], from }); }} /></SheetHost>} />;
}
