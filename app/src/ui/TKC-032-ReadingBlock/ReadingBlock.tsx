// TKC-032 ReadingBlock 0.3.1: the Word on the page, flat and whole, the brightest thing on the screen (497, 585). Built from atomic kinds so a
// screen can stack them as the spec's anatomy says: passage (verse numbers inline) · title (a chapter title) · prose (a classic's paragraphs) ·
// helps (study notes and Dig Deeper sections, in the sans so Scripture stays brightest, 917) · credit (the writer, under the last line).
// `stacked` is the composite: a chapter title before each passage (824).
import type { ComponentChildren } from 'preact';
import type { NoteBlock, Inline } from '../../engine/types';
import { Icon } from '../icon';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import './readingblock.css';
/** `parts` (0.5): a verse cut where Jesus speaks, in order; [text, 1] is red, [text] is not. Their text joined is `text`. */
export type Part = [string] | [string, 1];
export interface Verse { n: string; text: string; parts?: Part[] }
export type HelpsBlock = { kind: 'section'; text: string } | { kind: 'note'; verse?: string; lemma?: string; text: string }
  /** A study note with its own paragraphs, lists and italics (C1): `blocks` as the notes file stores them. */
  | { kind: 'rich'; verse?: string; blocks: NoteBlock[] };
export interface ReadingBlockProps {
  kind: 'passage' | 'title' | 'prose' | 'helps' | 'credit' | 'stacked' | 'letter';
  /** 0.7, `letter` (frame-lock-7 part 2, C2, 3014 y): Psalm 119's part is a card on `card-top` above verse 1: the small line, the Hebrew letter, its name, the meaning line, the link. The mark is decorative (hidden from screen readers); only the link is tappable. */
  letter?: { mark: string; name: string; plain: string; meaning: string; more: string; onMore: () => void };
  verses?: Verse[]; /** A Psalm title as the translation prints it ("A Psalm by David."): a line above verse 1, only when verse 1 is in the passage (0.5, 1800) */ psalmTitle?: string;
  /** KJV: the word LORD is drawn as a full-size L and a smaller ORD (780) */ kjv?: boolean;
  /** A passage with another title after it: closes at space-3 instead of space-12 */ joins?: boolean;
  text?: string; /** A credit that opens its notice (the license needs one tap to the notice, 739) */ onOpen?: () => void;
  /** A chapter title that folds the notes under it (a long Study Notes night, 736): open or closed, and the tap */ fold?: { open: boolean; onToggle: () => void };
  /** A chapter title that is the first thing under the SourceLine */ first?: boolean; /** The block follows a chapter title */ afterTitle?: boolean;
  paragraphs?: Array<string | Inline[] | { h: string }>; blocks?: HelpsBlock[];
  parts?: Array<{ title: string; verses: Verse[]; psalmTitle?: string }>;
}
function Lord({ text, kjv }: { text: string; kjv?: boolean }): ComponentChildren {
  if (!kjv) return text;
  const bits = text.split(/\b(LORD)\b/);
  return <>{bits.map((b, k) => (b === 'LORD' ? <span class="tkc-rb__lord" key={k}>L<b>ORD</b></span> : b))}</>;
}
const inline = (xs: Inline[]) => xs.map((x, k) => (typeof x === 'string' ? x : <i key={k}>{x[1]}</i>));
function Rich({ blocks }: { blocks: NoteBlock[] }) {
  return <>{blocks.map((b, k) => b[0] === 'p'
    ? <p class="tkc-rb-helps__p" data-part="paragraph" key={k}>{inline(b[1])}</p>
    : b[0] === 'ul'
      ? <ul class="tkc-rb-helps__list" data-part="list" key={k}>{b[1].map((it, j) => <li key={j}><Rich blocks={it} /></li>)}</ul>
      : <ol class="tkc-rb-helps__list" data-part="list" key={k}>{b[1].map((it, j) => <li key={j}><Rich blocks={it} /></li>)}</ol>)}</>;
}
export function ReadingBlock(p: ReadingBlockProps) {
  const { kind } = p;
  if (kind === 'stacked') return <>{(p.parts ?? []).map((q, k, a) => <>
    <ReadingBlock kind="title" text={q.title} first={k === 0} />
    <ReadingBlock kind="passage" verses={q.verses} psalmTitle={q.psalmTitle} kjv={p.kjv} joins={k < a.length - 1} afterTitle />
  </>)}</>;
  if (kind === 'letter' && p.letter) { const l = p.letter; return <div class="tkc-rb-letter" data-tkc="TKC-032" data-kind="letter">
    <p class="tkc-rb-letter__plain" data-part="plain">{l.plain}</p>
    <span class="tkc-rb-letter__mark" data-part="mark" lang="he" aria-hidden="true">{l.mark}</span>
    <h4 class="tkc-rb-letter__word" data-part="word" aria-level={2} role="heading">{l.name}</h4>
    <p class="tkc-rb-letter__meaning" data-part="meaning">{l.meaning}</p>
    <TextLink kind="more" label={l.more} aria={`${l.more}. Opens what Psalm 119 is`} onOpen={l.onMore} />
  </div>; }
  if (kind === 'title' && p.fold) return <h4 class={`tkc-rb-ct tkc-rb-ct--fold${p.first ? ' is-first' : ''}`} data-tkc="TKC-032" data-kind="title" data-fold={p.fold.open ? 'open' : 'closed'} aria-level={2} role="heading">
    <button type="button" aria-expanded={p.fold.open} onClick={p.fold.onToggle}><span>{p.text}</span><Icon n="caretDown" size="calc(20px*var(--ts))" /></button></h4>;
  if (kind === 'title') return <h4 class={`tkc-rb-ct${p.first ? ' is-first' : ''}`} data-tkc="TKC-032" data-kind="title" aria-level={2} role="heading">{p.text}</h4>;
  if (kind === 'credit' && p.onOpen) return <p class="tkc-rb-credit is-link" data-tkc="TKC-032" data-kind="credit"><TextLink kind="more" label={p.text?.replace(/CC BY-SA 4\.0/g, 'CC BY‑SA 4.0')} onOpen={p.onOpen} /></p>;   /* the license name wraps as one unit, never inside it (3-3z measure) */
  if (kind === 'credit') return <p class="tkc-rb-credit" data-tkc="TKC-032" data-kind="credit">{p.text}</p>;
  if (kind === 'prose') return <div class="tkc-rb-prose" data-tkc="TKC-032" data-kind="prose">{(p.paragraphs ?? []).map((t, k) => !Array.isArray(t) && typeof t === 'object' ? <p key={k} class="tkc-rb-prose__h" data-part="head">{t.h}</p> : <p key={k} data-part="paragraph">{typeof t === 'string' ? t : inline(t)}</p>)}</div>;
  if (kind === 'helps') return <div class={`tkc-rb-helps${p.afterTitle ? ' is-after' : ''}${p.joins ? ' is-joins' : ''}`} data-tkc="TKC-032" data-kind="helps">
    {(p.blocks ?? []).map((b, k) => b.kind === 'section'
      ? <p class="tkc-rb-helps__sl" data-part="section" key={k}>{b.text}</p>
      : b.kind === 'rich'
      ? <div class="tkc-rb-helps__note" data-part="note" key={k}>{b.verse && <span class="tkc-rb-helps__vl" data-part="verse-label">{b.verse}</span>}<Rich blocks={b.blocks} /></div>
      : <p class="tkc-rb-helps__note" data-part="note" key={k}>{b.verse && <span class="tkc-rb-helps__vl" data-part="verse-label">{b.verse}</span>}{b.lemma && <><b class="tkc-rb-helps__lem" data-part="lemma">{b.lemma}</b>{' '}</>}{b.text}</p>)}
  </div>;
  const v = p.verses ?? [];
  return <p class={`tkc-rb${p.joins ? ' is-joins' : ''}${p.afterTitle ? ' is-after' : ''}`} data-tkc="TKC-032" data-kind="passage">
    {p.psalmTitle && <span class="tkc-rb__pt" data-part="psalm-title">{p.psalmTitle}</span>}
    {v.map((x, k) => <><span class="tkc-rb__v" data-part="number">{x.n}</span>{x.parts
      ? <>{x.parts.map((q, j) => q[1] ? <span class="tkc-rb__j" data-part="jesus" key={j}><Lord text={q[0]} kjv={p.kjv} /></span> : <Lord text={q[0]} kjv={p.kjv} />)}{k < v.length - 1 ? ' ' : ''}</>
      : <Lord text={x.text + (k < v.length - 1 ? ' ' : '')} kjv={p.kjv} />}</>)}
  </p>;
}
