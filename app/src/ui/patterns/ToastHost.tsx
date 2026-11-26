// Places a TKC-018 toast at the foot of a screen and takes it away after a few seconds (pattern part, no data rules). It rises in and fades out (M8, ui/motion.ts).
import { useEffect, useRef } from 'preact/hooks';
import { Toast } from '../TKC-018-Toast/Toast';
import { useToastMotion } from '../motion';
import './toasthost.css';
export function ToastHost({ message, action, onAction, onDone, ms = 5000, lift }: { message: string; action?: string; onAction?: () => void; onDone: () => void; ms?: number; /** a step screen's foot is under it: sit above the foot */ lift?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useToastMotion(root);
  useEffect(() => { const t = setTimeout(onDone, ms); return () => clearTimeout(t); }, [message]);
  return <div class={`tkc-toasthost${lift ? ' is-lifted' : ''}`} ref={root}><Toast message={message} action={action} onAction={onAction} /></div>;
}
