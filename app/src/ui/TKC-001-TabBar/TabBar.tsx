// TKC-001 TabBar, spec 0.2.1: the four places. Current = filled icon, SemiBold label, ink (1044).
import { Icon, type IconName } from '../icon';
import './tabbar.css';
export type Place = 'Today' | 'Lists' | 'Guide' | 'Settings';
const TABS: Array<[Place, IconName, IconName]> = [['Today', 'house', 'houseFill'], ['Lists', 'hands', 'handsFill'], ['Guide', 'books', 'booksFill'], ['Settings', 'gear', 'gearFill']];
export interface TabBarProps { current: Place; show?: { tab: Place; state: 'pressed' | 'focus' }; onGo?: (p: Place) => void }
export function TabBar({ current, show, onGo }: TabBarProps) {
  return <nav class="tkc-tabs" data-tkc="TKC-001" aria-label="Main">
    {TABS.map(([p, ic, icf]) => <a key={p} href={`#${p.toLowerCase()}`} class={`tkc-tabs__tab ty-tabbar-label${show?.tab === p ? ` is-${show.state}` : ''}`} data-part="tab"
      aria-current={p === current ? 'page' : undefined} onClick={(e) => { if (onGo) { e.preventDefault(); onGo(p); } }}>
      <Icon n={p === current ? icf : ic} size="24px" /><span>{p}</span></a>)}
  </nav>;
}
