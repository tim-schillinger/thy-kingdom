// TKC-053 Tabs, spec 0.2: two to four views of one page, the open view marked by a bar and bold (never color alone).
import './tabs.css';
export interface TabItem { label: string; count?: number }
export interface TabsProps { tabs: TabItem[]; open: number; name?: string; show?: { i: number; state: 'pressed' | 'focus' }; onSelect?: (i: number) => void }
export function Tabs({ tabs, open, name = 'Lists view', show, onSelect }: TabsProps) {
  return <div class="tkc-tabview" role="tablist" aria-label={name} data-tkc="TKC-053">
    {tabs.map((t, i) => <button key={t.label} type="button" role="tab" data-part="tab" aria-selected={i === open ? 'true' : 'false'}
      class={show?.i === i ? `is-${show.state}` : undefined} aria-label={t.count ? `${t.label}, ${t.count}` : t.label} onClick={() => onSelect?.(i)}>
      {t.label}{t.count ? <span class="tkc-tabview-count" data-part="count" aria-hidden="true">{t.count}</span> : null}</button>)}
  </div>;
}
