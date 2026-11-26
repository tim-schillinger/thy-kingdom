// TKC-061 WordMeaning 0.1, plate kind (frame-lock-7 R6; frame-lock-5-names-2 §C): a Name or Attribute night is received. The plate is the top half of a TKC-062 on all six questions.
// Top to bottom, centered: the small line · the Name in Hebrew letters (Names only; Alpha and Omega in Greek) · the Name or Attribute · its plain English (Names only) · the meaning line ·
// the verse and its source (children) · the King James line (the 11 Names whose Bible prints LORD, King James only). No picture per Name (1869).
import type { ComponentChildren } from 'preact';
import './wordmeaning.css';
export interface WordMeaningProps {
  /** "A Name of God" or "What God Is Like" */
  eyebrow: string;
  /** The Name in Hebrew letters (Greek for Alpha and Omega). Decorative: hidden from a screen reader (3002 y) */
  mark?: string;
  /** The Name or Attribute: the largest words in the app */
  name: string;
  /** The Name's plain English ("Lord Our Righteousness"), Names only */
  plain?: string;
  /** The meaning line */
  meaning: string;
  /** The verse and its source line */
  children?: ComponentChildren;
  /** The King James line, under the source line, King James only */
  kjv?: string;
}
export function WordMeaning({ eyebrow, mark, name, plain, meaning, children, kjv }: WordMeaningProps) {
  return <div class="tkc-wmean" data-tkc="TKC-061" data-kind="plate">
    <p class="tkc-wmean__eye" data-part="eyebrow">{eyebrow}</p>
    {mark && <p class="tkc-wmean__mark" data-part="mark" aria-hidden="true" lang="he">{mark}</p>}
    <h2 class="tkc-wmean__name" data-part="name">{name}</h2>
    {plain && <p class="tkc-wmean__plain" data-part="plain">{plain}</p>}
    <p class="tkc-wmean__mean" data-part="meaning">{meaning}</p>
    {children && <div class="tkc-wmean__verse" data-part="verse">{children}</div>}
    {kjv && <p class="tkc-wmean__kjv" data-part="kjv">{kjv}</p>}
  </div>;
}
