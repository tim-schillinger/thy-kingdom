// TKC-020 InlineNotice, spec 0.1: a plain line right where she's typing, with one way forward.
import { Button } from '../TKC-006-Button/Button';
import './inlinenotice.css';
export interface InlineNoticeProps { name: string; list: string; onPray?: () => void }
export function InlineNotice({ name, list, onPray }: InlineNoticeProps) {
  return <div class="tkc-notice" data-tkc="TKC-020"><p data-part="text">{name} is already on your {list} list.</p>
    <div class="tkc-notice__btn" data-part="button"><Button kind="secondary" label={`Pray for ${name} Tonight`} onClick={onPray} /></div></div>;
}
