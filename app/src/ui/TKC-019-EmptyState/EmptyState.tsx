// TKC-019 EmptyState, spec 0.4 (the "missing" kind, 575): 0.3: when there's nothing here yet, a verse and one plain line, and the way to begin.
import type { ComponentChildren } from 'preact';
import { Button } from '../TKC-006-Button/Button';
import './emptystate.css';
export interface EmptyStateProps { kind?: 'verse' | 'search' | 'settled' | 'missing' | 'slow' | 'failed'; onAction?: () => void; verse?: string; reference?: string; line?: string; heading?: string; actionLabel?: string; children?: ComponentChildren }
export function EmptyState({ kind = 'verse', verse, reference, line, heading, actionLabel, onAction, children }: EmptyStateProps) {
  // 0.4: a reading that is slow to come (past 10 s: a polite status, no button) and one that did not open (one secondary button, Try Again).
  if (kind === 'slow') return <div class="tkc-empty" data-tkc="TKC-019" data-kind="slow" role="status"><p class="tkc-empty__line tkc-empty__line--missing" data-part="line">{line}</p></div>;
  if (kind === 'failed') return <div class="tkc-empty" data-tkc="TKC-019" data-kind="failed"><p class="tkc-empty__line tkc-empty__line--missing" data-part="line">{line}</p><div class="tkc-empty__action" data-part="action"><Button kind="secondary" label={actionLabel ?? 'Try Again'} onClick={onAction} /></div></div>;
  // 575: what's missing, in her terms, and one next step: a line in body 17/26 ink, then a secondary button. No chapter title above it, no note meant for us.
  if (kind === 'missing') return <div class="tkc-empty" data-tkc="TKC-019" data-kind="missing"><p class="tkc-empty__line tkc-empty__line--missing" data-part="line">{line}</p><div class="tkc-empty__action" data-part="action"><Button kind="secondary" label={actionLabel ?? ''} onClick={onAction} /></div></div>;
  if (kind === 'settled') return <div class="tkc-empty" data-tkc="TKC-019" data-kind="settled" role="status"><b data-part="head">{heading}</b><span data-part="text">{line}</span></div>;
  return <div class="tkc-empty" data-tkc="TKC-019" data-kind={kind} role={kind === 'search' ? 'status' : undefined}>
    {verse ? <><p class="tkc-empty__verse" data-part="verse">{verse}</p><p class="tkc-empty__ref" data-part="ref">{reference}</p></> : null}
    <p class="tkc-empty__line" data-part="line">{line}</p>{actionLabel || children ? <div class="tkc-empty__action" data-part="action">{actionLabel ? <Button kind="secondary" label={actionLabel} /> : children}</div> : null}</div>;
}
