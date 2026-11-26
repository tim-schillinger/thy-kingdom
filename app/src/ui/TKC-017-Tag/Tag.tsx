// TKC-017 Tag, spec 0.2: one or two quiet words beside a name. Not interactive (spec E), never a button.
import './tag.css';
export interface TagProps { label: string }
export function Tag({ label }: TagProps) { return <span class="tkc-tag" data-tkc="TKC-017">{label}</span>; }
