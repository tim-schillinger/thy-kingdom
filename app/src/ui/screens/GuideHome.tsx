// The Guide's home (IA, Guide; Guide Studio v1.0, locked 1218): Start Here (a card until she finishes it, then a done row), Your Walks, Rhythms.
// Go Deeper (the Lord's Prayer and the five check-ins) joins when its lessons are written (1193). Counts nothing (1196).
import { useHer } from '../../data/store';
import { GUIDE, WALK, GODEEPER } from '../../copy';
import { CHECKIN_NAMES, type CheckIn } from '../../engine/types';
import { GuideShell, GuideTitle, GuideLine, GuideHead, GuideBlock, GuideRows } from '../patterns/GuidePage';
import { StartHereCard } from '../TKC-059-StartHereCard/StartHereCard';
import { ListRow } from '../TKC-015-ListRow/ListRow';
import type { Nav, Route } from '../App';
import type { Place } from '../patterns/SettingsPage';

export function GuideHome({ nav }: { nav: Nav }) {
  const her = useHer(), done = !!her.reminders.startHereDone;
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  const startHere = () => nav({ s: 'starthere', page: done ? 1 : (her.reminders.startHerePage ?? 1), from: 'guide' });
  return <GuideShell view="home" onTab={go}>
    <GuideTitle>{GUIDE.title}</GuideTitle>
    <GuideLine>{GUIDE.line}</GuideLine>
    {done
      ? <GuideBlock><GuideHead>{GUIDE.startHere.label}</GuideHead>
          <GuideRows label={GUIDE.startHere.label}><ListRow kind="done" name={GUIDE.startHere.title} guideLine={GUIDE.startHere.line} readAgain={GUIDE.startHere.done} onClick={startHere} /></GuideRows></GuideBlock>
      : <StartHereCard place="guide" onGo={startHere} />}
    <GuideBlock><GuideHead>{GUIDE.heads.walks}</GuideHead>
      <GuideRows label={GUIDE.heads.walks}>
        <ListRow kind="guide" name={WALK.morning.name} guideLine={GUIDE.walkLine(WALK.morning.purpose)} onClick={() => nav({ s: 'guidewalk', walk: 'morning' })} />
        <ListRow kind="guide" name={WALK.evening.name} guideLine={GUIDE.walkLine(WALK.evening.purpose)} onClick={() => nav({ s: 'guidewalk', walk: 'evening' })} /></GuideRows></GuideBlock>
    <GuideBlock><GuideHead>{GUIDE.heads.rhythms}</GuideHead>
      <GuideRows label={GUIDE.heads.rhythms}><ListRow kind="guide" name={GUIDE.year.name} guideLine={GUIDE.year.line} onClick={() => nav({ s: 'year' })} /></GuideRows></GuideBlock>
    <GuideBlock><GuideHead>{GUIDE.heads.deeper}</GuideHead>
      <GuideRows label={GUIDE.heads.deeper}>
        <ListRow kind="guide" name={GODEEPER.prayer.name} guideLine={GODEEPER.prayer.when} onClick={() => nav({ s: 'godeeper', what: 'prayer', part: 1 })} />
        {(['burnt', 'grain', 'peace', 'sin', 'trespass'] as CheckIn[]).map((ci) => <ListRow key={ci} kind="guide" name={CHECKIN_NAMES[ci]} guideLine={GODEEPER.when[ci]} onClick={() => nav({ s: 'godeeper', what: 'checkin', ci, at: 0 })} />)}</GuideRows></GuideBlock>
  </GuideShell>;
}
