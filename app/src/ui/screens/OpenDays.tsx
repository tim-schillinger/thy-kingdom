// Open Days (Hi-Fi Studio 7 v2.1, locked Oct 25, 1168; built on the library in 3-5t): every open day since her first day, newest first, under the month it falls in.
// She can finish one (tap it), Skip All, Clear All, or Select some days and Skip or Clear those (1144, 1153, 1166). A screen file: data and layout only.
import { useState } from 'preact/hooks';
import { useHer, today as todayFn, addMarks, removeMarks } from '../../data/store';
import { streaks, plantStage, openDays, streakIfFinished, skipDays, clearDays } from '../../engine/progress';
import { fmtShort, fmtMonthYear } from '../../engine/dates';
import type { DayMark } from '../../engine/types';
import { PROGRESS as P } from '../../copy';
import { ProgressShell, ProgressTitle, ProgressJoin, ProgressLine, ProgressButtons, ProgressMonth, ProgressDay, ProgressSettled } from '../patterns/ProgressPage';
import { ToastHost } from '../patterns/ToastHost';
import { SheetHost } from '../patterns/SheetHost';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { Button } from '../TKC-006-Button/Button';
import { GrowthPlant } from '../TKC-055-GrowthPlant/GrowthPlant';
import { OpenDayRow } from '../TKC-057-OpenDayRow/OpenDayRow';
import { SelectBar } from '../TKC-058-SelectBar/SelectBar';
import { EmptyState } from '../TKC-019-EmptyState/EmptyState';
import { BottomSheet } from '../TKC-004-BottomSheet/BottomSheet';
import type { Nav, Route } from '../App';

type Ask = { kind: 'skip' | 'clear'; days: string[]; all: boolean };

export function OpenDays({ nav }: { nav: Nav }) {
  const her = useHer(); const t = todayFn();
  const open = openDays(her, t); const n = open.length;
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [ask, setAsk] = useState<Ask | null>(null);
  const [toast, setToast] = useState<{ text: string; undo: string[] } | null>(null);
  const s = streaks(her, t);
  const anyCleared = her.dayMarks.some((m) => m.step === 'day.cleared');
  const join = n ? streakIfFinished(her, t, open.map((o) => o.date)) : 0;
  const choose = (date: string) => setPicked((p) => (p.includes(date) ? p.filter((d) => d !== date) : [...p, date]));
  const doIt = (a: Ask) => {
    const marks: DayMark[] = a.kind === 'skip' ? skipDays(her, a.days, Date.now()) : clearDays(a.days, Date.now());
    addMarks(marks); setAsk(null); setSelecting(false); setPicked([]);
    setToast({ text: P.days.toast(a.days.length, a.kind), undo: marks.map((m) => m.key) });
  };
  const all = open.map((o) => o.date);
  const nAsk = ask?.days.length ?? 0;
  let lastMonth = '';
  return <ProgressShell view="opendays" onTab={(p) => nav({ s: p.toLowerCase() } as Route)}
    top={<TopBar variant="page" label={P.days.back} onClose={() => nav({ s: 'progress' })} />}
    bar={selecting ? <SelectBar picked={picked.length} onSkip={() => picked.length && setAsk({ kind: 'skip', days: picked, all: false })} onClear={() => picked.length && setAsk({ kind: 'clear', days: picked, all: false })} /> : undefined}>
    <ProgressTitle action={n > 0 ? <Button kind="quiet" label={selecting ? P.days.done : P.days.select} onClick={() => { setSelecting(!selecting); setPicked([]); }} /> : undefined}>{P.days.title}</ProgressTitle>
    {n === 0 ? <ProgressSettled><EmptyState kind="settled" heading={P.days.settled.head} line={P.days.settled.line} /></ProgressSettled> : <>
      {!selecting && !anyCleared && join > s.current && <ProgressJoin plant={<GrowthPlant stage={plantStage(s.longest) as 0 | 1 | 2 | 3 | 4} size={32} />}>{P.days.join(n, join)}</ProgressJoin>}
      <ProgressLine>{selecting ? (picked.length ? P.days.picked(picked.length) : P.days.pick) : P.days.tap}</ProgressLine>
      {!selecting && <ProgressButtons><Button kind="primary" label={P.days.skipAll} onClick={() => setAsk({ kind: 'skip', days: all, all: true })} /><Button kind="secondary" label={P.days.clearAll} onClick={() => setAsk({ kind: 'clear', days: all, all: true })} /></ProgressButtons>}
      {open.map((o) => { const mh = fmtMonthYear(o.date).split(' ')[0]; const head = mh !== lastMonth ? (lastMonth = mh) : null;
        return <div key={o.date}>{head && <ProgressMonth>{head}</ProgressMonth>}
          <ProgressDay date={o.date}><OpenDayRow title={fmtShort(o.date)} line={o.left} mode={selecting ? 'select' : 'browse'} checked={picked.includes(o.date)}
            onPress={() => (selecting ? choose(o.date) : nav({ s: 'today', date: o.date, from: 'opendays' }))} /></ProgressDay></div>; })}
    </>}
    {ask && <SheetHost onClose={() => setAsk(null)}><BottomSheet kind="confirm" title={ask.kind === 'skip' ? P.days.ask.skip(nAsk) : P.days.ask.clear(nAsk)} line={ask.kind === 'skip' ? P.days.ask.skipLine(nAsk) : P.days.ask.clearLine(nAsk)} onClose={() => setAsk(null)}>
      <Button kind={ask.kind === 'skip' ? 'primary' : 'secondary'} label={ask.all ? (ask.kind === 'skip' ? P.days.skipAll : P.days.clearAll) : (ask.kind === 'skip' ? P.days.skipN(nAsk) : P.days.clearN(nAsk))} onClick={() => doIt(ask)} />
      <Button kind="quiet" label={P.days.ask.cancel} onClick={() => setAsk(null)} /></BottomSheet></SheetHost>}
    {toast && <ToastHost key={toast.text} message={toast.text} action={P.days.undo} onAction={() => removeMarks(toast.undo)} onDone={() => setToast(null)} />}
  </ProgressShell>;
}
