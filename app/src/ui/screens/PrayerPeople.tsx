// Prayer part 3 (People, and Saturday's Requests) and the sheets that open from it: ⋯ (Mark Answered, Edit, Remove), Add Person, Edit, Choose a List, Mark Answered with Pick a Day and the thanks.
// Built from the library: TKC-043 rows, TKC-044 key, TKC-004 sheets, TKC-011 live fields, TKC-020, TKC-047, TKC-054. A screen file: data and layout only (build-standards §5.8).
import { useEffect, useMemo, useState } from 'preact/hooks';
import { LISTS, type Ask, type HerData, type Person } from '../../engine/types';
import { fmtShort, type CivilDate } from '../../engine/dates';
import { onAList, listLine, monthsBetween, firstWeekday, daysOf, dayKey } from '../../engine/people';
import { JOINED } from '../../engine/plan';
import { removeRow } from '../motion';
import { addPerson, updatePerson, setRemoved, answerPerson, editAnswer, setMark } from '../../data/store';
import { PEOPLE_SHEETS as S, PRAYER } from '../../copy';
import { PersonList, ASKS, type PersonPrayerRowProps } from '../TKC-043-PersonPrayerRow/PersonPrayerRow';
import { PrayerKey } from '../TKC-044-PrayerKey/PrayerKey';
import { PrayerWords } from '../TKC-035-PrayerWords/PrayerWords';
import { SourceLine } from '../TKC-031-SourceLine/SourceLine';
import { Button } from '../TKC-006-Button/Button';
import { TextField, leftLine } from '../TKC-011-TextField/TextField';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { ListPickerRow } from '../TKC-047-ListPickerRow/ListPickerRow';
import { InlineNotice } from '../TKC-020-InlineNotice/InlineNotice';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { MonthCalendar } from '../TKC-054-MonthCalendar/MonthCalendar';
import { BottomSheet, Choices, Actions, FormField, FormQuestion, FormWhen, FormNote, FormGo, FormNotice } from '../TKC-004-BottomSheet/BottomSheet';
import { SheetHost } from '../patterns/SheetHost';
import { StepPrayerListHead, StepPrayerPrompt, StepPrayerVerse, StepPrayerVref, StepPrayerAhead, StepPrayerBig } from '../patterns/StepScreen';

export type PeopleRow = PersonPrayerRowProps & { id: string };
export const askLabel = (a: Ask) => (a[0].toUpperCase() + a.slice(1)) as (typeof ASKS)[number];

/** Everything part 3 holds between the aim and the foot (frame-lock-6 §5, his sketch; the Review's J-p3, J-sat, J-fri, E1 to E7). With people: the count line and "Learn More ›" under the aim,
 *  48 of room, the list head with "+ Add Person" on its row, the rows. No key list, no "Added tonight", no add at the end. */
/** The count line and "Learn More ›": the thing to do on a People night, inside the card (frame-lock-7 R9, 1877 y). Not drawn when she is reading ahead or the list is empty. */
export const PeopleCount = ({ text, onOpen }: { text: string; onOpen: () => void }) => <PrayerKey text={text} onOpen={onOpen} />;

export function PeopleContent({ list, rows, ahead, aheadDate, verse, onAdd, who, onList }: {
  /** The list's Who They Are text (What It Is on Saturday), shown on an empty list (1725), and the tap on the head that opens the list's sheet */
  who: string; onList: () => void; list: number; rows: PeopleRow[]; ahead: boolean; aheadDate: CivilDate;
  verse?: { text: string; reference: string; translation: string; onTranslation: () => void }; onAdd: () => void;
}) {
  const sat = list === 6, name = LISTS[list].name;
  const add = sat ? '+ Add Request' : '+ Add Person';
  return <>
    {verse && <><StepPrayerVerse><PrayerWords kind="starter" text={verse.text} /></StepPrayerVerse>
      <StepPrayerVref><SourceLine reference={verse.reference} translation={verse.translation} onTranslation={verse.onTranslation} /></StepPrayerVref></>}
    {ahead
      ? <><StepPrayerListHead name={name} onOpen={onList} />{rows.length > 0 && <StepPrayerAhead>{S.ahead(rows.length, fmtShort(aheadDate))}</StepPrayerAhead>}</>
      : rows.length === 0
        ? <><StepPrayerListHead name={name} onOpen={onList} bare /><PrayerWords kind="move" text={who} /><StepPrayerPrompt>{sat ? PRAYER.people.emptyRequests : PRAYER.people.empty}</StepPrayerPrompt><StepPrayerBig><Button kind="secondary" label={add} onClick={onAdd} /></StepPrayerBig></>
        : <StepPrayerListHead name={name} onOpen={onList} add={<Button kind="quiet" place="list-head" label={add} onClick={onAdd} />} />}
    {rows.length > 0 && <PersonList label={`${name} tonight`} rows={rows.map((r) => ({ ...r, ahead }))} />}
  </>;
}

