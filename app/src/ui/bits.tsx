// Small shared parts: icons (Phosphor, MIT, self-hosted, 1276), Bible text, the plant, sheets and toasts.
import type { ComponentChildren } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useSheetMotion, useToastMotion } from './motion';
import { EmptyState } from './TKC-019-EmptyState/EmptyState';
import { READING_FAILED } from '../copy';
import X from '@phosphor-icons/core/assets/regular/x.svg?raw';
import Info from '@phosphor-icons/core/assets/regular/info.svg?raw';
import CaretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import CaretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import CaretDown from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import CaretUp from '@phosphor-icons/core/assets/regular/caret-up.svg?raw';
import Check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import CheckBold from '@phosphor-icons/core/assets/bold/check-bold.svg?raw';
import House from '@phosphor-icons/core/assets/regular/house.svg?raw';
import HouseFill from '@phosphor-icons/core/assets/fill/house-fill.svg?raw';
import Hands from '@phosphor-icons/core/assets/regular/hands-praying.svg?raw';
import HandsFill from '@phosphor-icons/core/assets/fill/hands-praying-fill.svg?raw';
import Books from '@phosphor-icons/core/assets/regular/books.svg?raw';
import BooksFill from '@phosphor-icons/core/assets/fill/books-fill.svg?raw';
import Gear from '@phosphor-icons/core/assets/regular/gear.svg?raw';
import GearFill from '@phosphor-icons/core/assets/fill/gear-fill.svg?raw';
import Plant from '@phosphor-icons/core/assets/regular/plant.svg?raw';
import Dots from '@phosphor-icons/core/assets/regular/dots-three.svg?raw';
import { loadBook, getContent, peekBook, peekExtras, loadStudy, peekStudy, type RedParts } from '../data/content';
import { fontsReady } from './fonts';
import { chaptersOf, formatRef } from '../engine/refs';
import { stripLoneQuotes } from '../engine/quotes';
import type { Ref } from '../engine/types';
import { parseKeyRef } from '../engine/refs';

export const ICONS = { X, Info, CaretRight, CaretLeft, CaretDown, CaretUp, Check, CheckBold, House, HouseFill, Hands, HandsFill, Books, BooksFill, Gear, GearFill, Plant, Dots };
export function Icon({ n, size, label }: { n: keyof typeof ICONS; size?: number; label?: string }) {
  return <span class="icon" style={size ? { width: size, height: size } : undefined} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}
    dangerouslySetInnerHTML={{ __html: ICONS[n] }} />;
}

/** KJV marks the translators' added words in brackets; they show in italics, as printed Bibles do. */
function verseText(t: string, kjv: boolean) {
  if (!kjv) return t;
  return t.split(/(\[[^\]]*\])/).map((p, i) => (p.startsWith('[') ? <i key={i}>{p.slice(1, -1)}</i> : p));
}

/** A chapter's verses; `r` is a verse cut into parts where Jesus speaks ([text, 1] is red); `title` is a psalm's own title, set only when verse 1 is in the passage (frame-lock-6 §1, §2). */
type Chapters = { c: number; title?: string; /** Psalm 119 only: the letter's name (as this Bible prints it, in title case) and its part, when the passage begins at a part's first verse */ letter?: { name: string; part: number }; verses: { n: number; t: string; r?: RedParts }[] }[];
/** "SIN AND SHIN" → "Sin and Shin" (the Bible files print the letters in capitals; edit log). */
const titleCase = (t: string) => t.toLowerCase().replace(/\b[a-z]+/g, (w, i) => (i > 0 && w === 'and' ? w : w[0].toUpperCase() + w.slice(1)));
const slice = (ch: string[][], ref: Ref, trans: 'web' | 'kjv'): Chapters => { const x = peekExtras(trans, ref.b);
  return chaptersOf(ref, (c) => ch[c - 1].length).map(({ c, from, to }) => ({ c, ...(ref.b === 'PSA' && from === 1 && x?.t?.[String(c)] ? { title: x.t[String(c)] } : {}),
    ...(ref.b === 'PSA' && c === 119 && from % 8 === 1 && x?.h?.['119']?.[String(from)] ? { letter: { name: titleCase(x.h['119'][String(from)]), part: (from - 1) / 8 + 1 } } : {}),
    verses: ch[c - 1].slice(from - 1, to).map((t, i) => ({ n: from + i, t, ...(x?.r?.[String(c)]?.[String(from + i)] ? { r: x.r[String(c)][String(from + i)] } : {}) })).filter((v) => v.t) })); };

