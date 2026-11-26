// TKC-018 Toast, spec 0.3: a short dark note just after an action, with Undo when the action can be taken back.
import './toast.css';
export interface ToastProps { message: string; action?: string; show?: 'pressed' | 'focus'; onAction?: () => void }
export function Toast({ message, action, show, onAction }: ToastProps) {
  return <div class="tkc-toast" role="status" data-tkc="TKC-018" data-kind={action ? 'undo' : 'note'}>
    <span data-part="message">{message}</span>
    {action ? <button type="button" class={show ? `is-${show}` : undefined} data-part="action" aria-label={`${action}, ${message}`} onClick={onAction}>{action}</button> : null}</div>;
}
