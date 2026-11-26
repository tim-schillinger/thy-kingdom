// TKC-057 OpenDayRow 0.1: one open day (or all of them, on Progress) as a bordered row that plainly looks tappable (spec C, D).
import { Icon } from '../icon';
import './opendayrow.css';
export interface OpenDayRowProps {
  /** day: "Thu, Oct 1" and what is left. summary: "3 days still open" and, when finishing would join streaks, the second line. */
  kind?: 'day' | 'summary';
  title: string; line?: string; spoken?: string;
  /** select: the checkbox stands where the chevron was (1153). */
  mode?: 'browse' | 'select'; checked?: boolean;
  show?: 'pressed' | 'focus'; onPress?: () => void;
}
export function OpenDayRow({ kind = 'day', title, line, spoken, mode = 'browse', checked = false, show, onPress }: OpenDayRowProps) {
  const sel = mode === 'select';
  return <button type="button" class={`tkc-od${show ? ` is-${show}` : ''}`} data-tkc="TKC-057" data-kind={kind} data-mode={mode}
    role={sel ? 'checkbox' : undefined} aria-checked={sel ? checked : undefined} aria-label={spoken ?? (line ? `${title}. ${line}` : title)} onClick={onPress}>
    {sel ? <span class="tkc-od__cb" data-part="checkbox" aria-hidden="true">{checked ? <Icon n="check" size="16px" /> : null}</span> : null}
    <span class="tkc-od__t" data-part="text"><b data-part="title">{title}</b>{line ? <span data-part="line">{line}</span> : null}</span>
    {sel ? null : <span class="tkc-od__cv" data-part="chevron" aria-hidden="true"><Icon n="caretRight" size="18px" /></span>}
  </button>;
}