/** A reference's verses. Never stale (motion-lock §5.6): the moment the reference changes the old text is gone, and a book that was
 *  prefetched shows on the first frame, so a step opens with its text there (§5.1). null while the book is still loading. */
export type Phase = 'ready' | 'hold' | 'wait' | 'slow' | 'failed';
/** A reference's verses and how the load is going (0.4): `hold` under 1 s (nothing moves), `wait` past 1 s (placeholder lines), `slow` past 10 s, `failed`. */
export function useReadings(refs: Ref[], trans: 'web' | 'kjv'): { chs: Chapters[] | null; phase: Phase; retry: () => void } {
  const key = refs.length ? `${trans}|${JSON.stringify(refs)}` : '';
  const [got, set] = useState<{ key: string; v: Chapters[] } | null>(null);
  const [st, setSt] = useState<{ key: string; p: 'hold' | 'wait' | 'slow' | 'failed' }>({ key, p: 'hold' });
  const [tries, setTries] = useState(0);
  const books = refs.map((r) => peekBook(trans, r.b));
  const ready = refs.length > 0 && books.every(Boolean);
  useEffect(() => {
    if (!refs.length) return;
    // The book can land between this render (not ready) and this effect. Nothing else would re-render, so the step stayed blank in `hold` for good (Unit 0b): draw again, now that it is ready.
    if (refs.every((r) => peekBook(trans, r.b))) { if (!ready) setTries((n) => n + 1); return; }
    let live = true;
    setSt({ key, p: 'hold' });
    const t1 = setTimeout(() => live && setSt((s) => (s.p === 'hold' ? { key, p: 'wait' } : s)), 1000);
    const t2 = setTimeout(() => live && setSt((s) => (s.p === 'wait' ? { key, p: 'slow' } : s)), 10000);
    // All of a step's passages arrive together (the last one holds the rest), so a late passage never pushes text that already showed.
    Promise.all([Promise.all(refs.map((r) => loadBook(trans, r.b))), fontsReady()]).then(([all]) => { if (live) set({ key, v: all.map((ch, i) => slice(ch, refs[i], trans)) }); }, () => { if (live) setSt({ key, p: 'failed' }); });
    return () => { live = false; clearTimeout(t1); clearTimeout(t2); };
  }, [key, tries]);
  const retry = () => setTries((n) => n + 1);
  if (!refs.length) return { chs: null, phase: 'hold', retry };
  if (ready) return { chs: refs.map((r, i) => slice(books[i]!, r, trans)), phase: 'ready', retry };
  if (got && got.key === key) return { chs: got.v, phase: 'ready', retry };
  return { chs: null, phase: st.key === key ? st.p : 'hold', retry };
}
export function useReading(ref: Ref | null, trans: 'web' | 'kjv'): { chs: Chapters | null; phase: Phase; retry: () => void } {
  const r = useReadings(ref ? [ref] : [], trans);
  return { chs: r.chs ? r.chs[0] : null, phase: r.phase, retry: r.retry };
}
/** Study Notes or Dig Deeper for the Bible books a step touches (C1), with the same loading phases as the Bible text: `hold` under 1 s,
 *  `wait` past 1 s, `slow` past 10 s, `failed`. Never stale: the moment the books change the old notes are gone. */
