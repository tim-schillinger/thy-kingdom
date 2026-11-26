// A Settings page opened from Settings (the Settings Lock): the page TopBar (‹ Settings) at the head, the title, one grouped panel, the tab bar at the foot.
// Layout only; every component is the library's.
import type { ComponentChildren } from 'preact';
import { TabBar, type Place } from '../TKC-001-TabBar/TabBar';
import './settingspage.css';
export function SettingsShell({ top, onTab, children, view }: { top?: ComponentChildren; onTab: (p: Place) => void; children: ComponentChildren; view: string }) {
  return <div class="tkc-screen" data-screen="settings" data-view={view}>{top}<main class="tkc-settings">{children}</main><TabBar current="Settings" onGo={onTab} /></div>;
}
export const SettingsTitle = ({ children }: { children: ComponentChildren }) => <h1 class="tkc-settings__title ty-display-l" data-part="title">{children}</h1>;
/** The grouped panel: its rows share one surface; hairlines between them (TKC-015 spec C). */
export const SettingsPanel = ({ label, icons, children }: { label: string; icons?: boolean; children: ComponentChildren }) => <div class="tkc-settings__panel" role="group" aria-label={label} data-icons={icons ? '' : undefined} data-part="panel">{children}</div>;
/** A group head (spec C): names what is in the panels under it. */
export const SettingsHead = ({ children }: { children: ComponentChildren }) => <h2 class="tkc-settings__head" data-part="group-head">{children}</h2>;
/** Group print (spec C): the line under a panel that says what its last row does. */
export const SettingsPrint = ({ build, children }: { build?: boolean; children: ComponentChildren }) => <p class="tkc-settings__print" data-part="group-print" data-build={build ? '' : undefined}>{children}</p>;
/** The Privacy page's panel: plain lines in one grouped panel (foundations `privacy-line`, 1281). */
export const SettingsLines = ({ label, lines }: { label: string; lines: string[] }) => <div class="tkc-settings__panel" role="group" aria-label={label} data-part="panel" data-kind="privacy">{lines.map((l) => <p key={l} data-part="privacy-line">{l}</p>)}</div>;
/** Quiet links under a sheet's choices (a stack, left-aligned). */
export const SheetLinks = ({ children }: { children: ComponentChildren }) => <div class="tkc-settings__links" data-part="links">{children}</div>;
export type { Place };
