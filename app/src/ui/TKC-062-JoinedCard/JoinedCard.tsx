// TKC-062 JoinedCard 0.10 (3-6d notes: `merge` draws two neighbouring sections as one), 0.9 (3-6c, 3434 a / 3435 y: `rows` is its own section and `verse` is its own section; sections alternate card-top and surface), 0.8 (frame-lock-12 §1, 3421 y: `rows`, what she prays over, sits inside the lower half before `help`), 0.3 (16 px below the last line of the lower half or body, Build 7d), 0.2 (frame-lock-7 R1, R3, R4, R6, R7, R12): what she acts on and her turn in one card. One radius, one shadow, 12 px from the screen's edges.
// Never two cards, never a card in a card. The card is named by its label (R12): the label is not moved in the code order.
//  · joined  — a top half on `card-top` (a short piece of Scripture, an anchor quote, the readings she just heard, or the plate), then a plain lower half: the label, her turn, help links.
//  · single  — a band on `card-top` that holds the label and the why line (R3, 2014 y), then a plain body: the instruction and the words.
import type { ComponentChildren } from 'preact';
import './joinedcard.css';
export interface JoinedCardProps {
  kind?: 'joined' | 'single';
  /** joined: the top half (the anchor quote, the readings, the plate) */
  top?: ComponentChildren;
  /** The step's heading, the card's small label. Leave out when `slide` draws it (TKC-063) */
  label?: string;
  /** single: the why line, in the band under the label */
  why?: string;
  /** Prayer's parts two to five: the pills above already name the part, so the label is read aloud but not drawn */
  quietLabel?: boolean;
  /** The top half is the plate: centered, the Name the biggest words in the app (R6) */
  plate?: boolean;
  /** The lower half or the body */
  children?: ComponentChildren;
  /** joined: the rows she acts on (Prayer's nations or people), inside the lower half after her turn and before the help links (frame-lock-12 P1) */
  rows?: ComponentChildren;
  /** joined: Meditate's verse, its own section between the top and the lower half: the source line first, then the verse (3-6c, 3435 y). The lower half then sits on card-top, so sections alternate. */
  verse?: ComponentChildren;
  /** joined: the help links ("Need words? ›"), last in the lower half (last in the rows section when there are rows) */
  help?: ComponentChildren;
  /** joined: two neighbouring sections drawn as one (3-6d notes, Nov 25): `top-low` the band and quote with the aim (People); `low-rows` the aim with the rows (Kingdom's nations). The sections that remain still alternate. */
  merge?: 'top-low' | 'low-rows';
  /** joined: (R15) a band on `card-top` above the top half, holding the label and the why line; the lower half draws no label */
  band?: boolean;
}
/** One card to a screen, so one label id. */
export const CARD_LABEL_ID = 'tkc-jc-label';
export const CardLabel = ({ children, quiet }: { children: ComponentChildren; quiet?: boolean }) =>
  <h3 class={`tkc-jc__label${quiet ? ' is-quiet' : ''}`} id={CARD_LABEL_ID} data-part="heading">{children}</h3>;
export function JoinedCard({ kind = 'joined', top, label, why, quietLabel, plate, children, band, rows, help, verse, merge }: JoinedCardProps) {
  if (kind === 'single') return <section class="tkc-jc" data-tkc="TKC-062" data-kind="single" aria-labelledby={CARD_LABEL_ID}>
    <div class="tkc-jc__band" data-part="band"><CardLabel>{label}</CardLabel>{why && <p class="tkc-jc__why" data-part="why">{why}</p>}</div>
    <div class="tkc-jc__body" data-part="body">{children}</div>
  </section>;
  return <section class="tkc-jc" data-tkc="TKC-062" data-kind="joined" data-plate={plate ? '' : undefined} data-band={band ? '' : undefined} data-verse={verse ? '' : undefined} data-merge={merge} aria-labelledby={CARD_LABEL_ID}>
    {band && <div class="tkc-jc__band" data-part="band"><CardLabel>{label}</CardLabel>{why && <p class="tkc-jc__why" data-part="why">{why}</p>}</div>}
    {top && <div class="tkc-jc__top" data-part="top">{top}</div>}
    {verse && <div class="tkc-jc__verse" data-part="verse">{verse}</div>}
    <div class="tkc-jc__low" data-part="lower">{!band && label && <CardLabel quiet={quietLabel}>{label}</CardLabel>}{children}{!rows && help}</div>
    {rows && <div class="tkc-jc__rows" data-part="rows">{rows}{help}</div>}
  </section>;
}
