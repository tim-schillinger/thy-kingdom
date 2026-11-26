// Library and parity only: builds a BottomSheet from plain data (props must survive the trip into the parity page).
import { BottomSheet, Actions, Choices, ReadBody, FormField, FormQuestion, FormWhen, FormNote, FormGo, FormNotice, type BottomSheetProps } from './BottomSheet';
import { ChoiceRow, type ChoiceRowProps } from '../TKC-012-ChoiceRow/ChoiceRow';
import { Button, type ButtonKind } from '../TKC-006-Button/Button';
import { TextField, type TextFieldProps } from '../TKC-011-TextField/TextField';
import { ListPickerRow } from '../TKC-047-ListPickerRow/ListPickerRow';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { InlineNotice } from '../TKC-020-InlineNotice/InlineNotice';
import { MonthCalendar, type MonthCalendarProps } from '../TKC-054-MonthCalendar/MonthCalendar';

/** The form kind's body, in the order it is drawn (spec D). */
export type FormItem =
  | ({ t: 'field' } & TextFieldProps)
  | { t: 'notice'; name: string; list: string }
  | { t: 'list'; name: string; line: string; note?: string; show?: 'pressed' | 'focus' }
  | { t: 'question'; question: string; helper?: string }
  | { t: 'when'; text: string; show?: 'pressed' | 'focus' };

export interface SheetSpec extends Omit<BottomSheetProps, 'children'> {
  choices?: { kind: 'full' | 'compact'; label: string; rows: ChoiceRowProps[] };
  actions?: Array<{ label: string; kind: ButtonKind }>;   // menu
  buttons?: Array<{ label: string; kind: ButtonKind }>;   // confirm
  read?: { parts: Array<{ head: string; body: string }> };
  thanks?: { button: string };   // thanks: the Amen button
  form?: { items: FormItem[]; primary: string };           // form: fields, the list row, the date line, then the one primary
  calendar?: MonthCalendarProps;                            // pick one: Pick a Day's grid (TKC-054) under the header
}
export function SheetFromSpec({ choices, actions, buttons, read, thanks, form, calendar, ...sheet }: SheetSpec) {
  return <BottomSheet {...sheet}>
    {choices ? <Choices kind={choices.kind} label={choices.label}>{choices.rows.map((r) => <ChoiceRow key={r.name} kind={choices.kind} {...r} />)}</Choices> : null}
    {calendar ? <MonthCalendar {...calendar} /> : null}
    {actions ? <Actions>{actions.map((a) => <Button key={a.label} label={a.label} kind={a.kind} />)}</Actions> : null}
    {buttons ? buttons.map((a) => <Button key={a.label} label={a.label} kind={a.kind} />) : null}
    {read ? <ReadBody parts={read.parts} /> : null}
    {thanks ? <Button label={thanks.button} kind="primary" /> : null}
    {form ? <>{form.items.map((it, k) => {
      if (it.t === 'question') return <FormQuestion key={k} question={it.question} helper={it.helper} />;
      if (it.t === 'notice') return <FormNotice key={k}><InlineNotice name={it.name} list={it.list} /></FormNotice>;
      if (it.t === 'when') return <FormWhen key={k}>{it.text} <TextLink label="Change" aria="Change the date" show={it.show} /></FormWhen>;
      if (it.t === 'list') return <FormField key={k}><TextField label="List"><ListPickerRow name={it.name} line={it.line} show={it.show} /></TextField>{it.note ? <FormNote>{it.note}</FormNote> : null}</FormField>;
      const { t: _t, ...f } = it; return <FormField key={k}><TextField {...f} /></FormField>;
    })}<FormGo><Button label={form.primary} kind="primary" /></FormGo></> : null}
  </BottomSheet>;
}
