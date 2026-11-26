// Lists (Flow 5; the 5b Lists lock): the pattern parts the Lists screens are built from. Layout only; every component is the library's.
// Tab bar at the foot (TKC-001); a page opened from a list has the page TopBar (TKC-002) in its place at the head and no tab bar change.
import type { ComponentChildren } from 'preact';
import { TabBar, type Place } from '../TKC-001-TabBar/TabBar';
import './lists.css';
export function ListsShell({ top, onTab, children, view }: { top?: ComponentChildren; onTab: (p: Place) => void; children: ComponentChildren; view: string }) {
  return <div class="tkc-screen" data-screen="lists" data-view={view}>{top}<main class="tkc-lists">{children}</main><TabBar current="Lists" onGo={onTab} /></div>;
}
export const ListsTitle = ({ children }: { children: ComponentChildren }) => <h1 class="tkc-lists__title ty-display-l" data-part="title">{children}</h1>;
export const ListsHead = ({ title, add }: { title: ComponentChildren; add?: ComponentChildren }) => <div class="tkc-lists__title-row" data-part="head"><h1 class="ty-display-l" data-part="title">{title}</h1>{add}</div>;
export const ListsLine = ({ children }: { children: ComponentChildren }) => <p class="tkc-lists__line ty-body" data-part="line">{children}</p>;
export const ListsAnchor = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__anchor" data-part="anchor">{children}</div>;
export const ListsMonth = ({ children }: { children: ComponentChildren }) => <h2 class="tkc-lists__month" data-part="month">{children}</h2>;
export const ListsCards = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__cards" data-part="cards">{children}</div>;
export const ListsFacts = ({ children, tight }: { children: ComponentChildren; tight?: boolean }) => <div class="tkc-lists__facts" data-part="facts" data-tight={tight ? '' : undefined}>{children}</div>;
export const ListsActions = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__acts" data-part="actions">{children}</div>;
export const ListsRecordHead = ({ mark, title, line }: { mark: ComponentChildren; title: string; line: string }) => <div class="tkc-lists__head" data-part="record-head">{mark}<h1 class="ty-display-l" data-part="title">{title}</h1><p class="ty-body" data-part="day">{line}</p></div>;
export const ListsStory = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__story" data-part="story">{children}</div>;
export const ListsEmpty = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__empty" data-part="empty">{children}</div>;
export const ListsPrompt = ({ children }: { children: ComponentChildren }) => <p class="tkc-lists__prompt ty-body" data-part="prompt">{children}</p>;
export const ListsBig = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__big" data-part="big-button">{children}</div>;
export type { Place };
export const ListsLink = ({ children, tight }: { children: ComponentChildren; tight?: boolean }) => <div class="tkc-lists__link" data-part="who-link" data-tight={tight ? '' : undefined}>{children}</div>;
/** The search box under the tabs (16 under the title once the tabs step aside), and the Sort button's row on one list (right-aligned, its text edge on the margin). */
export const ListsSearch = ({ children }: { children: ComponentChildren }) => <div class="tkc-lists__search" data-part="search">{children}</div>;
/** The sort row (frame-lock-10 §1, 3403 y): "+ Add Person" at the left on the names' edge, the Sort button at the right; at larger text the sort wraps under it, right-aligned. */
export const ListsSort = ({ children, add }: { children: ComponentChildren; add?: ComponentChildren }) => <div class="tkc-lists__sort" data-part="sort">{add}{children}</div>;
/** A polite status for a screen reader: the count of results (the no-match line speaks for itself). */
export const ListsStatus = ({ children }: { children?: ComponentChildren }) => <p class="tkc-lists__sr" role="status" data-part="status">{children}</p>;
