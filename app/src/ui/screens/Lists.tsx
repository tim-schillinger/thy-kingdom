// Lists (Flow 5; the 5b Lists lock, Oct 21): the seven lists, one list, a person's page, Answered, and an answered prayer's record.
// A screen file: data and layout only, built from the library (build-standards §5.8). Search (TKC-011 0.2) and sort (TKC-048 0.2) are T21, built in 3-5s.
import { useEffect, useRef, useState } from 'preact/hooks';
import { getContent } from '../../data/content';
import { useHer, today as todayFn, setReminders, setRemoved, setAnswerRemoved, unAnswer, restoreAnswer } from '../../data/store';
import { LISTS, type Answered, type HerData, type Person, type Ref } from '../../engine/types';
import { fmtShort, weekday, fmtMonthDay, fmtBackupDate, fmtMonthYear, year, type CivilDate } from '../../engine/dates';
import { formatRef } from '../../engine/refs';
import { anchorQuote } from '../../engine/anchor';
import { listLine, peopleOn, listPeople, orderOf, searchLists, type SortKey } from '../../engine/people';
import { LISTS_TAB as L, LISTS_FIND as F, PEOPLE_SHEETS as S, PRAYER } from '../../copy';
import { useVerses, pickedText } from '../bits';
import { plain, Scripture, bibleName } from './MorningStep';
import { PeopleSheets, EditAnswerSheet, askLabel, type PeopleSheet } from './PrayerPeople';
import { SheetRead } from './SheetRead';
import { ListsShell, ListsTitle, ListsHead, ListsLine, ListsAnchor, ListsMonth, ListsCards, ListsFacts, ListsActions, ListsRecordHead, ListsLink, ListsStory, ListsEmpty, ListsPrompt, ListsBig, ListsSearch, ListsSort, ListsStatus, type Place } from '../patterns/Lists';
import { ToastHost } from '../patterns/ToastHost';
import { SheetHost } from '../patterns/SheetHost';
import { Tabs } from '../TKC-053-Tabs/Tabs';
import { ListRow, RowList } from '../TKC-015-ListRow/ListRow';
import { AnswerCard } from '../TKC-049-AnswerCard/AnswerCard';
import { InfoRow } from '../TKC-016-InfoRow/InfoRow';
import { AnchorLine } from '../TKC-052-AnchorLine/AnchorLine';
import { EmptyState } from '../TKC-019-EmptyState/EmptyState';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { Button } from '../TKC-006-Button/Button';
import { WinMark } from '../TKC-022-WinMark/WinMark';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { BottomSheet, Actions, Choices } from '../TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { TextField } from '../TKC-011-TextField/TextField';
import { SortMenu } from '../TKC-048-SortMenu/SortMenu';
import { PrayerWords } from '../TKC-035-PrayerWords/PrayerWords';
import type { Route, Nav } from '../App';

export type ListsRoute = Extract<Route, { s: 'lists' }>;
type View = { k: 'home' } | { k: 'list'; i: number } | { k: 'person'; id: string; from?: 'search' } | { k: 'record'; id: string };
type Sheet = PeopleSheet | { k: 'verse'; ref: Ref } | { k: 'who'; i: number } | { k: 'sort'; i: number } | { k: 'recmenu'; id: string } | { k: 'editans'; id: string };

/** Who is on a list now: not removed, not answered, the oldest first (the order she added them). The list's own remembered order is `listPeople`. */
export const onList = peopleOn;
/** The days she prayed for someone (a day counts once) and what she asked on them. */
function prayedFor(her: HerData, id: string) {
  const days = new Map<string, string[]>();
  her.prayerMarks.filter((m) => m.personId === id && m.asks.length).forEach((m) => days.set(m.date, m.asks));
  const tally: Record<string, number> = {}; days.forEach((asks) => asks.forEach((a) => { tally[a] = (tally[a] ?? 0) + 1; }));
  return { n: days.size, asked: (['provide', 'forgive', 'protect'] as const).filter((a) => tally[a]).map((a) => `${askLabel(a)} ${tally[a]}`).join(' · ') };
}
const dayOf = (d: CivilDate, t: CivilDate) => (year(d) === year(t) ? fmtMonthDay(d) : fmtBackupDate(d));
const monthOf = (d: CivilDate, t: CivilDate) => (year(d) === year(t) ? fmtMonthYear(d).replace(/ \d{4}$/, '') : fmtMonthYear(d));
const askedOf = (r: Answered) => (r.list === 6 ? r.name : r.request ? `${r.name} · ${r.request}` : r.name);

