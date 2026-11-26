// TKC-012 ChoiceRow, spec 0.3: one of a few choices, shown whole (name, a plain line, an optional sample), so she can pick by seeing the difference.
import { Icon } from '../icon';
import { Tag } from '../TKC-017-Tag/Tag';
import './choicerow.css';
export interface ChoiceRowProps { name: string; line?: string; sample?: string; reference?: string; tag?: string; /** Text Size: the name is set at this size (px), whatever the app's text size is; the ring centres on the row */ nameSize?: number; /** Settings rows: ring at the top, not centred on the first line */ ringTop?: boolean; kind?: 'full' | 'compact'; chosen?: boolean; show?: 'pressed' | 'focus'; onChoose?: () => void }
export function ChoiceRow({ name, line, sample, reference, tag, nameSize, ringTop, kind = 'full', chosen = false, show, onChoose }: ChoiceRowProps) {
  return <button type="button" role="radio" aria-checked={chosen} class={`tkc-choice${show ? ` is-${show}` : ''}`} data-tkc="TKC-012" data-kind={kind} data-sized={nameSize ? '' : undefined} data-ring-top={ringTop ? '' : undefined} style={nameSize ? { '--ns': `${nameSize}px` } : undefined} onClick={onChoose}
    aria-label={[tag ? `${name}, ${tag.toLowerCase()}` : name, line, sample && reference ? `${reference}: ${sample}` : undefined].filter(Boolean).join('. ')}>
    <span class="tkc-choice__text">
      <b class="tkc-choice__name" data-part="name"><span class="tkc-choice__nm">{name}</span>{tag ? <Tag label={tag} /> : null}</b>
      {line ? <span class="tkc-choice__line" data-part="line">{line}</span> : null}
      {sample ? <span class="tkc-choice__sample" data-part="sample">{sample}</span> : null}
      {sample && reference ? <span class="tkc-choice__ref" data-part="ref">{reference}</span> : null}</span>
    <span class="tkc-choice__ring" data-part="ring" aria-hidden="true">{chosen ? <Icon n="check" size="14px" /> : null}</span></button>;
}
