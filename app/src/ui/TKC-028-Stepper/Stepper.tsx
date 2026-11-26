// TKC-028 Stepper 0.2, static kind: a short numbered sequence to read once, not to tap (318). Prayer intro (five parts),
// the Add to Home Screen sheet and the Guide's ways (two to four steps). A step may carry one small secondary button
// under its line (1301), and its name may hold the ••• glyph, named "More" for the screen reader.
import { Button } from '../TKC-006-Button/Button';
import './stepper.css';
export interface StepperStep { name: string; line: string; button?: string; /** Library and checker: pins the step's button to a state */ buttonShow?: 'pressed' | 'focus'; /** What the step's small button does (the Add to Home Screen sheet's Save a Backup). */ onButton?: () => void }
export interface StepperProps { steps: StepperStep[] }
function Name({ text }: { text: string }) {
  const k = text.indexOf('•••');
  if (k < 0) return <>{text}</>;
  return <>{text.slice(0, k)}<i class="tkc-stp__glyph" aria-label="More">•••</i>{text.slice(k + 3)}</>;
}
export function Stepper({ steps }: StepperProps) {
  return <ol class="tkc-stp" data-tkc="TKC-028" data-kind="static">
    {steps.map((s, k) => <li key={k} data-part="step">
      <span class="tkc-stp__num" data-part="num" aria-hidden="true">{k + 1}</span>
      <div class="tkc-stp__body" data-part="body">
        <b class="tkc-stp__name" data-part="name"><Name text={s.name} /></b>
        <span class="tkc-stp__line" data-part="line">{s.line}</span>
        {s.button && <div class="tkc-stp__btn" data-part="btn"><Button kind="small-secondary" label={s.button} show={s.buttonShow} onClick={s.onButton} /></div>}
      </div>
    </li>)}
  </ol>;
}
