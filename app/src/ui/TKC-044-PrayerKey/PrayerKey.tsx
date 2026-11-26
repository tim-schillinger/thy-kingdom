// TKC-044 PrayerKey 0.2 (frame-lock-6 §5, 1814): the count line under the Prayer aim, "Tonight, pray for 3 neighbors and select what you ask God for.",
// then "Learn More ›" in the shared link style (TKC-007 more). The link opens the Learn More sheet (TKC-004 read). The meanings no longer open in place:
// their text, and the prayer's lines, sit in the sheet.
import { TextLink } from '../TKC-007-TextLink/TextLink';
import { PEOPLE_MORE } from '../../copy';
import './prayerkey.css';
export interface PrayerKeyProps { /** The count line, from `peopleCountLine` */ text: string; show?: 'pressed' | 'focus'; onOpen?: () => void }
export function PrayerKey({ text, show, onOpen }: PrayerKeyProps) {
  return <div class="tkc-pk__sel" data-tkc="TKC-044" data-kind="line"><p data-part="count">{text}</p>
    <TextLink kind="more" label={PEOPLE_MORE} aria={`${PEOPLE_MORE}. Why tonight’s number, and what to ask God for`} show={show} onOpen={onOpen} /></div>;
}
