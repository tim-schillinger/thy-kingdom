// TKC-004 BottomSheet, spec 0.6, Sprint 2 Frame: the shell and five bodies that need nothing unbuilt yet:
// pick one (title, ✕, optional line, choices), read (Learn More), menu (name, ✕, actions), confirm (question, line, buttons).
// The thanks (0.6: a small WinMark with hands, the heading, the line, Amen) is here since TKC-022 (Sprint 2, Step A). The form kind (Cancel · title, then its body in the slot) and the date grid in a pick one came in chat 4b.
import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { Icon } from '../icon';
import { Button } from '../TKC-006-Button/Button';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { WinMark } from '../TKC-022-WinMark/WinMark';
import './bottomsheet.css';

export type SheetKind = 'pick' | 'read' | 'menu' | 'confirm' | 'thanks' | 'form';
export interface BottomSheetProps {
  kind: SheetKind;
  /** Pick one and read: the title. Menu: the item's name. Confirm: the question. */
  title: string;
  /** Pick one: the picker-line. Menu: what she prays for. Confirm: the line. */
  line?: string;
  /** The dialog's accessible name when the title alone is not enough ("Morning Walk steps"). */
  label?: string;
  /** Another spec's component that owns this root (TKC-005 draws a pick one with its own rows). */
  tkc?: string;
  /** Library and tests only: show the ✕ in a state. */
  closeShow?: 'pressed' | 'focus';
  /** `read` without a header title (0.8, frame-lock-6 §6): the ✕ stays pinned, the sheet's name is only its accessible name. */
  bare?: boolean;
  /** `read` or `pick` showing a page inside a list (0.11, frame-lock-7 R5): a back control in the header's left column; focus lands on the title */
  back?: { label: string; onBack: () => void };
  /** A sheet with no row to land on (TKC-005 `look`): focus lands on the title. */
  focusTitle?: boolean;
  onClose?: () => void;
  /** Thanks: plays the WinMark once as Save turns the form (H) */
  thanksPlay?: boolean;
  children?: ComponentChildren;
}

export function BottomSheet({ kind, title, line, label, tkc = 'TKC-004', closeShow, onClose, thanksPlay, focusTitle, bare, back, children }: BottomSheetProps) {
  const ttl = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (focusTitle || back) ttl.current?.focus({ preventScroll: true }); }, []);
  const x = <button type="button" class={`tkc-sheet__x${closeShow ? ` is-${closeShow}` : ''}`} data-part="close" aria-label="Close" onClick={onClose}><Icon n="x" size="22px" /></button>;
  return <div class="tkc-sheet" role={kind === 'confirm' ? 'alertdialog' : 'dialog'} aria-modal="true" aria-label={kind === 'confirm' ? undefined : label ?? title}
    aria-labelledby={kind === 'confirm' ? 'tkc-sheet-q' : undefined} data-tkc={tkc} data-kind={kind}>
    <div class="tkc-sheet__grab" data-part="grab" aria-hidden="true" />
    {kind === 'menu' ? <div class="tkc-sheet__mhd" data-part="header"><span class="tkc-sheet__lt"><b data-part="title">{title}</b>{line ? <span data-part="line">{line}</span> : null}</span>{x}</div> : null}
    {kind === 'pick' || kind === 'read' ? <><div class="tkc-sheet__pkh" data-part="header" data-bare={bare ? '' : undefined}>{back ? <button type="button" class="tkc-sheet__back" data-part="back" aria-label={back.label} onClick={back.onBack}><Icon n="caretLeft" size="22px" /></button> : <span aria-hidden="true" />}{bare ? <span aria-hidden="true" /> : <h4 data-part="title" ref={ttl} tabIndex={focusTitle || back ? -1 : undefined}>{title}</h4>}{x}</div>
      {line ? <p class="tkc-sheet__pl" data-part="line">{line}</p> : null}</> : null}
    {kind === 'form' ? <div class="tkc-sheet__fh" data-part="header"><span class="tkc-sheet__fc"><Button label="Cancel" kind="quiet" place="sheet-header" onClick={onClose} /></span><h4 data-part="title">{title}</h4><span aria-hidden="true" /></div> : null}
    {kind === 'thanks' ? <div class="tkc-sheet__thx"><WinMark size="small" glyph="hands" play={thanksPlay} /><h3 data-part="title">{title}</h3>{line ? <p data-part="line">{line}</p> : null}{children}</div> : null}
    {kind === 'confirm' ? <div class="tkc-sheet__cf"><h3 id="tkc-sheet-q" data-part="title">{title}</h3>{line ? <p data-part="line">{line}</p> : null}{children}</div> : kind === 'thanks' ? null : children}
  </div>;
}

/** The read kind's body (0.5): the lesson's first two parts word for word, then "Read More in the Guide" (582), which opens that step's page (0.9, Build 3-4w; it was disabled until the Guide existed, 3170). Without `onMore` it stays disabled. */
export function ReadBody({ parts, action = 'Read More in the Guide', onMore }: { parts: Array<{ head?: string; body: string }>; action?: string | null; onMore?: () => void }) {
  return <div class="tkc-sheet__read" data-part="body">
    {parts.map((p, i) => <section key={p.head ?? i}>{p.head && <h5>{p.head}</h5>}<p>{p.body}</p></section>)}
    {action !== null && <div class="tkc-sheet__more"><Button label={action} kind="secondary" disabled={!onMore} onClick={onMore} /></div>}</div>;
}

