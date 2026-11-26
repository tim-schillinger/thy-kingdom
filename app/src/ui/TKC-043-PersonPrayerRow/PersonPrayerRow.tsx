// TKC-043 PersonPrayerRow 0.4 (3-6c: the edit icon, the square and pencil, replaces ⋯; the last row has no hairline), 0.3 (no "Added tonight" tag, frame-lock-6 §5, 1764): one person (or request) she prays for tonight: name and ⋯, the request full size, three toggle pills (Provide, Forgive, Protect).
// Any chosen pill = prayed for. Past day: pills live. Read ahead: no pills. `PersonList` is the plain list "[List name] tonight".
import { Icon } from '../icon';
import { Chip } from '../TKC-008-Chip/Chip';
import './personprayerrow.css';
export const ASKS = ['Provide', 'Forgive', 'Protect'] as const;
export type Ask = typeof ASKS[number];
export interface PersonPrayerRowProps { /** keys the row and tells it apart from another with the same name */ id?: string; name: string; request?: string; asks?: Ask[]; ahead?: boolean; showMore?: 'pressed' | 'focus'; showAsk?: { ask: Ask; state: 'pressed' | 'focus' }; onAsk?: (a: Ask) => void; onMore?: () => void }
export function PersonPrayerRow({ id: _id, name, request, asks = [], ahead, showMore, showAsk, onAsk, onMore }: PersonPrayerRowProps) {
  return <div class="tkc-pp" data-tkc="TKC-043" role="group" aria-label={request ? `${name}. ${request}.` : `${name}.`}>
    <div class="tkc-pp__nm" data-part="name-line"><b data-part="name">{name}</b>
      <button type="button" class={`tkc-pp__more${showMore ? ` is-${showMore}` : ''}`} data-part="more" aria-label={`Manage ${name}`} onClick={onMore}><Icon n="notePencil" size="22px" /></button></div>
    {request ? <p class="tkc-pp__req" data-part="request">{request}</p> : null}
    {!ahead && <div class="tkc-pp__pch" data-part="pills" role="group" aria-label={`What you ask God for ${name}`}>
      {ASKS.map((a) => <Chip key={a} kind="toggle" label={a} chosen={asks.includes(a)} show={showAsk?.ask === a ? showAsk.state : undefined} onTap={() => onAsk?.(a)} />)}</div>}
  </div>;
}
export function PersonList({ label, rows }: { label: string; rows: PersonPrayerRowProps[] }) {
  return <ul class="tkc-pl" aria-label={label}>{rows.map((r) => <li key={r.id ?? r.name} data-person={r.id}><PersonPrayerRow {...r} /></li>)}</ul>;
}
