// First run, "Choose Your Bible" (registry §2 pattern; Settings Studio v2.2, locked 1304). Layout only: the heading, two
// TKC-012 ChoiceRows, two plain lines, and the foot (a line, TKC-006 primary, TKC-007 under a primary). The screen supplies the words and the actions.
import type { ComponentChildren } from 'preact';
import { ChoiceRow, type ChoiceRowProps } from '../TKC-012-ChoiceRow/ChoiceRow';
import { Button } from '../TKC-006-Button/Button';
import { TextLink } from '../TKC-007-TextLink/TextLink';
import './screen.css';
import './firstrun.css';

export interface FirstRunViewProps {
  heading: string;
  choices: Array<ChoiceRowProps & { key: string }>;
  lines: [string, string];
  foot: string;
  start: string; onStart: () => void;
  restore: string; onRestore: () => void;
  /** A notice or a sheet that belongs to the screen (the restore error, the Replace confirm). */
  children?: ComponentChildren;
}
export function FirstRunView(p: FirstRunViewProps) {
  return <div class="tkc-screen tkc-fr" data-wash="plain" data-screen="firstrun">
    <main class="tkc-fr__main">
      <h1 class="ty-display-l" data-part="heading">{p.heading}</h1>
      <div class="tkc-fr__choices" role="radiogroup" aria-label="Bible">{p.choices.map(({ key, ...c }) => <ChoiceRow key={key} {...c} />)}</div>
      <p class="tkc-fr__line" data-part="line">{p.lines[0]}</p>
      <p class="tkc-fr__print" data-part="print">{p.lines[1]}</p>
    </main>
    <footer class="tkc-fr__foot">
      <p class="tkc-fr__keep" data-part="keep">{p.foot}</p>
      <Button kind="primary" label={p.start} onClick={p.onStart} />
      <TextLink kind="under-primary" label={p.restore} onOpen={p.onRestore} />
    </footer>
    {p.children}
  </div>;
}
