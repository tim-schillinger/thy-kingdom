// TKC-049 AnswerCard 0.1.1: one answered prayer. List kind (Answered, a button): her answer, what she asked, the mini hands mark and when. Story kind (the record, not tappable): "Your prayer" and "How God answered".
import { Icon } from '../icon';
import { WinMark } from '../TKC-022-WinMark/WinMark';
import './answercard.css';
export interface AnswerCardProps {
  kind?: 'list' | 'story';
  /** her words, no quote marks (1031, 1043). List kind without one shows the ask where the answer goes. */
  answer?: string;
  /** list kind: "Linda · Her knee surgery" (a request alone on Saturday) */ asked?: string;
  /** list kind: "Answered Oct 14 · Neighbors" */ meta?: string;
  /** story kind: the person (none on Saturday) and the request */ name?: string; request?: string;
  show?: 'pressed' | 'focus'; onOpen?: () => void;
}
export function AnswerCard({ kind = 'list', answer, asked, meta, name, request, show, onOpen }: AnswerCardProps) {
  // 0.2 (Creator, Nov 17): two sections like the Walk's joined card (TKC-062): the tinted top half holds what she asked, the plain lower half her answer.
  if (kind === 'story') return <div class="tkc-ans-story" data-tkc="TKC-049" data-kind="story">
    <div class="tkc-ans-story__top" data-part="top">
      <p class="tkc-ans-story__l" data-part="label">Your prayer</p>
      {name ? <p class="tkc-ans-story__n" data-part="name">{name}</p> : null}
      <p class="tkc-ans-story__r" data-part="request">{request}</p></div>
    {answer ? <div class="tkc-ans-story__low" data-part="lower"><p class="tkc-ans-story__l" data-part="label">How God answered</p><p class="tkc-ans-story__a" data-part="answer">{answer}</p></div> : null}
  </div>;
  return <button type="button" class={`tkc-ans${answer ? '' : ' is-noa'}${show ? ` is-${show}` : ''}`} data-tkc="TKC-049" data-kind="list" aria-label={`${answer ?? asked}. ${answer ? asked + '. ' : ''}${meta}.`} onClick={onOpen}>
    <span class="tkc-ans__top" data-part="top"><span class="tkc-ans__q" data-part="asked">{asked}</span></span>
    <span class="tkc-ans__low" data-part="lower">
      {answer ? <span class="tkc-ans__a" data-part="answer">{answer}</span> : null}
      <span class="tkc-ans__m"><WinMark size="mini" glyph="hands" /><span data-part="meta">{meta}</span></span>
      <span class="tkc-ans__cv" data-part="chevron"><Icon n="caretRight" size="100%" /></span>
    </span>
  </button>;
}
