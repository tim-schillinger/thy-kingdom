// Today's layout, a pattern part of the library (build-standards §5.8): the order and spacing of Today's
// components, from the specs (TKC-023 G, TKC-024 G, TKC-059 G, TKC-027 G) and the newest approved Today (F18,
// Today Finished Studio, Oct 28). It holds no data rules: the screen decides what shows and passes it in.
import { useLayoutEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { firstOpen } from '../motion';
import { WeekStrip, type WeekStripProps } from '../TKC-023-WeekStrip/WeekStrip';
import { HeroCard, type HeroCardProps } from '../TKC-024-HeroCard/HeroCard';
import { WalkLine, type WalkLineProps } from '../TKC-025-WalkLine/WalkLine';
import { Streak } from '../TKC-026-Streak/Streak';
import { ComingUp, type Moment } from '../TKC-027-ComingUp/ComingUp';
import { VerseCard, type VerseCardProps } from '../TKC-033-VerseCard/VerseCard';
import { StartHereCard } from '../TKC-059-StartHereCard/StartHereCard';
import { Button } from '../TKC-006-Button/Button';
import { TabBar, type Place } from '../TKC-001-TabBar/TabBar';
import './today.css';

export interface TodayViewProps {
  wash: 'dawn' | 'dusk';
  dateLine: string;
  title: string;
  /** The streak chip (tracking on, today only); null hides it. */
  streak?: number | null;
  /** On another day: a quiet button where the chip was (719). */
  back?: { label: string; onClick: () => void };
  week: WeekStripProps;
  startHere?: { onGo: () => void; onClose: () => void };
  hero?: HeroCardProps;
  /** Between walks, this week's verse leads (487). */
  verse?: VerseCardProps;
  walks: Array<WalkLineProps & { key: string }>;
  readAhead?: () => void; readAheadLabel?: string;
  backup?: { onGo: () => void; onClose: () => void };
  comingUp: Moment[];
  /** Coming Up's "About This Step ›" opens Your Whole Year (registry: a Coming Up row → Your Whole Year, 1220) */
  onComingUpInfo?: (m: { title: string }) => void;
  /** M12: the first time Today shows each day, and on first run, its parts rise in, `stagger` apart. */
  firstOpen?: boolean;
  onDateLine?: () => void; onStreak?: () => void; onTab?: (p: Place) => void;
  children?: ComponentChildren;
}

export function TodayView(p: TodayViewProps) {
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => { if (p.firstOpen && main.current) firstOpen([...main.current.children].flatMap((c) => (c.classList.contains('tkc-today__stack') ? [...c.children] : [c]))); }, []);
  return <div class="tkc-screen" data-wash={p.wash} data-screen="today">
    <main class="tkc-today" ref={main}>
      <div class="tkc-today__title">
        <button type="button" class="tkc-today__date ty-body-small" data-part="date" onClick={p.onDateLine}>{p.dateLine}</button>
        <div class="tkc-today__tl"><h1 class="ty-display-l" data-part="title">{p.title}</h1>
          {p.back ? <Button kind="quiet" label={p.back.label} onClick={p.back.onClick} /> : p.streak != null && <Streak days={p.streak} onOpen={p.onStreak} />}</div>
      </div>
      <WeekStrip {...p.week} />
      <div class="tkc-today__stack">
        {p.startHere && <StartHereCard kind="start-here" onGo={p.startHere.onGo} onClose={p.startHere.onClose} />}
        {p.hero && <HeroCard {...p.hero} />}
        {p.verse && <VerseCard {...p.verse} />}
        {p.walks.length > 0 && <div class="tkc-today__walks">{p.walks.map(({ key, ...w }) => <WalkLine key={key} {...w} />)}</div>}
        {p.backup && <StartHereCard kind="backup" onGo={p.backup.onGo} onClose={p.backup.onClose} />}
        {p.readAhead && <div class="tkc-today__ra"><Button kind="quiet" label={p.readAheadLabel ?? "Read Ahead"} onClick={p.readAhead} /></div>}
        {p.comingUp.length > 0 && <ComingUp rows={p.comingUp} onInfo={p.onComingUpInfo} />}
      </div>
    </main>
    <TabBar current="Today" onGo={p.onTab} />
    {p.children}
  </div>;
}
