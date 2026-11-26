// Settings › Bible and Books (POC T13; the Settings Lock's source rows, TKC-015 0.5): which Bible, and where each reading comes from.
// A screen file: data and layout only, built from the library (build-standards §5.8). Each row opens the pick sheet the step's Change opens.
import { useState } from 'preact/hooks';
import { useHer, setBible, setSources } from '../../data/store';
import { BIBLE_BOOKS as B, BOOK_SHEETS, HYMNAL_SHEET, READINGS_SHEET, NOTES_NOTICE, ARTICLE } from '../../copy';
import { bibleName, BibleSheet } from './MorningStep';
import { ListRow } from '../TKC-015-ListRow/ListRow';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { BottomSheet, Choices, ReadNotice } from '../TKC-004-BottomSheet/BottomSheet';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { SheetHost } from '../patterns/SheetHost';
import { SettingsShell, SettingsTitle, SettingsPanel, SheetLinks, type Place } from '../patterns/SettingsPage';
import type { Nav, Route } from '../App';

type Key = 'readings' | 'hymnal' | 'classic' | 'studyNotes' | 'digDeeper';
type Open = null | 'bible' | Key;
type Notice = 'notes' | 'articles';

function PickSheet({ title, line, app, mid, own, chosen, onChoose, onClose, onNotice }: { onNotice?: (n: Notice) => void; title: string; line: string; app: { name: string; line: string }; mid?: { name: string; line: string }; own: { name: string; line: string }; chosen: 'app' | 'recorded' | 'own'; onChoose: (v: 'app' | 'recorded' | 'own') => void; onClose: () => void }) {
  return <SheetHost onClose={onClose}><BottomSheet kind="pick" title={title} line={line} onClose={onClose}>
    <Choices kind="full" label={title}>
      <ChoiceRow name={app.name} line={app.line} chosen={chosen === 'app'} onChoose={() => onChoose('app')} />
      {mid && <ChoiceRow name={mid.name} line={mid.line} chosen={chosen === 'recorded'} onChoose={() => onChoose('recorded')} />}
      <ChoiceRow name={own.name} line={own.line} chosen={chosen === 'own'} onChoose={() => onChoose('own')} /></Choices>
    {onNotice && <SheetLinks><TextLink kind="more" label={NOTES_NOTICE.title} aria={`${NOTES_NOTICE.title}. Opens the credit and license`} onOpen={() => onNotice('notes')} />
      <TextLink kind="more" label={ARTICLE.notice.title} aria={`${ARTICLE.notice.title}. Opens the credit and license`} onOpen={() => onNotice('articles')} /></SheetLinks>}</BottomSheet></SheetHost>;
}

export function SettingsBooks({ nav }: { nav: Nav }) {
  const her = useHer(), trans = her.sources.bible;
  const [open, setOpen] = useState<Open>(null);
  const [notice, setNotice] = useState<Notice | null>(null);   // read over the Study Notes sheet; closing it comes back to that sheet
  const on = (k: Key) => her.sources[k] === 'own';
  const set = (k: Key) => (v: 'app' | 'recorded' | 'own') => { setSources({ [k]: v }); setOpen(null); };
  const sheets: Record<Key, { title: string; line: string; app: { name: string; line: string }; mid?: { name: string; line: string }; own: { name: string; line: string } }> = {
    readings: { ...READINGS_SHEET, app: { name: 'In the App', line: `The ${bibleName(trans)}, right on the screen` } },
    hymnal: { ...HYMNAL_SHEET, mid: HYMNAL_SHEET.recorded }, classic: BOOK_SHEETS.classic, studyNotes: BOOK_SHEETS.studyNotes, digDeeper: BOOK_SHEETS.digDeeper,
  };
  const row = (k: Key, kind: string, appName: string, ownName: string) =>
    <ListRow kind="source" sourceKind={kind} name={on(k) ? ownName : k === 'hymnal' && her.sources.hymnal === 'recorded' ? HYMNAL_SHEET.recorded.name : appName} chevron onClick={() => setOpen(k)} />;
  const go = (p: Place) => nav({ s: p.toLowerCase() } as Route);
  return <SettingsShell view="books" onTab={go} top={<TopBar variant="page" label={B.back} onClose={() => nav({ s: 'settings' })} />}>
    <SettingsTitle>{B.title}</SettingsTitle>
    <SettingsPanel label={B.title}>
      <ListRow kind="source" sourceKind={B.kinds.bible} name={bibleName(trans)} edition={B.edition[trans]} chevron onClick={() => setOpen('bible')} />
      {row('readings', B.kinds.readings, B.app, READINGS_SHEET.own.name)}
      {row('hymnal', B.kinds.hymnal, B.app, HYMNAL_SHEET.own.name)}
      {row('classic', B.kinds.classic, B.classic, BOOK_SHEETS.classic.own.name)}
      {row('studyNotes', B.kinds.studyNotes, B.studyNotes, BOOK_SHEETS.studyNotes.own.name)}
      {row('digDeeper', B.kinds.digDeeper, B.digDeeper, BOOK_SHEETS.digDeeper.own.name)}
    </SettingsPanel>
    {open === 'bible' && <BibleSheet current={trans} onPick={(b) => { setBible(b); setOpen(null); }} onClose={() => setOpen(null)} />}
    {open && open !== 'bible' && !notice && <PickSheet onNotice={open === 'studyNotes' ? setNotice : undefined} {...sheets[open]} chosen={on(open) ? 'own' : open === 'hymnal' && her.sources.hymnal === 'recorded' ? 'recorded' : 'app'} onChoose={set(open)} onClose={() => setOpen(null)} />}
    {notice && (() => { const n = notice === 'notes' ? NOTES_NOTICE : ARTICLE.notice; return <SheetHost onClose={() => setNotice(null)}><BottomSheet kind="read" title={n.title} onClose={() => setNotice(null)}><ReadNotice sections={n.sections} links={n.links} /></BottomSheet></SheetHost>; })()}
  </SettingsShell>;
}
