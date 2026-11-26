// Progress (Hi-Fi Studio 7 v2.1, locked Oct 25, 1168; built on the library in 3-5t): the plant and the streak, the four milestones, the four outward counts, any open days, and Psalm 1:3.
// A screen file: data and layout only, built from the library (build-standards §5.8). It moves only for what was gained since she last looked (engine progressGain, 1165).
import { useEffect, useRef, useState } from 'preact/hooks';
import { getContent } from '../../data/content';
import { useHer, today as todayFn, setReminders } from '../../data/store';
import { streaks, plantStage, openDays, streakIfFinished, tiles, milestoneFar, progressGain } from '../../engine/progress';
import { PROGRESS as P } from '../../copy';
import { VerseText } from '../bits';
import { motionOff } from '../motion';
import { ProgressShell, ProgressTitle, ProgressVerse, useProgressMotion } from '../patterns/ProgressPage';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { Streak } from '../TKC-026-Streak/Streak';
import { MilestonePath } from '../TKC-056-MilestonePath/MilestonePath';
import { MetricTile, METRIC_LABELS } from '../TKC-050-MetricTile/MetricTile';
import { OpenDayRow } from '../TKC-057-OpenDayRow/OpenDayRow';
import type { Nav, Route } from '../App';

export function Progress({ nav }: { nav: Nav }) {
  const her = useHer(); const c = getContent(); const t = todayFn();
  const s = streaks(her, t); const open = openDays(her, t); const tl = tiles(her, c);
  const stage = plantStage(s.longest) as 0 | 1 | 2 | 3 | 4;
  const counts = [tl.prayed, tl.nations, tl.chapters, tl.answered];
  const now = { current: s.current, stage, tiles: counts, start: s.start, on: t };
  // Frozen at the first draw: the page records what she saw once it has drawn, and that write must not stop its own motion.
  const [gain] = useState(() => progressGain(her.reminders.progressSeen, now));
  const [shown, setShown] = useState<0 | 1 | 2 | 3 | 4>(() => (gain.stage && !motionOff() ? (gain.fromStage as 0 | 1 | 2 | 3 | 4) : stage));
  const root = useRef<HTMLDivElement>(null);
  useProgressMotion(root, gain, now);
  useEffect(() => {
    const id = shown !== stage ? setTimeout(() => setShown(stage), 500) : undefined;   // the track fills from 500 ms over 600
    const seen = her.reminders.progressSeen;
    if (!seen || seen.current !== now.current || seen.stage !== now.stage || seen.tiles.join() !== now.tiles.join() || seen.start !== now.start || seen.on !== now.on) setReminders({ progressSeen: now });
    return () => { if (id) clearTimeout(id); };
  }, []);
  const join = open.length ? streakIfFinished(her, t, open.map((o) => o.date)) : 0;
  const n = open.length;
  return <ProgressShell view="progress" rootRef={root} onTab={(p) => nav({ s: p.toLowerCase() } as Route)}
    top={<TopBar variant="page" label={P.back} onClose={() => nav({ s: 'today' })} />}>
    <ProgressTitle>{P.title}</ProgressTitle>
    <Streak kind="card" days={s.current} stage={stage} longest={s.longest} join={gain.join && !motionOff()} />
    <MilestonePath earned={shown} far={milestoneFar(s.current, s.longest)} play={(gain.streak || gain.stage) && !motionOff()} />
    <MetricTile tiles={METRIC_LABELS.map((label, i) => ({ n: counts[i], label }))} />
    {n > 0 && <OpenDayRow kind="summary" title={n === 1 ? P.open.one : P.open.many(n)} line={join > s.current ? P.open.grows(join) : undefined} onPress={() => nav({ s: 'opendays' })} />}
    <ProgressVerse reference={P.verseRef}><VerseText r={{ b: 'PSA', c: 1, v: 3 }} trans={her.sources.bible} /></ProgressVerse>
  </ProgressShell>;
}
