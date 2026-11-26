// Start Here (TKC-059 H; claude/content/start-here.md, approved Nov 14, 2026): five short pages, each with a verse. ✕ keeps her place; Done on page 5 finishes it
// (the card on Today goes, the Guide shows a done row). The tab bar hides, as in a walk. Words word for word from copy.ts START_HERE.
import { setReminders, useHer } from '../../data/store';
import { START_HERE as S, GUIDE } from '../../copy';
import { GuideRun, GuideEyebrow, GuideTitle, GuideLine, GuideFacts, GuideRows, GuideNav, WalkTiles, PlantRow } from '../patterns/GuidePage';
import { Verse } from './GuideVerse';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { Button } from '../TKC-006-Button/Button';
import { Stepper } from '../TKC-028-Stepper/Stepper';
import { InfoRow } from '../TKC-016-InfoRow/InfoRow';
import { ListRow } from '../TKC-015-ListRow/ListRow';
import type { Nav, Route } from '../App';

export function StartHere({ route, nav }: { route: Extract<Route, { s: 'starthere' }>; nav: Nav }) {
  useHer();
  const { page, from } = route, p = S.pages[page - 1];
  const leave = () => nav(from === 'guide' ? { s: 'guide' } : { s: 'today' });
  const close = () => { setReminders({ startHerePage: page }); leave(); };   // ✕ keeps her place
  const finish = () => { setReminders({ startHereDone: true, startHereClosed: true, startHerePage: 1 }); leave(); };
  const go = (n: number) => { setReminders({ startHerePage: n }); nav({ s: 'starthere', page: n, from }); };
  const facts = 'facts' in p ? p.facts : undefined, steps = 'steps' in p ? p.steps : undefined;
  return <GuideRun view={`starthere-${page}`} top={<TopBar variant="run" label={S.of(page)} onClose={close} />}
    foot={<GuideNav>
      {page > 1 && <Button kind="quiet" label={S.back} onClick={() => go(page - 1)} />}
      <Button kind="primary" label={page === 5 ? S.done : S.next} onClick={page === 5 ? finish : () => go(page + 1)} /></GuideNav>}>
    <GuideEyebrow>{GUIDE.startHere.label}</GuideEyebrow>
    <GuideTitle>{p.title}</GuideTitle>
    {page === 1 ? <><WalkTiles tiles={[...S.walkTiles]} /><GuideLine>{p.line}</GuideLine></> : <GuideLine>{p.line}</GuideLine>}
    {steps && <Stepper steps={steps.map(([name, line]) => ({ name, line }))} />}
    {facts && <><GuideFacts label={p.title}>{facts.map(([l, v]) => <InfoRow key={l} kind="guide" label={l} value={v} />)}</GuideFacts>
      <GuideRows label={S.pages[3].row ?? ''}><ListRow kind="guide" name={S.pages[3].row ?? ''} onClick={() => nav({ s: 'year', from: 'starthere' })} /></GuideRows></>}
    {page === 5 && <PlantRow />}
    <Verse v={p.verse} />
  </GuideRun>;
}