/** The read kind's three titled sections (frame-lock-4a §3, 4b §3, 4c §1): a line, three bulleted ways, and one verse in her Bible with its reference and Bible after it.
 *  An optional `note` (a meaning line, Giving's and Fairness's anchors) can stand alone in place of the sections. */
export interface ReadSectionsProps { titles: [string, string, string]; line: string; ways: string[]; verse: string; reference: string; bible: string }
export function ReadSections({ titles, line, ways, verse, reference, bible }: ReadSectionsProps) {
  return <div class="tkc-sheet__read tkc-sheet__rs" data-part="body">
    <section><h5>{titles[0]}</h5><p>{line}</p></section>
    <section><h5>{titles[1]}</h5><ul>{ways.map((w) => <li key={w}>{w}</li>)}</ul></section>
    <section><h5>{titles[2]}</h5><p class="tkc-sheet__rv">{verse}</p><p class="tkc-sheet__rr">{reference} · {bible}</p></section></div>;
}
/** The Learn More sheet's body (0.8, frame-lock-6 §6): sections with a hairline between; a section is paragraphs or items (a word, its meaning, and the prayer's line under it). */
export interface LearnSection { head: string; paragraphs?: string[]; items?: Array<{ word: string; meaning: string; line: string }> }
export function ReadLearn({ sections }: { sections: LearnSection[] }) {
  return <div class="tkc-sheet__read tkc-sheet__learn" data-part="body">
    {sections.map((x) => <section key={x.head}><h5>{x.head}</h5>
      {x.paragraphs?.map((t, k) => <p key={k}>{t}</p>)}
      {x.items ? <ul class="tkc-sheet__items">{x.items.map((it) => <li key={it.word}><p data-part="meaning"><b>{it.word}:</b> {it.meaning}</p><p class="tkc-sheet__pr" data-part="prayer-line">{it.line}</p></li>)}</ul> : null}</section>)}</div>;
}
/** A meaning line under a verse in the read sheet (1703, 1714, 1721). */
export function ReadNotice({ sections, links }: { sections: Array<{ head: string; body: string }>; links: Array<{ label: string; href: string }> }) {
  return <div class="tkc-sheet__read tkc-sheet__notice" data-part="body">
    {sections.map((x) => <section key={x.head}><h5>{x.head}</h5><p>{x.body}</p></section>)}
    <section><p>{links.map((l, k) => <>{k > 0 && <br />}<a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></>)}</p></section></div>;
}
export function ReadNote({ children }: { children: ComponentChildren }) { return <p class="tkc-sheet__rn" data-part="meaning">{children}</p>; }

/** The pick one kind's choices: TKC-012 rows in a radio group. */
export function Choices({ kind = 'compact', label, children }: { kind?: 'full' | 'compact'; label: string; children?: ComponentChildren }) {
  return <div class="tkc-sheet__choices" data-kind={kind} role="radiogroup" aria-label={label} data-part="choices">{children}</div>;
}

/** Text Size's sample (0.6, 1249): this week's verse in a card, above the choices, so she sees each size as she picks it. Named "Sample at Larger". */
export function SheetSample({ name, children }: { name: string; children: ComponentChildren }) {
  return <div class="tkc-sheet__sample" role="group" aria-label={name} data-part="sample">{children}</div>;
}

/** The menu kind's actions: TKC-006 stack, primary then secondary then quiet. */
export function Actions({ children }: { children: ComponentChildren }) { return <div class="tkc-sheet__acts" data-part="actions">{children}</div>; }

/** The form kind's body slots (0.6 C5, D): a field (a TKC-011 or the List label over TKC-047), the question, the date line, and the one primary. */
export function FormField({ children }: { children: ComponentChildren }) { return <div class="tkc-sheet__fld" data-part="fields">{children}</div>; }
export function FormQuestion({ question, helper }: { question: string; helper?: string }) {
  return <><h3 class="tkc-sheet__mq" data-part="question">{question}</h3>{helper ? <p class="tkc-sheet__mqh" data-part="helper">{helper}</p> : null}</>;
}
export function FormWhen({ children }: { children: ComponentChildren }) { return <p class="tkc-sheet__when" data-part="when">{children}</p>; }
export function FormNote({ children }: { children: ComponentChildren }) { return <p class="tkc-sheet__note" role="status" data-part="note">{children}</p>; }
export function FormGo({ children }: { children: ComponentChildren }) { return <div class="tkc-sheet__go" data-part="go">{children}</div>; }
export function FormNotice({ children }: { children: ComponentChildren }) { return <div class="tkc-sheet__notice" data-part="notice">{children}</div>; }

/** A list that opens pages inside the same sheet (0.11, frame-lock-7 R5, 1881): one column of words, each "[word] ›" in the shared link look (TKC-007 more). */
export function ReadList({ items, label, onPick, focusIndex }: { items: string[]; label: string; onPick: (i: number) => void; focusIndex?: number | null }) {
  const ul = useRef<HTMLUListElement>(null);
  useEffect(() => { if (focusIndex != null) ul.current?.querySelectorAll<HTMLElement>('button')[focusIndex]?.focus(); }, []);   // back from a page: focus is on the row she left (0.14), not lost to the page
  return <ul class="tkc-sheet__list" data-part="list" aria-label={label} ref={ul}>{items.map((t, k) => <li key={t}><TextLink kind="more" label={t} aria={`${t}. Opens what it means`} onOpen={() => onPick(k)} /></li>)}</ul>;
}