export function useStudy<K extends 'notes' | 'dig'>(kind: K, bookIds: string[]) {
  const ids = [...new Set(bookIds)], key = `${kind}|${ids.join(',')}`;
  type Got = NonNullable<ReturnType<typeof peekStudy<K>>>;
  const now = (): Record<string, Got> | null => { const o: Record<string, Got> = {}; for (const b of ids) { const x = peekStudy(kind, b); if (!x) return null; o[b] = x as Got; } return o; };
  const [got, set] = useState<{ key: string; v: Record<string, Got> } | null>(null);
  const [st, setSt] = useState<{ key: string; p: 'hold' | 'wait' | 'slow' | 'failed' }>({ key, p: 'hold' });
  const [tries, setTries] = useState(0);
  const ready = ids.length > 0 && now();
  useEffect(() => {
    if (!ids.length) return;
    if (now()) { if (!ready) setTries((n) => n + 1); return; }
    let live = true;
    setSt({ key, p: 'hold' });
    const t1 = setTimeout(() => live && setSt((s) => (s.p === 'hold' ? { key, p: 'wait' } : s)), 1000);
    const t2 = setTimeout(() => live && setSt((s) => (s.p === 'wait' ? { key, p: 'slow' } : s)), 10000);
    Promise.all([Promise.all(ids.map((b) => loadStudy(kind, b))), fontsReady()]).then(([all]) => { if (live) set({ key, v: Object.fromEntries(ids.map((b, i) => [b, all[i] as Got])) }); }, () => { if (live) setSt({ key, p: 'failed' }); });
    return () => { live = false; clearTimeout(t1); clearTimeout(t2); };
  }, [key, tries]);
  const retry = () => setTries((n) => n + 1);
  if (!ids.length) return { data: null, phase: 'hold' as Phase, retry };
  if (ready) return { data: ready, phase: 'ready' as Phase, retry };
  if (got && got.key === key) return { data: got.v, phase: 'ready' as Phase, retry };
  return { data: null, phase: (st.key === key ? st.p : 'hold') as Phase, retry };
}

/** A reference's verses. Never stale (motion-lock §5.6): the moment the reference changes the old text is gone, and a book that was
 *  prefetched shows on the first frame, so a step opens with its text there (§5.1). null while the book is still loading. */
export function useVerses(ref: Ref | null, trans: 'web' | 'kjv'): Chapters | null { return useReading(ref, trans).chs; }

/** A verse the app picks for her (the week's verse, Meditate's, an anchor): the text as one line. Where a World English verse opens or
 *  closes with a quote mark that has no partner inside the picked verse, only that mark is dropped; no word changes (frame-lock-2 §6, 589). */
export function pickedText(chs: Chapters | null, trans: 'web' | 'kjv'): string | undefined {
  if (!chs) return undefined;
  let t = chs.flatMap((c) => c.verses.map((v) => v.t)).join(' ').replace(/\[|\]/g, '');
  t = stripLoneQuotes(t, trans);
  return t;
}

/** TKC-032 0.4 loading and TKC-019 0.4 slow and failed: what stands in for a reading that has not come (nothing under 1 s, then quiet lines).
 *  `padded`: on a page whose reading sits straight on the page (Bible Reading, Psalm, Proverb, Study Notes, Dig Deeper) the slow and failed lines go inside the page margins like the missing-help line (TKC-019 0.5.3; the Build 3 measure checked only sideways scroll). Inside a card the card gives the margin. */
