// TKC-024 HeroCard, spec 0.3: the day's one main action. Two taps inside: "See Steps" and the primary (730).
import { Button } from '../TKC-006-Button/Button';
import './herocard.css';
export interface HeroCardProps {
  walk: 'Morning Walk' | 'Evening Walk';
  /** Today only: "First hour of your day" / "Last hour of your day" (717). Left out on a past or future day (715). */
  time?: string;
  /** Before the walk starts only (714). */
  purpose?: string;
  /** "0 of 7 done"; left out when reading ahead (715, 731). */
  count?: string;
  button: string;
  next?: string;
  show?: { which: 'see' | 'button'; state: 'pressed' | 'focus' };
  onSteps?: () => void; onGo?: () => void;
}
export function HeroCard({ walk, time, purpose, count, button, next, show, onSteps, onGo }: HeroCardProps) {
  const see = <a href="#steps" class={`tkc-hero__see${show?.which === 'see' ? ` is-${show.state}` : ''}`} data-part="see" aria-label={`See the 7 steps of the ${walk}`}
    onClick={(e) => { e.preventDefault(); onSteps?.(); }}>See Steps</a>;
  return <section class="tkc-hero" data-tkc="TKC-024" aria-label={[walk, time?.toLowerCase(), count].filter(Boolean).join(', ')}>
    {time && <p class="tkc-hero__lab ty-label" data-part="lab">{time}</p>}
    <h2 class="tkc-hero__name ty-display-m" data-part="name">{walk}</h2>
    {purpose && <p class="tkc-hero__purpose ty-body" data-part="purpose">{purpose}</p>}
    <p class="tkc-hero__count ty-body-small" data-part="count">{count ? <>{count} · {see}</> : see}</p>
    <Button kind="primary" label={button} sub={next} show={show?.which === 'button' ? show.state : undefined} onClick={onGo} />
  </section>;
}
