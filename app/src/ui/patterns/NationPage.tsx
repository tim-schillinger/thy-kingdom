// Nation page (registry §2, locked 968, States approved 979; 1343): TopBar page ("‹ Prayer") · LocatorMap large · name (display-l) · InfoRow fact × the facts we have ·
// VerseCard, no label (Revelation 7:9) · SourceLine data "Facts from Wikidata". No foot: ‹ Prayer returns to Kingdom, same scroll.
// Layout only. The screen supplies the words. A fact we don't have is left out, never "Unknown" (TKC-016 E).
import type { ComponentChildren } from 'preact';
import { TopBar } from '../TKC-002-TopBar/TopBar';
import { LocatorMap, type LocatorMapProps } from '../TKC-042-LocatorMap/LocatorMap';
import { InfoRow } from '../TKC-016-InfoRow/InfoRow';
import { VerseCard, type VerseCardProps } from '../TKC-033-VerseCard/VerseCard';
import { SourceLine } from '../TKC-031-SourceLine/SourceLine';
import './screen.css';
import './nationpage.css';

export interface NationPageViewProps {
  name: string; back: string; onBack: () => void;
  mapLabel: string; at?: LocatorMapProps['at'];
  facts: Array<{ label: string; value: string }>;
  verse?: Omit<VerseCardProps, 'label'>;
  /** The facts' source line ("Facts from Wikidata"); left out when there are no facts. */
  source?: string;
  overlay?: ComponentChildren;
}
export function NationPageView(p: NationPageViewProps) {
  return <div class="tkc-screen tkc-np" data-wash="dusk" data-screen="nation">
    <TopBar variant="page" label={p.back} onClose={p.onBack} />
    <main class="tkc-np__main">
      <div class="tkc-np__map" data-part="map"><LocatorMap size="large" at={p.at} label={p.mapLabel} /></div>
      <h1 class="ty-display-l tkc-np__h" data-part="heading">{p.name}</h1>
      {p.facts.length > 0 && <div class="tkc-np__facts" data-part="facts">{p.facts.map((f) => <InfoRow key={f.label} label={f.label} value={f.value} />)}</div>}
      {p.verse && <div class="tkc-np__verse" data-part="verse"><VerseCard {...p.verse} /></div>}
      {p.source && <div class="tkc-np__src" data-part="source"><SourceLine segments={[p.source]} /></div>}
      <div class="tkc-np__end" aria-hidden="true" />
    </main>
    {p.overlay}
  </div>;
}
