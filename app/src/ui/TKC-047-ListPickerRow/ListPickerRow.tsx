// TKC-047 ListPickerRow 0.2: which list a person goes on, with one tap to change it. The chooser behind Change is TKC-004's pick-one sheet.
import { TextLink } from '../TKC-007-TextLink/TextLink';
import './listpickerrow.css';
export interface ListPickerRowProps { name: string; /** "[Night]s · [who line]" (1018) */ line: string; show?: 'pressed' | 'focus'; onChange?: () => void }
export function ListPickerRow({ name, line, show, onChange }: ListPickerRowProps) {
  return <div class="tkc-lpick" data-tkc="TKC-047" role="group" aria-label={`List: ${name}, ${line}`}>
    <span class="tkc-lpick__t"><b data-part="name">{name}</b><span data-part="line">{line}</span></span>
    <TextLink label="Change" aria="Change the list" show={show} onOpen={onChange} />
  </div>;
}
