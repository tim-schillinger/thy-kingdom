// TKC-011 TextField, spec 0.2: a place to type a short thing (field kind), or a search (search kind). Drawn states are pictures; `edit` makes the field live for the screens' sheets (typing, the limit and the counter's trigger are the screen's job).
import type { ComponentChildren } from 'preact';
import { Icon } from '../icon';
import './textfield.css';
export interface TextFieldProps {
  kind?: 'field' | 'search'; label?: string; optional?: boolean; value?: string; placeholder?: string; focus?: boolean; counter?: string; message?: string;
  /** search kind: a clear button while there is text */ clearable?: boolean;
  /** search kind, live (Lists): a real input in the box. Typing calls onInput; ✕ calls onClear and focus stays in the field; Return closes the keyboard (TKC-011 E, I). */
  search?: { onInput: (v: string) => void; onClear: () => void; ariaLabel?: string; clearLabel?: string };
  /** field kind: another component's control in the box's place under the label (TKC-047's list row in a form) */ children?: ComponentChildren;
  /** field kind, live: a real input in the box (the screens' sheets). `lines` 1 is an input, 3 a box that grows to three lines then scrolls (D). The box looks the same as the drawn one. */
  edit?: { onInput: (v: string) => void; max?: number; lines?: 1 | 3; name?: string; autoFocus?: boolean; caps?: 'words' | 'sentences'; onEnter?: () => void; describedBy?: string; ariaLabel?: string };
}
/** "N left" shows only in the last 20 characters (the name field's last 10): 1034, 1045. */
export const leftLine = (len: number, max: number, from: number) => (max - len <= from ? `${max - len} left` : undefined);
export function TextField({ kind = 'field', label, optional, value, placeholder, focus, counter, message, clearable, children, edit, search }: TextFieldProps) {
  if (kind === 'search' && search) {
    const typing = !!value;
    return <div class={`tkc-search is-live${typing ? ' is-typing' : ''}`} data-tkc="TKC-011" data-kind="search" role="search" aria-label={search.ariaLabel ?? 'Search names and requests'}>
      <Icon n="search" size="calc(20px*var(--ts))" />
      <input class="tkc-search__in" type="text" inputMode="search" enterKeyHint="search" autoComplete="off" autoCapitalize="off" spellcheck={false} value={value ?? ''} placeholder={placeholder ?? 'Search names and requests'}
        aria-label={search.ariaLabel ?? 'Search names and requests'} onInput={(e) => search.onInput(e.currentTarget.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }} />
      {typing ? <button type="button" class="tkc-search__clr" aria-label={search.clearLabel ?? 'Clear search'} onMouseDown={(e) => e.preventDefault()} onClick={(e) => { search.onClear(); (e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement | null)?.focus(); }}><Icon n="x" size="18px" /></button> : null}</div>;
  }
  if (kind === 'search') {
    const typing = !!value;
    return <div class={`tkc-search${typing || focus ? ' is-typing' : ''}`} data-tkc="TKC-011" data-kind="search" role="search" aria-label="Search names and requests">
      <Icon n="search" size="calc(20px*var(--ts))" /><span class={`tkc-search__q${typing ? '' : ' is-ph'}`}>{typing ? value : (placeholder ?? 'Search names and requests')}</span>
      {typing && clearable ? <button type="button" class="tkc-search__clr" aria-label="Clear search"><Icon n="x" size="18px" /></button> : null}{focus && !typing ? <span class="tkc-field__caret" aria-hidden="true" /> : null}</div>;
  }
  if (edit) {
    const id = `tkc-f-${edit.name ?? label ?? 'x'}`.replace(/\W+/g, '-');
    const grow = (el: HTMLTextAreaElement) => { el.style.height = 'auto'; el.style.height = `${el.scrollHeight}px`; };
    const common = { id, class: 'tkc-field__in', value: value ?? '', maxLength: edit.max, autoFocus: edit.autoFocus, 'aria-describedby': edit.describedBy, 'aria-label': label ? undefined : edit.ariaLabel,
      autoCapitalize: (edit.caps === 'words' ? 'words' : 'sentences') as 'words' | 'sentences', autoComplete: 'off', enterKeyHint: (edit.onEnter ? 'next' : undefined) as 'next' | undefined };
    return <div class="tkc-field" data-tkc="TKC-011" data-kind="field">
      {label ? <label class="tkc-field__label" data-part="label" for={id}>{label}{optional ? <> <span>Optional</span></> : null}</label> : null}
      <div class={`tkc-field__box is-live${label ? '' : ' no-label'}`} data-part="box">
        {edit.lines === 3
          ? <textarea {...common} rows={1} ref={(el) => { if (el) grow(el); }} onInput={(e) => { grow(e.currentTarget); edit.onInput(e.currentTarget.value); }} />
          : <input {...common} type="text" onInput={(e) => edit.onInput(e.currentTarget.value)} onKeyDown={(e) => { if (e.key === 'Enter' && edit.onEnter) { e.preventDefault(); edit.onEnter(); } }} />}
      </div>
      {counter ? <p class="tkc-field__counter" data-part="count" aria-live="polite">{counter}</p> : null}{message ? <p class="tkc-field__message" id={edit.describedBy} role="status" data-part="message">{message}</p> : null}</div>;
  }
  return <div class="tkc-field" data-tkc="TKC-011" data-kind="field">
    {label ? <p class="tkc-field__label" data-part="label">{label}{optional ? <> <span>Optional</span></> : null}</p> : null}
    {children ? <div class="tkc-field__slot">{children}</div> : <div class={`tkc-field__box${label ? '' : ' no-label'}${focus ? ' is-focus' : ''}`} data-part="box">{value ? value : <span class="ph">{placeholder}</span>}{focus ? <span class="tkc-field__caret" aria-hidden="true" /> : null}</div>}
    {counter ? <p class="tkc-field__counter" data-part="count">{counter}</p> : null}{message ? <p class="tkc-field__message" data-part="message">{message}</p> : null}</div>;
}
