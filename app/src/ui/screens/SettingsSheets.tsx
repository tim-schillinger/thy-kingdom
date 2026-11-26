// Settings' pick sheets (TKC-004 0.6, 0.7; the Settings Lock): When Does Your Evening Start?, Appearance, Text Size, Backup Reminder.
// A screen file: data and layout only, built from the library. Appearance, Backup Reminder and the evening time apply and close (1081); Text Size applies and stays (1255).
import { useHer, setSettings, today as todayFn } from '../../data/store';
import { getContent } from '../../data/content';
import { planFor } from '../../engine/plan';
import { fmtClock } from '../../engine/dates';
import { formatRef } from '../../engine/refs';
import { SETTINGS as S } from '../../copy';
import { bibleName } from './MorningStep';
import { weekVerse } from '../Walk';
import { useVerses, pickedText } from '../bits';
import { BottomSheet, Choices, SheetSample } from '../TKC-004-BottomSheet/BottomSheet';
import { Stepper } from '../TKC-028-Stepper/Stepper';
import { Button } from '../TKC-006-Button/Button';
import { ChoiceRow } from '../TKC-012-ChoiceRow/ChoiceRow';
import { VerseCard } from '../TKC-033-VerseCard/VerseCard';
import { SheetHost } from '../patterns/SheetHost';
import type { Settings } from '../../engine/types';

export const EVENING_TIMES = ['16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];

/** "When Does Your Evening Start?" (0.7, 645): from Today's Change and from Settings' Your Evening Begins. A tap saves the time and closes. */
export function EveningSheet({ onClose }: { onClose: () => void }) {
  const her = useHer();
  return <SheetHost onClose={onClose}><BottomSheet kind="pick" title="When Does Your Evening Start?" line="The Evening Walk comes first on Today from this time. You can start it earlier." onClose={onClose}>
    <Choices kind="compact" label="When Does Your Evening Start?">
      {EVENING_TIMES.map((h) => <ChoiceRow key={h} kind="compact" name={fmtClock(h)} ringTop chosen={her.settings.eveningStart === h} onChoose={() => { setSettings({ eveningStart: h }); onClose(); }} />)}
    </Choices>
  </BottomSheet></SheetHost>;
}

export function AppearanceSheet({ onClose }: { onClose: () => void }) {
  const her = useHer(), A = S.appearance;
  return <SheetHost onClose={onClose}><BottomSheet kind="pick" title={A.title} onClose={onClose}>
    <Choices kind="compact" label={A.title}>
      {(['phone', 'light', 'dark'] as const).map((k) => <ChoiceRow key={k} kind="compact" name={A.values[k]} line={A.lines[k]} ringTop chosen={her.settings.appearance === k} onChoose={() => { setSettings({ appearance: k }); onClose(); }} />)}
    </Choices></BottomSheet></SheetHost>;
}

/** Text Size stays open (1255): a tap applies at once, the sample and the app behind take the size, ✕ closes. */
export function TextSizeSheet({ onClose }: { onClose: () => void }) {
  const her = useHer(), T = S.textSize, trans = her.sources.bible;
  const c = getContent(), plan = planFor(c, her, todayFn()), ref = weekVerse(plan);
  const vr = useVerses(ref, trans), verse = ref && vr ? pickedText(vr, trans) : null;
  return <SheetHost onClose={onClose}><BottomSheet kind="pick" title={T.title} onClose={onClose}>
    {ref && verse && <SheetSample name={T.sampleName(T.values[her.settings.textSize])}>
      <VerseCard label={T.sample} verse={verse} reference={formatRef(c, ref)} /></SheetSample>}
    <Choices kind="compact" label={T.title}>
      {(['phone', 'regular', 'large', 'larger', 'largest'] as const).map((k) => <ChoiceRow key={k} kind="compact" name={T.choices[k]} line={k === 'phone' ? T.phoneLine : undefined} nameSize={T.sizes[k]} ringTop
        chosen={her.settings.textSize === k} onChoose={() => { setSettings({ textSize: k }); document.querySelector(`.tkc-sheet [role="radio"][aria-checked="true"]`)?.scrollIntoView({ block: 'nearest' }); }} />)}
    </Choices></BottomSheet></SheetHost>;
}

export const reminderNow = (s: Settings): 'off' | 'week' | 'month' => s.backupReminder ?? (matchMedia('(display-mode: standalone)').matches ? 'month' : 'week');

export function ReminderSheet({ onClose }: { onClose: () => void }) {
  const her = useHer(), R = S.reminder, now = reminderNow(her.settings);
  return <SheetHost onClose={onClose}><BottomSheet kind="pick" title={R.title} onClose={onClose}>
    <Choices kind="compact" label={R.title}>
      {(['off', 'week', 'month'] as const).map((k) => <ChoiceRow key={k} kind="compact" name={R.values[k]} ringTop chosen={now === k} onChoose={() => { setSettings({ backupReminder: k }); onClose(); }} />)}
    </Choices></BottomSheet></SheetHost>;
}

/** Add to Home Screen (TKC-004 0.6, 1244, 1293, 1301): the read sheet with two steps, or four when she has lists to carry over (Safari and the Home Screen app keep separate storage).
 *  The first of the four holds a small Save a Backup; Got It closes. */
export function AddHomeSheet({ hasLists, onSave, onClose }: { hasLists: boolean; onSave: () => void; onClose: () => void }) {
  const A = S.addHome;
  const steps = hasLists ? [{ ...A.save, name: A.save.name, line: A.save.line, button: A.save.button, onButton: onSave }, ...A.steps, A.restore] : A.steps;
  return <SheetHost onClose={onClose}><BottomSheet kind="read" title={A.title} line={hasLists ? A.lineLists : A.line} onClose={onClose}>
    <Stepper steps={steps} />
    <Button label={A.got} kind="primary" onClick={onClose} />
  </BottomSheet></SheetHost>;
}