/** Which sheet is open over Prayer's People part. */
export type PeopleSheet = null | { k: 'menu' | 'edit' | 'answer'; id: string } | { k: 'add' } | { k: 'thanks' };
export interface PeopleSheetsProps {
  sheet: PeopleSheet; her: HerData; date: CivilDate; today: CivilDate; list: number; tonightIds: ReadonlySet<string>;
  onClose: () => void; onOpen: (s: PeopleSheet) => void;
  onAdded: (p: Person) => void; onRemoved: (p: Person) => void;
  /** From Lists: a person added to another list does not join tonight's prayer (that is Prayer's rule only). */ fromLists?: boolean;
}

export function PeopleSheets(p: PeopleSheetsProps) {
  const { sheet } = p; if (!sheet) return null;
  if (sheet.k === 'thanks') return <SheetHost onClose={p.onClose}><BottomSheet kind="thanks" title={S.answered.thanksTitle} line={S.answered.thanksLine} thanksPlay onClose={p.onClose}><Button label={S.answered.amen} kind="primary" onClick={p.onClose} /></BottomSheet></SheetHost>;
  const person = sheet.k === 'add' ? undefined : p.her.people.find((x) => x.id === sheet.id);
  if (sheet.k !== 'add' && !person) return null;
  if (sheet.k === 'menu' && person) {
    const sat = person.list === 6;
    return <SheetHost onClose={p.onClose}><BottomSheet kind="menu" title={person.name} line={sat ? undefined : person.request || undefined} onClose={p.onClose}>
      <Actions>
        <Button kind="primary" label={S.menu.answered} onClick={() => p.onOpen({ k: 'answer', id: person.id })} />
        <Button kind="secondary" label={S.menu.edit} onClick={() => p.onOpen({ k: 'edit', id: person.id })} />
        <Button kind="quiet" label={S.menu.remove} onClick={() => { p.onClose(); const row = document.querySelector<HTMLElement>(`[data-person="${person.id}"]`); (row ? removeRow(row) : Promise.resolve()).then(() => { setRemoved(person.id, true); p.onRemoved(person); }); }} />
      </Actions></BottomSheet></SheetHost>;
  }
  if (sheet.k === 'answer' && person) return <AnswerSheet key={person.id} {...p} person={person} />;
  return <PersonSheet key={sheet.k === 'add' ? 'add' : sheet.id} {...p} person={person} />;
}

