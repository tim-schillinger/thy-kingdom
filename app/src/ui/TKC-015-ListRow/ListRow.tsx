// TKC-015 ListRow, spec 0.5. Built so far: the numbered step row (Still Open), the setting row and the source row (Settings).
// Chat 3b adds the list row, person row and search-result row (0.2, 0.3). The Guide rows come with their screens.
import { useLayoutEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { Icon, type IconName } from '../icon';
import { Tag } from '../TKC-017-Tag/Tag';
import { WinMark } from '../TKC-022-WinMark/WinMark';
import './listrow.css';
export interface ListRowProps {
  kind?: 'step' | 'setting' | 'source' | 'list' | 'person' | 'search' | 'lesson' | 'guide' | 'done'; name: string;
  /** step row: the step's own number (1–7, never renumbered) */ n?: number; icon?: IconName; sub?: string; value?: string; chevron?: boolean;
  /** source row */ sourceKind?: string; edition?: string;
  /** Guide rows (0.4): the lesson row's number is the step's own; lesson and guide rows carry a line; the done row says "Read Again" */ guideLine?: string; readAgain?: string;
  /** a switch takes the chevron's place (TKC-009) */ children?: ComponentChildren; role?: 'switch'; checked?: boolean; /** the id this row answers to when another component is built on it (TKC-009) */ tkc?: string;
  /** list row: "Wednesdays · People with a say over your life", "4 people", and the Tonight tag on tonight's list */ line?: string; meta?: string; tonight?: boolean;
  /** person and search rows: what she asked (none for Tom), the letters search matched in it, and the list it lives on (search) */ request?: string; match?: string; where?: string; /** search: an answered prayer, with its mini hands mark */ answered?: boolean;
  show?: 'pressed' | 'focus'; onClick?: () => void;
  /** Library and tests only: a name a walk can find this row by (data-hook) */ hook?: string;
}
/** Search: the letters she typed show SemiBold wherever they fall in the request (not in a name, which is already SemiBold: 1117). */
function hit(text: string, match?: string) {
  if (!match) return text; const q = match.toLowerCase(); const out: ComponentChildren[] = []; let i = 0;
  for (let at = text.toLowerCase().indexOf(q); at >= 0; at = text.toLowerCase().indexOf(q, i)) { if (at > i) out.push(text.slice(i, at)); out.push(<span class="tkc-hit" data-part="hit">{text.slice(at, at + q.length)}</span>); i = at + q.length; }
  if (i < text.length) out.push(text.slice(i)); return out;
}
/** The list the rows sit in: a hairline above the first row (Lists · Praying For, each list page, search results). */
export function RowList({ label, children }: { label: string; children: ComponentChildren }) { return <ul class="tkc-lrs" aria-label={label}>{children}</ul>; }
/** When the name and the value won't fit one line, the value drops under the name, left-aligned (Builder's call, spec K). */
function useDrop(ref: { current: HTMLButtonElement | null }, deps: unknown[]) {
  useLayoutEffect(() => {
    const row = ref.current; if (!row) return;
    const run = () => {
      row.removeAttribute('data-drop');
      const vl = row.querySelector<HTMLElement>('[data-part="value"]'), nm = row.querySelector<HTMLElement>('[data-part="name"]'), ic = row.querySelector<HTMLElement>('[data-part="icon"]'), ch = row.querySelector<HTMLElement>('[data-part="chevron"]');
      if (!vl || !nm) return;
      const cs = getComputedStyle(row);
      const avail = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - (ic ? ic.offsetWidth + 12 : 0) - (ch ? ch.getBoundingClientRect().width + 12 : 0);
      const w = [nm.style.whiteSpace, vl.style.whiteSpace]; nm.style.whiteSpace = 'nowrap'; vl.style.whiteSpace = 'nowrap';
      const need = nm.scrollWidth + 12 + vl.scrollWidth; nm.style.whiteSpace = w[0]; vl.style.whiteSpace = w[1];
      if (need > avail + 0.5) row.setAttribute('data-drop', '');
    };
    run(); const ro = new ResizeObserver(run); ro.observe(row); return () => ro.disconnect();
  }, deps);
}
export function ListRow({ kind = 'setting', n, line, meta, tonight, request, match, where, answered, name, guideLine, readAgain, icon, sub, value, chevron, sourceKind, edition, children, role, checked, tkc, show, hook, onClick }: ListRowProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useDrop(ref, [name, value, sub, kind]);
  if (kind === 'step') return <a href="#step" class={`tkc-row-step${show ? ` is-${show}` : ''}`} data-tkc="TKC-015" data-kind="step" aria-label={`Step ${n}, ${name}`} onClick={(e) => { e.preventDefault(); onClick?.(); }}>
    <span class="tkc-row-step__no" data-part="num" aria-hidden="true">{n}</span><span class="tkc-row-step__nm" data-part="name">{name}</span><span class="tkc-row-step__cv" data-part="chevron" aria-hidden="true"><Icon n="caretRight" size="100%" /></span></a>;
  if (kind === 'lesson' || kind === 'guide' || kind === 'done') return <button type="button" class={`tkc-gr${show ? ` is-${show}` : ''}`} data-tkc="TKC-015" data-kind={kind} aria-label={kind === 'lesson' ? `Step ${n}, ${name}. ${guideLine}` : kind === 'done' ? `${name}, ${guideLine}, read. Read again` : guideLine ? `${name}, ${guideLine}` : name} onClick={onClick}>
    {kind === 'lesson' ? <span class="tkc-gr__num" data-part="num" aria-hidden="true">{n}</span> : null}
    {kind === 'done' ? <span class="tkc-gr__disc" data-part="disc" aria-hidden="true"><Icon n="checkReg" size="16px" /></span> : null}
    <span class="tkc-gr__t" data-part="text"><b data-part="name">{name}</b>{guideLine ? <span class="tkc-gr__ln" data-part="line">{guideLine}</span> : null}</span>
    {kind === 'done' ? <span class="tkc-gr__ct" data-part="meta">{readAgain ?? 'Read Again'}</span> : null}
    <span class="tkc-gr__ch" data-part="chevron" aria-hidden="true"><Icon n="caretRight" size="100%" /></span>
  </button>;
  if (kind === 'list' || kind === 'person' || kind === 'search') {
    const nm = <span class="tkc-wrapname" data-part="name">{name}</span>;
    const lbl = kind === 'list' ? `${name}${tonight ? ', tonight' : ''}. ${line}. ${meta}.` : `${name}.${request ? ' ' + request + '.' : ''}${where ? ' ' + where + '.' : ''}`;
    return <button type="button" class={`tkc-lr${show ? ` is-${show}` : ''}`} data-tkc="TKC-015" data-kind={kind} aria-label={lbl} onClick={onClick}>
      {kind === 'list'
        ? <span class="tkc-lr__body"><span class="tkc-lr__title">{nm}{tonight ? <Tag label="Tonight" /> : null}</span><span class="tkc-lr__line" data-part="listline">{line}</span><span class="tkc-lr__meta" data-part="meta">{meta}</span></span>
        : <span class="tkc-lr__txt"><span class="tkc-lr__name">{nm}</span>{request ? <span class="tkc-lr__req" data-part="request">{hit(request, match)}</span> : null}
          {where ? <span class="tkc-lr__where" data-part="where">{answered ? <WinMark size="mini" glyph="hands" /> : null}<span>{where}</span></span> : null}</span>}
      <span class="tkc-lr__ch" data-part="chevron" aria-hidden="true"><Icon n="caretRight" size="100%" /></span>
    </button>;
  }
  const cls = `tkc-row${show ? ` is-${show}` : ''}`;
  return <button ref={ref} type="button" class={cls} data-tkc={tkc ?? 'TKC-015'} data-kind={tkc ? undefined : kind} data-hook={hook} data-on={role === 'switch' && checked ? '' : undefined} role={role} aria-checked={role === 'switch' ? !!checked : undefined} onClick={onClick}>
    {icon ? <span class="tkc-row__ic" data-part="icon"><Icon n={icon} size="24px" /></span> : null}
    {kind === 'source'
      ? <span class="tkc-row__nm"><span data-part="kind">{sourceKind}</span><b data-part="name">{name}</b>{edition ? <span data-part="edition">{edition}</span> : null}</span>
      : <span class="tkc-row__nm"><b data-part="name">{name}</b>{sub ? <span data-part="sub">{sub}</span> : null}</span>}
    {value ? <span class="tkc-row__vl" data-part="value">{value}</span> : null}
    {chevron ? <span class="tkc-row__ch" data-part="chevron"><Icon n="caretRight" size="16px" /></span> : null}
    {children}
  </button>;
}
