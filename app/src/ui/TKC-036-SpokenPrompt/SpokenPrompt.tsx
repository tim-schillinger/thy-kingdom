// TKC-036 SpokenPrompt 0.1.1: one sentence to say back to God, with a drawn blank. Nothing is typed or saved (IA 20).
// Atomic kinds so a screen can place them: sentence · helper · cues (a label and one link chip per reading). `prompt` is the composite.
import { Chip } from '../TKC-008-Chip/Chip';
import './spokenprompt.css';
export interface SpokenPromptProps {
  kind: 'sentence' | 'helper' | 'cues' | 'prompt';
  before?: string; after?: string; text?: string; label?: string; cues?: string[];
  /** A reading cue was tapped: the screen opens that reading again (the sheet is the screen's). */ onCue?: (cue: string) => void;
}
const BEFORE = 'I hear You about ', AFTER = '. I give myself to You, and to that, today.';
export const HELPER = 'Fill the blank with one thing that God put on your heart this morning.';
export function SpokenPrompt(p: SpokenPromptProps) {
  const { kind } = p;
  if (kind === 'sentence') return <p class="tkc-sp-say" data-tkc="TKC-036" data-kind="sentence">{p.before ?? BEFORE}<span class="tkc-sp-blank" data-part="blank" role="img" aria-label="blank" />{p.after ?? AFTER}</p>;
  if (kind === 'helper') return <p class="tkc-sp-help" data-tkc="TKC-036" data-kind="helper">{p.text ?? HELPER}</p>;
  if (kind === 'cues') return <div class="tkc-sp-cues" data-tkc="TKC-036" data-kind="cues" role="group" aria-label={p.label ?? 'Today’s readings'}>
    <span class="tkc-sp-lab" data-part="label">{p.label ?? 'Today’s readings'}</span>
    <div class="tkc-sp-chips" data-part="chips">{(p.cues ?? []).map((c) => <Chip key={c} kind="link" label={c} onTap={() => p.onCue?.(c)} />)}</div></div>;
  return <div class="tkc-sp-prompt"><SpokenPrompt kind="sentence" /><SpokenPrompt kind="helper" />{p.cues?.length ? <SpokenPrompt kind="cues" cues={p.cues} onCue={p.onCue} /> : null}</div>;
}