/** Add Person and Edit Person: one sheet (TKC-004 form). Saturday has one required field and no list row (1054). */
function PersonSheet({ person, her, date, list: tonightList, tonightIds, onClose, onAdded, fromLists }: PeopleSheetsProps & { person?: Person }) {
  const editing = !!person;
  const sat = (person ? person.list : tonightList) === 6;
  const [name, setName] = useState(person?.name ?? '');
  const [req, setReq] = useState(sat ? '' : person?.request ?? '');
  const [list, setList] = useState(person?.list ?? tonightList);
  const [need, setNeed] = useState(false);
  const [chooser, setChooser] = useState(false);
  const [typed, setTyped] = useState(name);
  useEffect(() => { const t = setTimeout(() => setTyped(name), 300); return () => clearTimeout(t); }, [name]);   // the notice shows after she pauses (TKC-020 H)
  const dup = !editing && !sat ? onAList(her, typed, tonightIds) : null;
  const t = S.add, field = sat ? name : name.trim();
  const moved = editing && !sat && list !== person!.list;
  const save = () => {
    if (!field.trim()) { setNeed(true); document.getElementById(sat ? 'tkc-f-request' : 'tkc-f-name')?.focus(); return; }
    if (person) { updatePerson(person.id, { name: field.trim(), request: sat ? '' : req.trim(), list }); onClose(); return; }
    const created = addPerson({ list: sat ? 6 : list, name: field.trim(), request: sat ? '' : req.trim(), added: date });
    if (created.list !== tonightList && !fromLists) setMark(date, JOINED + created.id, 'set');   // added to another list: still tonight's last row (271)
    onClose(); onAdded(created);
  };
  const joinTonight = () => { if (dup) { setMark(date, JOINED + dup.id, 'set'); onClose(); onAdded(dup); } };
  const limit = (v: string, max: number) => (v.length > max ? v.slice(0, max) : v);
  return <>
    <SheetHost onClose={onClose}><BottomSheet kind="form" title={editing ? (sat ? S.edit.titleRequest : S.edit.title) : sat ? t.titleRequest : t.title} onClose={onClose}>
      {sat
        ? <FormField><TextField label={t.pray} value={name} counter={leftLine(name.length, 80, 20)} message={need ? t.needRequest : undefined}
            edit={{ onInput: (v) => { setName(limit(v, 80)); setNeed(false); }, max: 80, lines: 3, name: 'request', autoFocus: true, describedBy: 'tkc-f-request-msg' }} /></FormField>
        : <>
          <FormField><TextField label={t.name} value={name} counter={leftLine(name.length, 40, 10)} message={need ? t.needName : undefined}
            edit={{ onInput: (v) => { setName(limit(v, 40)); setNeed(false); }, max: 40, lines: 1, name: 'name', autoFocus: !editing, caps: 'words', describedBy: 'tkc-f-name-msg', onEnter: () => document.getElementById('tkc-f-request')?.focus() }} /></FormField>
          {dup && <FormNotice><InlineNotice name={dup.name} list={LISTS[dup.list].name} onPray={joinTonight} /></FormNotice>}
          <FormField><TextField label={t.pray} optional value={req} counter={leftLine(req.length, 80, 20)}
            edit={{ onInput: (v) => setReq(limit(v, 80)), max: 80, lines: 3, name: 'request', caps: 'sentences' }} /></FormField>
          <FormField><TextField label="List"><ListPickerRow name={LISTS[list].name} line={listLine(list)} onChange={() => setChooser(true)} /></TextField>
            {moved ? <FormNote>{S.edit.moving(person!.name)}</FormNote> : null}</FormField></>}
      <FormGo><Button label={editing ? S.edit.primary : t.primary} kind="primary" onClick={save} /></FormGo>
    </BottomSheet></SheetHost>
    {chooser && <SheetHost onClose={() => setChooser(false)}><BottomSheet kind="pick" title={S.chooser.title} line={S.chooser.line(name.trim() || 'this person')} onClose={() => setChooser(false)}>
      <Choices kind="compact" label="List">
        {LISTS.slice(0, 6).map((l, i) => <ChoiceRow key={l.name} kind="compact" name={l.name} line={listLine(i)} tag={i === tonightList ? 'Tonight' : undefined} chosen={i === list} onChoose={() => { setList(i); setChooser(false); }} />)}
      </Choices></BottomSheet></SheetHost>}
  </>;
}

