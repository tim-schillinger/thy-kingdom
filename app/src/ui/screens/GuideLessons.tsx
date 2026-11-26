// A walk's steps and a step's page in the Guide (IA, Guide: "A step's page", four parts, 1947 c; claude/content/step-lessons.md, approved Nov 13, 2026).
// The list: each step with its Start Here line. The page: What You Do and Why It Matters (the Learn More sheet's two parts, word for word), Tips, In the Bible, then "[Next step] →".
import { useBodySwap } from '../motion';
import { STEP_NAMES, type StepId, type Walk as W } from '../../engine/types';
import { LEARN_MORE, LESSONS, GUIDE, START_HERE, WALK } from '../../copy';
import { MORNING_STEPS } from './MorningStep';
import { GuideShell, GuideRun, GuideTitle, GuideLine, GuideRows, GuideSection, GuideText, GuideTips, GuideVerseNote, GuideNav } from '../patterns/GuidePage';
import { useState } from 'preact/hooks';
import { Verse } from './GuideVerse';
import { Disclosure } from '../TKC-014-Disclosure/Disclosure';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { StepListSheet } from '../TKC-005-StepListSheet/StepListSheet';
import { SheetHost } from '../patterns/SheetHost';
import { ListRow } from '../TKC-015-ListRow/ListRow';
import { Button } from '../TKC-006-Button/Button';
import type { GuideVerse } from '../../copy';
import type { Nav, Route } from '../App';
import type { Place } from '../patterns/SettingsPage';

export const EVENING_ORDER: StepId[] = ['pm.turn', 'pm.classic', 'pm.notes', 'pm.dig', 'pm.prayer', 'pm.checkin', 'pm.meditate'];
const stepsOf = (w: W) => (w === 'morning' ? MORNING_STEPS : EVENING_ORDER);
const walkOf = (s: StepId): W => (s.startsWith('am.') ? 'morning' : 'evening');
const nameOf = (w: W) => WALK[w].name;
/** A step's one line, the same one Start Here's pages 2 and 3 show. */
const lineOf = (w: W, k: number) => START_HERE.pages[w === 'morning' ? 1 : 2].steps![k][1];

export function GuideWalk({ walk, nav }: { walk: W; nav: Nav }) {
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  return <GuideShell view={`walk-${walk}`} onTab={go} top={<TopBar variant="page" label={GUIDE.title} onClose={() => nav({ s: 'guide' })} />}>
    <GuideTitle>{nameOf(walk)}</GuideTitle>
    <GuideLine>{GUIDE.walkPage[walk]}</GuideLine>
    <GuideRows label={`Steps of the ${nameOf(walk)}`}>
      {stepsOf(walk).map((s, k) => <ListRow key={s} kind="lesson" n={k + 1} name={STEP_NAMES[s]} guideLine={lineOf(walk, k)} onClick={() => nav({ s: 'lesson', step: s })} />)}
    </GuideRows>
  </GuideShell>;
}

export function Lesson({ step, back, nav }: { step: StepId; back?: Route; nav: Nav }) {
  const w = walkOf(step), list = stepsOf(w), k = list.indexOf(step), next = list[k + 1];
  const [doing, why] = LEARN_MORE[step]!, L = LESSONS[step];
  // From a step's Learn More the page goes back to that step; from the Guide, to the walk's list.
  const backLabel = back && back.s === 'step' ? STEP_NAMES[back.step] : nameOf(w);
  const leave = () => nav(back ?? { s: 'guidewalk', walk: w });
  const [lessons, setLessons] = useState(false);
  useBodySwap(step, k, '.tkc-guide-run', 'main', '.tkc-guide__foot');   // motion-lock-2 M17: lesson to lesson moves as the walk's steps do
  // frame-lock-12 §4 (3426 y): a lesson's bar is the walk's bar: the walk's name over the seven marks, this lesson ringed, no states, no book; its name opens the lessons as a list.
  return <GuideRun view={`lesson-${step}`} top={<TopBar walk={nameOf(w) as 'Morning Walk' | 'Evening Walk'} steps={list.map(() => 'open' as const)} current={k} guide={{ closeLabel: `Close, back to ${backLabel}` }} onClose={leave} onSteps={() => setLessons(true)} />}
    foot={next ? <GuideNav><Button kind="secondary" label={STEP_NAMES[next]} arrow onClick={() => nav({ s: 'lesson', step: next, back })} /></GuideNav> : <GuideNav><Button kind="secondary" label={nameOf(w)} onClick={() => nav({ s: 'guidewalk', walk: w })} /></GuideNav>}>
    <GuideTitle>{STEP_NAMES[step]}</GuideTitle>
    <GuideSection head={GUIDE.parts.do}><GuideText>{doing.body}</GuideText></GuideSection>
    <GuideSection head={GUIDE.parts.why}><GuideText>{why.body}</GuideText></GuideSection>
    <GuideSection head={GUIDE.parts.tips}><GuideTips items={L.tips} /></GuideSection>
    <GuideSection><InBible line={L.line} verse={L.verse} /></GuideSection>
    {lessons && <SheetHost onClose={() => setLessons(false)}><StepListSheet walk={nameOf(w) as 'Morning Walk' | 'Evening Walk'} steps={list.map((s, i) => ({ n: i + 1, name: STEP_NAMES[s], mark: i === k ? 'current' as const : 'none' as const }))} onClose={() => setLessons(false)} onPick={(n) => { setLessons(false); if (n - 1 !== k) nav({ s: 'lesson', step: list[n - 1], back }); }} /></SheetHost>}
  </GuideRun>;
}

/** In the Bible on a step's page: the TKC-014 prose accordion, closed until she opens it (3302). */
function InBible({ line, verse }: { line: string; verse: GuideVerse }) {
  const [open, setOpen] = useState(false);
  return <Disclosure label={GUIDE.parts.bible} open={open} onToggle={() => setOpen(!open)} line={line} verses={<Verse v={verse} />} />;
}
