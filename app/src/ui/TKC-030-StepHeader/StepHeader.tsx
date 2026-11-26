// TKC-030 StepHeader, spec 0.7: says, once, what this step is, what to do, and why. The label row left the page (569): the step's name,
// its counter or name, and its state now live in the TopBar's where-line. What stays: the heading and the why line.
// 0.8 (frame-lock-7 part 2, C1): "About This Step ›" left the page; the step's page opens from the book button in the TopBar (`onInfo` is handed to it).
import type { ComponentChildren } from 'preact';
import './stepheader.css';
export interface StepHeaderProps {
  /** The step's name. Not drawn here (0.7); StepScreenView hands it to the TopBar. The link's spoken name uses it. */
  label: string;
  /** After the step's name: " · Question 1 of 6", " · All of Me". Drawn by the TopBar (0.7). */
  slot?: string;
  heading?: string; why?: string;
  /** Opens the step's page (claude/content/step-lessons.md). Drawn by the TopBar as the book button; leave out where the page is not built (the Guide's runs). */
  onInfo?: () => void;
  /** A revisited step's state. Drawn by the TopBar with its menu (0.7). */
  state?: 'done' | 'skipped'; onUndo?: () => void;
}
export function StepHeader({ heading, why }: StepHeaderProps) {
  return <div class="tkc-hd" data-tkc="TKC-030">
    {heading && <h3 class="tkc-hd__h" data-part="heading">{heading}</h3>}
    {why && <p class="tkc-hd__why" data-part="why">{why}</p>}
  </div>;
}

/** The step's instruction line (TKC-030 K: part of this component, placed right above the content, 824). */
export function StepInstruction({ text }: { text: string }) {
  return <p class="tkc-hd-instr" data-tkc="TKC-030" data-part="instruction">{text}</p>;
}

/** TKC-062 joined cards (frame-lock-7 R4, part 2 C1): the why line sits under the card; Turn to God's meaning line comes first. The link left: the book button in the TopBar opens the step's page. */
export function StepWhy({ why, children }: { why?: string; /** Under the card, before the why line: Turn to God's meaning line (1879 y) */ children?: ComponentChildren }) {
  return <div class="tkc-hd tkc-hd--under" data-tkc="TKC-030" data-kind="under">
    {children}{why && <p class="tkc-hd__why" data-part="why">{why}</p>}
  </div>;
}
