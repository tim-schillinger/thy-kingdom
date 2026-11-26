// TKC-016 InfoRow, spec 0.3: one fact as a label and its value (a term and its description). The list around it (hairline above the first row, margin-page sides) is the screen's.
/** fact: the nation page (the first line of a long value lines up with the label's baseline). person: the person page and record, centred in the row. guide: Start Here and Your Whole Year lines: label over value, both left-aligned, the value on the row's whole width. */
export interface InfoRowProps { label: string; value: string; kind?: 'fact' | 'person' | 'guide' }
import './inforow.css';
export function InfoRow({ label, value, kind = 'fact' }: InfoRowProps) {
  return <dl class="tkc-info" data-tkc="TKC-016" data-kind={kind}><dt data-part="label">{label}</dt><dd data-part="value">{value}</dd></dl>;
}
