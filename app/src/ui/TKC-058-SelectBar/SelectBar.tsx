// TKC-058 SelectBar 0.1: while choosing several open days, the two things she can do with them, in the tab bar's place (spec C).
import { Button } from '../TKC-006-Button/Button';
import './selectbar.css';
export interface SelectBarProps { picked?: number; onSkip?: () => void; onClear?: () => void }
export function SelectBar({ picked = 0, onSkip, onClear }: SelectBarProps) {
  const n = picked > 0 ? ` ${picked}` : '';
  return <div class="tkc-sb" data-tkc="TKC-058" role="toolbar" aria-label="Selected days">
    <div class="tkc-sb__b" data-part="skip"><Button label={`Skip${n}`} kind="primary" onClick={onSkip} /></div>
    <div class="tkc-sb__b" data-part="clear"><Button label={`Clear${n}`} kind="secondary" onClick={onClear} /></div>
  </div>;
}
