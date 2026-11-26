// TKC-027 ComingUp, spec 0.5 (the Evening row left Today, 3427), 0.3: information only (469). Rows aren't tappable; "About This Step ›" on each row (1007) opens Your Whole Year.
import { useState } from 'preact/hooks';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import './comingup.css';
export interface Moment { title: string; when: string; /** extra proverbs only: "Not This Month" (724) */ notThisMonth?: boolean; /** Frame Studio 3: the Evening row's Change link */ onChange?: () => void }
export interface ComingUpProps { rows: Moment[]; /** library and tests: start with Show More opened */ expanded?: boolean; show?: { i: number; state: 'pressed' | 'focus' }; onInfo?: (m: Moment) => void; onNotThisMonth?: () => void }
export function ComingUp({ rows, expanded = false, show, onInfo, onNotThisMonth }: ComingUpProps) {
  const [more, setMore] = useState(expanded);
  if (!rows.length) return null;
  const shown = more ? rows : rows.slice(0, 3);
  return <section class="tkc-cu" data-tkc="TKC-027">
    <h2 class="tkc-cu__label ty-label" data-part="label">Coming Up</h2>
    <ul class="tkc-cu__list">{shown.map((m, i) => <li class="tkc-cu__row" data-part="row" key={m.title + m.when}>
      <div class="tkc-cu__text"><b class="ty-body-strong" data-part="title">{m.title}</b><span class="ty-body-small" data-part="when">{m.when}{m.onChange && <> <TextLink label="Change" aria={`Change when your evening starts`} onOpen={m.onChange} /></>}</span>
        {m.notThisMonth && <a href="#" class="tkc-cu__link ty-body-small" onClick={(e) => { e.preventDefault(); onNotThisMonth?.(); }}>Not This Month</a>}
        <span class="tkc-cu__why" data-part="why"><TextLink kind="why" aria={`About This Step, ${m.title}`} show={show?.i === i ? show.state : undefined} onOpen={() => onInfo?.(m)} /></span></div>
    </li>)}</ul>
    {rows.length > 3 && <a href="#" class="tkc-cu__link ty-body-small" onClick={(e) => { e.preventDefault(); setMore(!more); }}>{more ? 'Show Less' : 'Show More'}</a>}
  </section>;
}
