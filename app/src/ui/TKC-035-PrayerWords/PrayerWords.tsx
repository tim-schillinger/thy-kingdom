// TKC-035 PrayerWords 0.3: words she can pray as written. One verse (a short prayer to pray) and the Prayer part's own lines: aim, move,
// lead-in and starter. The anchor is TKC-052's. `part` composes them in order: anchor · aim · move · lead-in · starter.
import type { ComponentChildren } from 'preact';
import './prayerwords.css';
export interface PrayerWordsProps {
  kind: 'verse' | 'meaning' | 'aim' | 'move' | 'leadin' | 'starter' | 'part';
  text?: string; /** verse kind: one plain line of meaning under the source line (574) */ meaning?: string; /** Part 1's aim is smaller, because "Pray for Others" sits above it (TKC-030) */ first?: boolean;
  /** part: the five lines, and anything the part holds (her nations or people) between the aim and the move */
  anchor?: ComponentChildren; aim?: string; move?: string; leadin?: string; starter?: string; content?: ComponentChildren;
}
export function PrayerWords(p: PrayerWordsProps) {
  const { kind } = p;
  if (kind === 'verse') return <p class="tkc-pw" data-tkc="TKC-035" data-kind="verse">{p.text}</p>;
  if (kind === 'meaning') return <p class="tkc-pw-meaning" data-tkc="TKC-035" data-kind="meaning" data-part="meaning">{p.text}</p>;
  if (kind === 'aim') return <h3 class={`tkc-pw-aim${p.first ? ' is-first' : ''}`} data-tkc="TKC-035" data-kind="aim">{p.text}</h3>;
  if (kind === 'move') return <p class="tkc-pw-move" data-tkc="TKC-035" data-kind="move">{p.text}</p>;
  if (kind === 'leadin') return <p class="tkc-pw-leadin" data-tkc="TKC-035" data-kind="leadin">{p.text}</p>;
  if (kind === 'starter') return <p class="tkc-pw-starter" data-tkc="TKC-035" data-kind="starter">{p.text}</p>;
  return <div class="tkc-pw-part">{p.anchor}
    {p.aim && <PrayerWords kind="aim" text={p.aim} first={p.first} />}{p.content}
    {p.move && <PrayerWords kind="move" text={p.move} />}
    {p.leadin && <PrayerWords kind="leadin" text={p.leadin} />}{p.starter && <PrayerWords kind="starter" text={p.starter} />}</div>;
}
