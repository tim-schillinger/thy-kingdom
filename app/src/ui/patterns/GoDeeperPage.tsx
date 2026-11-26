// Go Deeper's pages (pattern; Guide Studio v1.0 locked 1218, claude/content/go-deeper.md approved Nov 18, 2026): the Lord's Prayer part by part, and a check-in's area cards.
// Layout only; every component is the library's. Screens hold no styling (build-standards §5.8), so every class lives here. The runs reuse GuidePage's GuideRun (✕ top, foot).
import type { ComponentChildren } from 'preact';
import './godeeper.css';

/** The prayer's progress cells: 0 above the page's side margins, as Prayer's own (StepPrayerProgress). */
export const GDProgress = ({ children }: { children: ComponentChildren }) => <div class="tkc-gd__prog" data-part="prayer-progress">{children}</div>;
/** The anchor quote, space-4 under the cells. */
export const GDAnchor = ({ children }: { children: ComponentChildren }) => <div class="tkc-gd__anc" data-part="anchor">{children}</div>;
/** The aim, then "Ways to Pray This Part" 24 under it, then the three ways (TKC-028 static) and the move 24 under them. */
export const GDAim = ({ children }: { children: ComponentChildren }) => <div class="tkc-gd__aim" data-part="aim">{children}</div>;
export const GDWays = ({ head, children }: { head: string; children: ComponentChildren }) => <section class="tkc-gd__ways" data-part="ways"><h2 class="tkc-gd__wh" data-part="ways-head">{head}</h2>{children}</section>;
export const GDMove = ({ children }: { children: ComponentChildren }) => <div class="tkc-gd__move" data-part="move">{children}</div>;
/** "In the Bible": the TKC-014 prose accordion, space-6 under the last thing, and room at the foot. */
export const GDBible = ({ children }: { children: ComponentChildren }) => <div class="tkc-gd__bible" data-part="in-the-bible">{children}</div>;
/** An area page: the circle and "Area n of 12" centered and fixed, 4 px apart; 32 under them, the card. */
export const GDArea = ({ circle, label, children }: { circle: ComponentChildren; label: string; children: ComponentChildren }) =>
  <div class="tkc-gd__area" data-part="area"><div class="tkc-gd__where" data-part="where">{circle}<p class="tkc-gd__of ty-label" data-part="area-of">{label}</p></div>{children}</div>;
/** The center question: the circle (✓), the head, the anchor, the question and the move. */
export const GDCenter = ({ circle, title, children }: { circle: ComponentChildren; title: string; children: ComponentChildren }) =>
  <div class="tkc-gd__center" data-part="center"><div class="tkc-gd__where" data-part="where">{circle}</div><h1 class="tkc-gd__ct ty-display-l" data-part="title">{title}</h1>{children}</div>;
/** The check-in's lesson page: the circle of 12 at its larger size, then Begin. */
export const GDCircle = ({ children }: { children: ComponentChildren }) => <div class="tkc-gd__circle" data-part="circle">{children}</div>;
