// Still Open (registry §2, esph h5 to h8; 895 to 911): the steps of a walk still open, by their own numbers, one tap from doing each, with the steps already handled
// under them, gray. A screen file: data and layout only (build-standards §5.8). Reached when a walk's last step is passed with steps still open.
import { useEffect, useState } from 'preact/hooks';
import { useHer, today as todayFn } from '../../data/store';
import { markIndex, stepState, stepsOf } from '../../engine/progress';
import { fmtShort } from '../../engine/dates';
import { STEP_NAMES } from '../../engine/types';
import { finish } from '../Walk';
import { StillToDoView } from '../patterns/StillToDo';
import { SheetHost } from '../patterns/SheetHost';
import { StepListSheet } from '../TKC-005-StepListSheet/StepListSheet';
import { morningRows } from './MorningStep';
import { eveningRows } from './EveningStep';
import type { Route, Nav } from '../App';

export function StillToDo({ route, nav }: { route: Extract<Route, { s: 'still' }>; nav: Nav }) {
  const her = useHer(); const t = todayFn();
  const { walk, date, from } = route;
  const steps = stepsOf(walk), idx = markIndex(her.dayMarks);
  const past = date !== t;
  const [list, setList] = useState(false);
  const open = steps.filter((s) => stepState(idx, date, s) === 'open');
  const done = steps.filter((s) => stepState(idx, date, s) !== 'open').map((s) => ({ name: STEP_NAMES[s], skipped: stepState(idx, date, s) === 'skipped' }));
  const backTo = () => nav(from === 'opendays' ? { s: 'opendays' } : { s: 'today' });
  const goStep = (s: (typeof steps)[number]) => nav({ s: 'step', walk, date, step: s, from });
  const barName = walk === 'morning' ? 'Morning Walk' as const : 'Evening Walk' as const;
  const bar = { walk: barName, steps: steps.map((s) => { const x = stepState(idx, date, s); return x === 'done' ? 'done' as const : x === 'skipped' ? 'skip' as const : 'open' as const; }), day: past ? fmtShort(date) : undefined, onClose: backTo, onSteps: () => setList(true) };
  const back = from === 'opendays' ? 'Back to Open Days' : 'Back to Today';
  // Nothing left open (a step was finished some other way): the walk is complete, so go there instead of showing an empty list.
  useEffect(() => { if (!open.length) finish(walk, date, from, nav); }, [open.length]);
  if (!open.length) return null;
  return <StillToDoView wash={walk === 'morning' ? 'dawn' : 'dusk'} kind={walk} bar={bar}
    heading={open.length === 1 ? '1 More Step to Complete Your Walk' : `${open.length} More Steps to Complete Your Walk`}
    rows={open.map((s) => ({ n: steps.indexOf(s) + 1, name: STEP_NAMES[s], onClick: () => goStep(s) }))}
    done={done}
    foot={{ foot: 'two', next: `Go to ${STEP_NAMES[open[0]]}`, below: back, onNext: () => goStep(open[0]), onBelow: backTo }}
    overlay={list && <SheetHost onClose={() => setList(false)}><StepListSheet walk={barName} steps={walk === 'morning' ? morningRows(date, -1) : eveningRows(date, -1)} onClose={() => setList(false)} onPick={(n) => { setList(false); goStep(steps[n - 1]); }} /></SheetHost>} />;
}