export function ReadingWait({ phase, retry, padded }: { phase: Phase; retry: () => void; padded?: boolean }) {
  if (phase === 'hold') return <div class="reading-hold" aria-busy="true" />;
  const lines = <div class="reading-wait" aria-hidden="true"><i /><i /><i /><i /></div>;
  if (phase === 'wait') return <div aria-busy="true">{lines}</div>;
  const msg = phase === 'slow' ? <EmptyState kind="slow" line="Still getting this reading ready." /> : <EmptyState kind="failed" line={READING_FAILED} actionLabel="Try Again" onAction={retry} />;
  const body = padded ? <div class="tkc-step__missing" data-part="missing">{msg}</div> : msg;
  return phase === 'slow' ? <>{lines}{body}</> : body;
}
/** TKC-032 ReadingBlock: Scripture flat, verse numbers inline; stacked passages get chapter titles. */
export function Passage({ refs, trans }: { refs: Ref[]; trans: 'web' | 'kjv' }) {
  const stacked = refs.length > 1 || refs.some((r) => (r.c2 ?? r.c) !== r.c);
  return <div class="reading-block">{refs.map((r) => <PassageOne key={JSON.stringify(r)} r={r} trans={trans} stacked={stacked} />)}</div>;
}
function PassageOne({ r, trans, stacked }: { r: Ref; trans: 'web' | 'kjv'; stacked: boolean }) {
  const { chs, phase, retry } = useReading(r, trans);
  const content = getContent();
  if (!chs) return <ReadingWait phase={phase} retry={retry} />;
  return <>{chs.map(({ c, verses }) => (
    <section key={c} data-chapter={`${r.b} ${c}`}>
      {stacked && <h2 class="chapter-title">{formatRef(content, { b: r.b, c })}</h2>}
      <p class="reading">{verses.map((v) => <span key={v.n}><span class="vnum">{v.n}</span>{verseText(v.t, trans === 'kjv')} </span>)}</p>
    </section>))}</>;
}

/** One verse as plain text, for verse cards, anchors and prayer words. */
export function VerseText({ r, trans, quote }: { r: Ref; trans: 'web' | 'kjv'; quote?: boolean }) {
  const chs = useVerses(r, trans);
  if (!chs) return <>…</>;
  const t = chs.flatMap((c) => c.verses.map((v) => v.t)).join(' ').replace(/\[|\]/g, '');
  return <>{quote ? `“${t}”` : t}</>;
}
export const keyRef = (s: string) => parseKeyRef(s);

/** TKC-055 GrowthPlant at the earned stage (a simple drawing for the skeleton; the approved drawing at Build's screen pass). */
export function PlantMark({ stage, size = 20 }: { stage: number; size?: number }) {
  return <span class="plant" style={{ width: size, height: size, display: 'inline-block', color: 'var(--success-ink)' }} data-stage={stage}><Icon n="Plant" size={size} /></span>;
}

export function Sheet({ children, onClose, label }: { children: ComponentChildren; onClose: () => void; label: string }) {
  const root = useRef<HTMLDivElement>(null); useSheetMotion(root);
  return <div class="scrim" ref={root} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div class="sheet" role="dialog" aria-modal="true" aria-label={label}><div class="grab" />{children}</div>
  </div>;
}

export function Toast({ text, action, onAction, onDone, ms = 5000 }: { text: string; action?: string; onAction?: () => void; onDone: () => void; ms?: number }) {
  const root = useRef<HTMLDivElement>(null); useToastMotion(root);
  useEffect(() => { const t = setTimeout(onDone, ms); return () => clearTimeout(t); }, [text]);
  return <div class="toast" role="status" ref={root}><span>{text}</span>{action && <button onClick={() => { onAction?.(); onDone(); }}>{action}</button>}</div>;
}

/** TKC-042 LocatorMap, placeholder look (979): a round globe with the nation's spot. */
export function LocatorMap({ latlng, size = 48 }: { latlng: [number, number] | null; size?: number }) {
  const [lat, lng] = latlng ?? [0, 0];
  const x = 24 + (lng / 180) * 16, y = 24 - (lat / 90) * 16;
  return <svg class="map" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true">
    <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".7" />
    <path d="M7 24h34M24 7v34" stroke="currentColor" stroke-width="1" opacity=".25" />
    {latlng && <circle cx={x} cy={y} r="2.6" fill="currentColor" />}
  </svg>;
}