/** Mark Answered: the question, the answer, the date (Change → Pick a Day), Save; then the thanks (349, 1040, 1042). */
function AnswerSheet({ person, today, onClose, onOpen }: PeopleSheetsProps & { person: Person }) {
  const sat = person.list === 6, a = S.answered;
  const [text, setText] = useState('');
  const [on, setOn] = useState<CivilDate>(today);
  const [picking, setPicking] = useState(false);
  const save = () => { answerPerson(person.id, on, text.trim()); onOpen({ k: 'thanks' }); };
  const first = person.added > today ? today : person.added;
  return <>
    <SheetHost onClose={onClose}><BottomSheet kind="form" title={a.title} onClose={onClose}>
      <FormQuestion question={sat ? a.questionRequest : a.question(person.name)} helper={a.helper} />
      <FormField><TextField value={text} counter={leftLine(text.length, 400, 0)} edit={{ onInput: (v) => setText(v.slice(0, 400)), lines: 3, name: 'answer', autoFocus: true, ariaLabel: sat ? a.questionRequest : a.question(person.name) }} /></FormField>
      <FormWhen>{a.when(fmtShort(on), on === today)} <TextLink label="Change" aria="Change the date" onOpen={() => setPicking(true)} /></FormWhen>
      <FormGo><Button label={a.primary} kind="primary" onClick={save} /></FormGo>
    </BottomSheet></SheetHost>
    {picking && <SheetHost onClose={() => setPicking(false)}><PickADay from={first} to={today} picked={on} line={sat ? a.pickLineRequest : a.pickLine(person.name)} onPick={(d) => { setOn(d); setPicking(false); }} onClose={() => setPicking(false)} /></SheetHost>}
  </>;
}

/** Edit Answer (the record's ⋯): the words and the day, saved back to the record; no thanks (5b Lists lock). */
export function EditAnswerSheet({ rec, person, today, onClose }: { rec: { personId: string; on: CivilDate; answer: string; name: string; list: number }; person?: Person; today: CivilDate; onClose: () => void }) {
  const sat = rec.list === 6, a = S.answered;
  const [text, setText] = useState(rec.answer);
  const [on, setOn] = useState<CivilDate>(rec.on);
  const [picking, setPicking] = useState(false);
  const save = () => { editAnswer(rec.personId, on, text.trim()); onClose(); };
  const first = person && person.added < on ? person.added : on;
  return <>
    <SheetHost onClose={onClose}><BottomSheet kind="form" title={S.editAnswer.title} onClose={onClose}>
      <FormQuestion question={sat ? a.questionRequest : a.question(rec.name)} helper={a.helper} />
      <FormField><TextField value={text} counter={leftLine(text.length, 400, 0)} edit={{ onInput: (v) => setText(v.slice(0, 400)), lines: 3, name: 'answer', autoFocus: true, ariaLabel: sat ? a.questionRequest : a.question(rec.name) }} /></FormField>
      <FormWhen>{a.when(fmtShort(on), on === today)} <TextLink label="Change" aria="Change the date" onOpen={() => setPicking(true)} /></FormWhen>
      <FormGo><Button label={S.editAnswer.primary} kind="primary" onClick={save} /></FormGo>
    </BottomSheet></SheetHost>
    {picking && <SheetHost onClose={() => setPicking(false)}><PickADay from={first} to={today > on ? today : on} picked={on} line={sat ? a.pickLineRequest : a.pickLine(rec.name)} onPick={(d) => { setOn(d); setPicking(false); }} onClose={() => setPicking(false)} /></SheetHost>}
  </>;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
/** Pick a Day over Mark Answered: today ringed, her pick filled, today or earlier only, back to the day she added the person (1108, 1113; 406, 1033, 1040). */
function PickADay({ from, to, picked, line, onPick, onClose }: { from: CivilDate; to: CivilDate; picked: CivilDate; line: string; onPick: (d: CivilDate) => void; onClose: () => void }) {
  const months = useMemo(() => monthsBetween(from, to), [from, to]);
  const [at, setAt] = useState(months.length - 1);
  const { y, m } = months[at];
  const days = Array.from({ length: daysOf(y, m) }, (_, k) => { const key = dayKey(y, m, k + 1);
    return { n: k + 1, today: key === to || undefined, out: key > to || key < from || undefined, pick: key === picked || undefined }; });
  return <BottomSheet kind="pick" title={S.answered.pickTitle} line={line} onClose={onClose}>
    <MonthCalendar kind="date" month={`${MONTHS[m - 1]} ${y}`} lead={firstWeekday(y, m)} days={days}
      prevOff={at === 0} nextOff={at === months.length - 1} prevName={MONTHS[(m + 10) % 12]} nextName={MONTHS[m % 12]}
      onMonth={(s) => setAt(Math.max(0, Math.min(months.length - 1, at + s)))} onDay={(n) => onPick(dayKey(y, m, n))} />
  </BottomSheet>;
}
