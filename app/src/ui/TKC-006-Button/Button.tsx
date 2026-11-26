// TKC-006 Button, spec 0.6 (0.9 adds place list-sort). One code component per registry id (build-standards §5.4).
import type { ComponentChildren } from 'preact';
import Plus from '@phosphor-icons/core/assets/regular/plus.svg?raw';
import { Icon } from '../icon';
import './button.css';

export type ButtonKind = 'primary' | 'secondary' | 'quiet' | 'outline' | 'small-outline' | 'small-secondary';
const ICONS = { plus: Plus } as const;

export interface ButtonProps {
  label: string;
  kind?: ButtonKind;
  /** Full or fit width. Defaults: primary, secondary and outline full; the rest fit (spec D). */
  width?: 'full' | 'fit';
  /** The second line (primary only): "Next: Sing", "Complete Day". */
  sub?: string;
  /** 0.7 (TKC-003): a 20 px arrow after the label, 8 px apart (the primary names where it goes). */
  arrow?: boolean;
  /** A leading Phosphor Regular icon, 20 px. */
  icon?: keyof typeof ICONS;
  /** A place another spec owns: TKC-003's bar, a form sheet's header (Cancel at Regular), the People list head ("+ Add Person", plain text, 0.8), or a Lists page's sort row (0.9, frame-lock-10). */
  place?: 'actionbar' | 'sheet-header' | 'list-head' | 'list-sort';
  /** Library and tests only: show a state without touching the button. */
  show?: 'pressed' | 'focus';
  /** TKC-003 0.9 (C4): which button of the bar this is, so a stacked bar can put Back at the left edge and Skip at the right. */
  which?: 'back' | 'skip';
  /** 0.8 (3170): drawn but not pressable, not focusable, announced as unavailable. The one use: "Read More in the Guide" until the Guide exists. */
  disabled?: boolean;
  onClick?: () => void;
  children?: ComponentChildren;
}

export function Button({ label, kind = 'primary', width, sub, icon, arrow, place, show, which, disabled, onClick }: ButtonProps) {
  const w = width ?? (kind === 'primary' || kind === 'secondary' || kind === 'outline' ? 'full' : 'fit');
  return (
    <button type="button" class={`tkc-btn${show ? ` is-${show}` : ''}`} data-tkc="TKC-006" data-kind={kind} data-width={w}
      data-place={place} data-which={which} data-arrow={arrow ? '' : undefined} data-sub={sub ? '' : undefined} aria-label={sub ? `${label}, ${sub}` : undefined} disabled={disabled} onClick={onClick}>
      {icon && <span class="tkc-btn__icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[icon] }} />}
      <span class="tkc-btn__label" data-part="label">{label}</span>
      {arrow && <span class="tkc-btn__arrow" data-part="arrow" aria-hidden="true"><Icon n="arrowRight" size="calc(20px*var(--ts))" /></span>}
      {sub && <span class="tkc-btn__sub" data-part="sub">{sub}</span>}
    </button>
  );
}
