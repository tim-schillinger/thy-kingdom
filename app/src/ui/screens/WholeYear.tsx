// Your Whole Year (IA, Guide › Rhythms; claude/content/start-here.md, approved Nov 14, 2026, 3060–3071): how a day, a week, a month, a quarter and a year fit together. Counts nothing.
import { YEAR } from '../../copy';
import { GuideShell, GuideTitle, GuideLine, GuideSection, GuideSub, GuideFacts, GuideNote } from '../patterns/GuidePage';
import { Verse } from './GuideVerse';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { InfoRow } from '../TKC-016-InfoRow/InfoRow';
import type { Nav, Route } from '../App';
import type { Place } from '../patterns/SettingsPage';

export function WholeYear({ route, nav }: { route: Extract<Route, { s: 'year' }>; nav: Nav }) {
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  const fromStart = route.from === 'starthere', fromToday = route.from === 'today';
  return <GuideShell view="year" onTab={go} top={<TopBar variant="page" label={fromStart ? 'Start Here' : fromToday ? 'Today' : 'Guide'} onClose={() => nav(fromStart ? { s: 'starthere', page: 4, from: 'guide' } : fromToday ? { s: 'today' } : { s: 'guide' })} />}>
    <GuideTitle>{YEAR.title}</GuideTitle>
    <GuideLine>{YEAR.line}</GuideLine>
    <Verse v={YEAR.verse} />
    {YEAR.sections.map((x) => <GuideSection key={x.head} head={x.head}>
      {x.line && <GuideSub>{x.line}</GuideSub>}
      <GuideFacts label={x.head}>{x.rows.map(([l, v], k) => <InfoRow key={`${l}-${k}`} kind="guide" label={l} value={v} />)}</GuideFacts></GuideSection>)}
    <GuideNote>{YEAR.note}</GuideNote>
  </GuideShell>;
}
