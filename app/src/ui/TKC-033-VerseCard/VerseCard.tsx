// TKC-033 VerseCard, spec 0.1.4: one short verse to carry, softly tinted. No verse this week → no card (727).
import { SourceLine } from '../TKC-031-SourceLine/SourceLine';
import './versecard.css';
export interface VerseCardProps { label?: string; verse: string; reference: string; /** none in a sample (Text Size, TKC-004 0.6): the line is the reference alone */ translation?: string; onTranslation?: () => void; /** Memorize only: "Change" ends the source line */ change?: boolean; onChange?: () => void }
export function VerseCard({ label, verse, reference, translation, onTranslation, change, onChange }: VerseCardProps) {
  return <div class="tkc-vc" data-tkc="TKC-033" role="group" aria-label={label ?? reference}>
    {label && <p class="tkc-vc__lab ty-label" data-part="lab">{label}</p>}
    <p class="tkc-vc__verse ty-reading-verse" data-part="verse">{verse}</p>
    <SourceLine reference={reference} translation={translation} onTranslation={onTranslation} onChange={change ? (onChange ?? (() => {})) : undefined} />
  </div>;
}