export function Lists({ route, nav }: { route: ListsRoute; nav: Nav }) {
  const her = useHer(), c = getContent(), t = todayFn(), trans = her.sources.bible;
  const seed = (): View => route.record ? { k: 'record', id: route.record } : route.person ? { k: 'person', id: route.person } : route.list != null ? { k: 'list', i: route.list } : { k: 'home' };
  const [view, setView] = useState<View>(seed);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [q, setQ] = useState('');                       // the search box; leaving Lists drops it (TKC-011 H)
  const kept = useRef({ top: 0, results: 0 });         // the page's scroll: where the tab was when she began typing, and where the results were when she opened one
  const [toast, setToast] = useState<{ message: string; action: string; onAction: () => void } | null>(null);
  useEffect(() => { setView(seed()); setSheet(null); }, [route]);
  const tab = route.tab ?? her.reminders.listsTab ?? 0;
  const anchorRef: Ref = { b: 'PSA', c: 103, v: 2 }, empRef: Ref = { b: 'MAT', c: 7, v: 7 };
  const anchorV = pickedText(useVerses(view.k === 'home' && tab === 1 ? anchorRef : null, trans), trans);
  const empV = pickedText(useVerses(view.k === 'home' && tab === 1 && !her.answered.some((a) => !a.removed) ? empRef : null, trans), trans);
  const live = her.answered.filter((a) => !a.removed);
  const go = (p: Place) => { if (p === 'Lists') { setView({ k: 'home' }); window.scrollTo(0, 0); } else nav({ s: p.toLowerCase() } as Route); };
  const toLists = () => { setView({ k: 'home' }); if (q.trim()) { const y = kept.current.results; requestAnimationFrame(() => window.scrollTo(0, y)); } else window.scrollTo(0, 0); };
  const open = (v: View) => { setView(v); window.scrollTo(0, 0); };
  const searching = q.trim().length > 0;
  const typeIn = (v: string) => { if (!q.trim() && v.trim()) kept.current.top = window.scrollY; setQ(v); if (q.trim() && !v.trim()) back(); };
  const back = () => { const y = kept.current.top; requestAnimationFrame(() => window.scrollTo(0, y)); };
  const openFound = (v: View) => { kept.current.results = window.scrollY; open(v); };

  const removed = (p: Person) => { setView({ k: 'list', i: p.list }); setToast({ message: S.removed(p.name), action: S.undo, onAction: () => { setRemoved(p.id, false); setToast(null); } }); };
  const sheets = <>
    <PeopleSheets sheet={sheet && ['menu', 'edit', 'answer', 'add', 'thanks'].includes(sheet.k) ? (sheet as PeopleSheet) : null} fromLists her={her} date={t} today={t} list={view.k === 'list' ? view.i : 0} tonightIds={new Set()}
      onClose={() => { const thanks = sheet?.k === 'thanks'; setSheet(null); if (thanks) setView((v) => (v.k === 'person' ? { k: 'list', i: her.answered.find((a) => a.personId === v.id)?.list ?? 0 } : v)); }}
      onOpen={setSheet} onAdded={() => {}} onRemoved={removed} />
    {sheet?.k === 'verse' && <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="read" title={formatRef(c, sheet.ref)} onClose={() => setSheet(null)}>
      <Scripture r={sheet.ref} kjv={trans === 'kjv'} trans={trans} titled={false} joins={false} /></BottomSheet></SheetHost>}
    {sheet?.k === 'sort' && (() => { const i = sheet.i, cur = orderOf(her, i), sat = i === 6;
      return <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="pick" title={F.sort.title(LISTS[i].name)} onClose={() => setSheet(null)}>
        <Choices kind="compact" label={F.sort.group}>
          {F.sort.orders.map((o) => <ChoiceRow key={o.key} kind="compact" name={o.name} line={sat && o.lineRequest ? o.lineRequest : o.line} chosen={cur === o.key}
            onChoose={() => { if (o.key !== cur) setReminders({ sortByList: { ...her.reminders.sortByList, [i]: o.key as SortKey } }); setSheet(null); }} />)}
        </Choices></BottomSheet></SheetHost>; })()}
    {sheet?.k === 'who' && <SheetRead title={c.sheets.lists[sheet.i].name} titles={c.sheets.lists[sheet.i].sections} item={c.sheets.lists[sheet.i]} bible={trans} bibleName={bibleName(trans)} onClose={() => setSheet(null)} />}
    {sheet?.k === 'editans' && (() => { const r = her.answered.find((a) => a.personId === sheet.id); return r ? <EditAnswerSheet rec={r} person={her.people.find((p) => p.id === r.personId)} today={t} onClose={() => setSheet(null)} /> : null; })()}
    {sheet?.k === 'recmenu' && (() => { const r = her.answered.find((a) => a.personId === sheet.id); if (!r) return null;
      return <SheetHost onClose={() => setSheet(null)}><BottomSheet kind="menu" title={r.name} line={r.list === 6 ? undefined : r.request || undefined} onClose={() => setSheet(null)}><Actions>
        <Button kind="secondary" label={L.answered.menu.edit} onClick={() => setSheet({ k: 'editans', id: r.personId })} />
        <Button kind="quiet" label={L.answered.menu.undo} onClick={() => { setSheet(null); unAnswer(r.personId); toLists(); setToast({ message: L.backOnList(r.name, LISTS[r.list].name), action: S.undo, onAction: () => { restoreAnswer(r); setToast(null); } }); }} />
        <Button kind="quiet" label={L.answered.menu.remove} onClick={() => { setSheet(null); setAnswerRemoved(r.personId, true); toLists(); setToast({ message: S.removed(r.name), action: S.undo, onAction: () => { setAnswerRemoved(r.personId, false); setToast(null); } }); }} />
      </Actions></BottomSheet></SheetHost>; })()}
    {toast && <ToastHost key={toast.message} message={toast.message} action={toast.action} onAction={toast.onAction} onDone={() => setToast(null)} lift />}
  </>;

  // ---- an answered prayer's record
  if (view.k === 'record') {
    const r = her.answered.find((a) => a.personId === view.id && !a.removed);
    if (r) {
      const p = her.people.find((x) => x.id === r.personId), sat = r.list === 6, pf = prayedFor(her, r.personId);
      return <ListsShell view="record" onTab={go} top={<TopBar variant="page" label={L.back} more onMore={() => setSheet({ k: 'recmenu', id: r.personId })} onClose={toLists} />}>
        <ListsRecordHead mark={<WinMark size="small" glyph="hands" play />} title={L.answered.heading} line={`Answered ${fmtShort(r.on)}${year(r.on) === year(t) ? '' : `, ${year(r.on)}`}`} />
        <ListsStory><AnswerCard kind="story" name={sat ? undefined : r.name} request={sat ? r.name : r.request} answer={r.answer || undefined} /></ListsStory>
        <ListsFacts tight>
          <InfoRow label={L.facts.list} value={LISTS[r.list].name} />
          {p && <InfoRow label={L.facts.askedOn} value={dayOf(p.added, t)} />}
          {pf.n > 0 && <InfoRow label={L.facts.prayed} value={L.times(pf.n)} />}
          {!sat && pf.asked && <InfoRow label={L.facts.asked} value={pf.asked} />}
        </ListsFacts>
        {sheets}
      </ListsShell>;
    }
  }
  // ---- a person's page
  if (view.k === 'person') {
    const p = onList(her, her.people.find((x) => x.id === view.id)?.list ?? -1).find((x) => x.id === view.id);
    if (p) {
      const sat = p.list === 6, pf = prayedFor(her, p.id);
      return <ListsShell view="person" onTab={go} top={view.from === 'search' ? <TopBar variant="page" label={L.back} onClose={toLists} /> : <TopBar variant="page" label={LISTS[p.list].name} onClose={() => open({ k: 'list', i: p.list })} />}>
        <ListsHead title={sat ? p.name : p.name} />
        {!sat && p.request && <ListsLine>{p.request}</ListsLine>}
        <ListsFacts>
          <InfoRow label={L.facts.list} value={LISTS[p.list].name} />
          <InfoRow label={L.facts.added} value={dayOf(p.added, t)} />
          {pf.n > 0 && <InfoRow label={L.facts.prayed} value={L.times(pf.n)} />}
          {!sat && pf.asked && <InfoRow label={L.facts.asked} value={pf.asked} />}
        </ListsFacts>
        <ListsActions>
          <Button kind="primary" label={L.actions.answered} onClick={() => setSheet({ k: 'answer', id: p.id })} />
          <Button kind="secondary" label={L.actions.edit} onClick={() => setSheet({ k: 'edit', id: p.id })} />
          <Button kind="quiet" label={L.actions.remove} onClick={() => { setRemoved(p.id, true); removed(p); }} />
        </ListsActions>
        {sheets}
      </ListsShell>;
    }
  }
  // ---- one list
  if (view.k === 'list' || view.k === 'person' || view.k === 'record') {
    const i = view.k === 'list' ? view.i : view.k === 'person' ? (her.answered.find((a) => a.personId === view.id)?.list ?? her.people.find((x) => x.id === view.id)?.list ?? 0) : 0;
    const sat = i === 6, people = listPeople(her, i), l = LISTS[i], ord = orderOf(her, i);
    return <ListsShell view="list" onTab={go} top={<TopBar variant="page" label={L.back} onClose={toLists} />}>
      <ListsHead title={l.name} />
      {people.length > 0
        ? <><ListsLine>{listLine(i)}</ListsLine>
          <ListsLink tight><TextLink kind="more" label="Who belongs on this list" onOpen={() => setSheet({ k: 'who', i })} /></ListsLink>
          <ListsSort add={<Button kind="quiet" place="list-sort" label={sat ? '+ Add Request' : '+ Add Person'} onClick={() => setSheet({ k: 'add' })} />}><SortMenu order={F.sort.orders.find((o) => o.key === ord)!.name} onOpen={() => setSheet({ k: 'sort', i })} /></ListsSort>
          <RowList label={`${l.name}, ${L.count(sat, people.length)}`}>{people.map((p) => <li key={p.id} data-person={p.id}><ListRow kind="person" name={p.name} request={sat ? undefined : p.request || undefined} onClick={() => open({ k: 'person', id: p.id })} /></li>)}</RowList></>
        : <ListsEmpty><PrayerWords kind="move" text={c.sheets.lists[i].a} /><ListsPrompt>{sat ? PRAYER.people.emptyRequests : PRAYER.people.empty}</ListsPrompt>
          <ListsBig><Button kind="secondary" label={sat ? '+ Add Request' : '+ Add Person'} onClick={() => setSheet({ k: 'add' })} /></ListsBig></ListsEmpty>}
      {sheets}
    </ListsShell>;
  }
  // ---- home: Praying For | Answered
  const tonight = weekday(t);
  const months: Array<{ head: string; rows: Answered[] }> = [];
  [...live].sort((a, b) => (a.on < b.on ? 1 : a.on > b.on ? -1 : 0)).forEach((r) => { const h = monthOf(r.on, t), m = months[months.length - 1]; if (m && m.head === h) m.rows.push(r); else months.push({ head: h, rows: [r] }); });
  const hits = searching ? searchLists(her, q) : null, typed = q.trim(), total = hits ? hits.people.length + hits.answered.length : 0;
  const found = !hits ? null : total === 0
    ? <><ListsStatus /><ListsEmpty><EmptyState kind="search" line={F.noMatch(typed)} /></ListsEmpty></>
    : <><ListsStatus>{F.results(total)}</ListsStatus>
      <RowList label={F.resultsFor(typed)}>
        {hits.people.map((p) => <li key={p.id} data-person={p.id}><ListRow kind="search" name={p.name} request={p.list === 6 ? undefined : p.request || undefined} match={typed} where={LISTS[p.list].name} onClick={() => openFound({ k: 'person', id: p.id, from: 'search' })} /></li>)}
        {hits.answered.map((r) => <li key={`a-${r.personId}`} data-answered={r.personId}><ListRow kind="search" answered name={r.name} request={r.list === 6 ? undefined : r.request || undefined} match={typed} where={`Answered ${dayOf(r.on, t)} · ${LISTS[r.list].name}`} onClick={() => openFound({ k: 'record', id: r.personId })} /></li>)}
      </RowList></>;
  return <ListsShell view={searching ? 'search' : tab === 0 ? 'praying' : 'answered'} onTab={go}>
    <ListsTitle>{L.title}</ListsTitle>
    {!searching && <Tabs name="Lists view" tabs={[{ label: L.tabs[0] }, { label: L.tabs[1], count: live.length || undefined }]} open={tab} onSelect={(n) => setReminders({ listsTab: n as 0 | 1 })} />}
    <ListsSearch><TextField kind="search" value={q} placeholder={F.placeholder} search={{ onInput: typeIn, onClear: () => { setQ(''); back(); } }} /></ListsSearch>
    {searching ? found : tab === 0
      ? <RowList label="Praying For">{LISTS.map((l, i) => <li key={l.name}><ListRow kind="list" name={l.name} line={`${l.night} · ${l.line}`} meta={L.count(i === 6, onList(her, i).length)} tonight={i === tonight} onClick={() => open({ k: 'list', i })} /></li>)}</RowList>
      : live.length === 0
        ? <ListsEmpty><EmptyState kind="verse" verse={empV ? `“${plain(empV)}”` : undefined} reference={formatRef(c, empRef)} line={L.answered.empty} /></ListsEmpty>
        : <>{anchorV && <ListsAnchor><AnchorLine kind="quote" text={anchorQuote(plain(anchorV))} reference={formatRef(c, anchorRef)} label={`${formatRef(c, anchorRef)}. Show the whole verse`} onOpen={() => setSheet({ k: 'verse', ref: anchorRef })} /></ListsAnchor>}
          {months.map((m) => <div key={m.head}><ListsMonth>{m.head}</ListsMonth><ListsCards>{m.rows.map((r) => <AnswerCard key={r.personId} kind="list" answer={r.answer || undefined} asked={askedOf(r)} meta={`Answered ${fmtMonthDay(r.on)} · ${LISTS[r.list].name}`} onOpen={() => open({ k: 'record', id: r.personId })} />)}</ListsCards></div>)}</>}
    {sheets}
  </ListsShell>;
}
