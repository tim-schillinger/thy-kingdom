// TKC-039 AskYourself 0.3: one honest look and one thing to do. A question as the biggest words under the heading, then the move
// ("If something comes to mind, …"). On Meditate the verse sits flat above the question. Need ideas is TKC-014's.
// Atomic kinds so a screen can place them: question · move · verse. `checkin` and `meditate` are the composites.
import type { ComponentChildren } from 'preact';
import './askyourself.css';
export interface AskYourselfProps {
  kind: 'question' | 'move' | 'verse' | 'own' | 'checkin' | 'meditate';
  text?: string; /** Meditate: the question sits 24 under the verse, not 14 under a line */ afterVerse?: boolean;
  /** composites */ anchor?: ComponentChildren; question?: string; ideas?: ComponentChildren; move?: string; verse?: string; /** TKC-038: a line in the verse's place ("My own") */ ownLine?: string; source?: ComponentChildren;
}
export function AskYourself(p: AskYourselfProps) {
  const { kind } = p;
  if (kind === 'question') return <p class={`tkc-ask-q${p.afterVerse ? ' is-after-verse' : ''}`} data-tkc="TKC-039" data-kind="question">{p.text}</p>;
  if (kind === 'move') return <p class="tkc-ask-act" data-tkc="TKC-039" data-kind="move">{p.text}</p>;
  if (kind === 'own') return <p class="tkc-ask-verse" data-tkc="TKC-038" data-part="own">{p.text}</p>;
  if (kind === 'verse') return <p class="tkc-ask-verse" data-tkc="TKC-039" data-kind="verse">{p.text}</p>;
  if (kind === 'checkin') return <div class="tkc-ask-set">{p.anchor}<AskYourself kind="question" text={p.question} />{p.ideas && <div class="tkc-ask-ideas">{p.ideas}</div>}<AskYourself kind="move" text={p.move} /></div>;
  return <div class="tkc-ask-set tkc-ask-set--meditate">{p.source}{p.ownLine ? <p class="tkc-ask-verse" data-tkc="TKC-038" data-part="own">{p.ownLine}</p> : <AskYourself kind="verse" text={p.verse} />}<AskYourself kind="question" text={p.question} afterVerse /><AskYourself kind="move" text={p.move} /></div>;
}
