// Places a TKC-004 sheet over a screen with its scrim (TKC-004 C: "the screen places the sheet and its scrim").
// A pattern part: no data rules. A tap on the scrim closes; Escape closes. The sheet comes up and goes down with motion-lock M7 (ui/motion.ts), however it closes.
// Focus (Build 7k, TKC-004 §E): Tab and Shift+Tab stay inside the sheet, and when it closes focus goes back to what opened it (if that is still on the screen).
import { useEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { useSheetMotion } from '../motion';
import './sheethost.css';
export function SheetHost({ onClose, children }: { onClose: () => void; children: ComponentChildren }) {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  if (opener.current === null && typeof document !== 'undefined') opener.current = document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null;   // read in the first render, before the sheet takes focus
  useSheetMotion(root);
  useEffect(() => () => { const o = opener.current; if (o && o.isConnected) o.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const sheet = root.current?.querySelector<HTMLElement>('.tkc-sheet'); if (!sheet) return;
      const list = [...sheet.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]')].filter((x) => x.tabIndex >= 0 && !x.hasAttribute('disabled') && x.getClientRects().length > 0);
      if (!list.length) { e.preventDefault(); return; }
      const first = list[0], last = list[list.length - 1], on = document.activeElement as HTMLElement | null, inside = !!on && sheet.contains(on);
      if (e.shiftKey && (!inside || on === first)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (!inside || on === last)) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [onClose]);
  return <div class="tkc-host" data-part="scrim" ref={root} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}><div class="tkc-host__sheet">{children}</div></div>;
}
