// TKC-059 StartHereCard, spec 0.2: one optional thing, never the honey (1201). Today: Start Here and the backup reminder (edge, ✕, outline button).
// Guide place: the soft lift, no ✕, the page's one primary "Start". Home Screen kind (Settings): the lift, ✕, outline "Show Me How", no label.
import { Button } from '../TKC-006-Button/Button';
import { Icon } from '../icon';
import './starthere.css';
type Kind = 'start-here' | 'backup' | 'home-screen' | 'proverbs';
const COPY: Record<Kind, { lab?: string; title: string; line: string; button: string; x: string }> = {
  'start-here': { lab: 'New Here?', title: 'See How It Works', line: '5 short pages', button: 'Start Here', x: 'Close How It Works' },
  'home-screen': { title: 'Add to Your Home Screen', line: 'Safari can clear your lists and progress after a week away. On your Home Screen, they stay.', button: 'Show Me How', x: 'Hide this card' },
  backup: { title: 'Save Your Lists and Progress', line: 'They live only on this phone. A backup keeps them safe.', button: 'Save a Backup', x: 'Hide until the next reminder' },
  proverbs: { title: 'Proverbs Has 31 Chapters', line: '', button: '', x: 'Hide until next month' },   // TKC-037: the words come from the month (`text`)
};
export interface StartHereCardProps { kind?: Kind; /** TKC-037: this card's own words (Finish Proverbs). */ text?: { line: string; button: string }; /** Guide: the lift, no ✕, primary "Start" (Start Here only). */ place?: 'today' | 'guide' | 'settings'; /** The card mid-fade as it leaves (half way); motion itself is not built. */ half?: boolean; show?: { which: 'x' | 'button'; state: 'pressed' | 'focus' }; onGo?: () => void; onClose?: () => void }
export function StartHereCard({ kind = 'start-here', place = 'today', text, half, show, onGo, onClose }: StartHereCardProps) {
  const guide = place === 'guide' && kind === 'start-here';
  const c = guide ? { ...COPY['start-here'], lab: 'Start Here', title: 'How It Works', button: 'Start', x: '' } : { ...COPY[kind], ...(text ?? {}) };
  const raised = guide || kind === 'home-screen';
  return <section class="tkc-sh" data-tkc="TKC-059" data-kind={kind} data-place={guide ? 'guide' : place === 'settings' ? 'settings' : undefined} data-raised={raised ? '' : undefined} data-half={half ? '' : undefined} aria-label={c.title}>
    {c.lab && <p class="tkc-sh__lab ty-label" data-part="lab">{c.lab}</p>}
    <h2 class="tkc-sh__title ty-starthere-title" data-part="title">{c.title}</h2>
    <p class="tkc-sh__line ty-body" data-part="line">{c.line}</p>
    <Button kind={guide ? 'primary' : 'outline'} label={c.button} show={show?.which === 'button' ? show.state : undefined} onClick={onGo} />
    {guide ? null : <button type="button" class={`tkc-sh__x${show?.which === 'x' ? ` is-${show.state}` : ''}`} data-part="x" aria-label={c.x} onClick={onClose}><Icon n="x" size="22px" /></button>}
  </section>;
}
