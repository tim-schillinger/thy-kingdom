// First run (Choose Your Bible; IA First run). A screen file: data and layout only, built from the library (build-standards §5.8).
import { useRef, useState } from 'preact/hooks';
import { useHer, setBible, setReminders, replaceHer, today as todayFn } from '../../data/store';
import { askToPersist } from '../../data/db';
import { readBackup, RESTORE_ERRORS } from '../../data/backup';
import { fmtMonthDay } from '../../engine/dates';
import { useVerses } from '../bits';
import { FirstRunView } from '../patterns/FirstRun';
import { SheetHost } from '../patterns/SheetHost';
import { BottomSheet } from '../TKC-004-BottomSheet/BottomSheet';
import { Button } from '../TKC-006-Button/Button';
import { ToastHost } from '../patterns/ToastHost';
import type { Nav } from '../App';

const BIBLES = [
  { key: 'web', name: 'World English Bible', line: 'Modern, plain English' },
  { key: 'kjv', name: 'King James Version', line: 'The classic wording' },
] as const;

export function FirstRun({ nav }: { nav: Nav }) {
  const her = useHer();
  const [pick, setPick] = useState<'web' | 'kjv'>(her.sources.bible);
  const [err, setErr] = useState('');
  const [pending, setPending] = useState<{ data: any; savedAt: string } | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const web = useVerses({ b: 'PSA', c: 23, v: 1 }, 'web'), kjv = useVerses({ b: 'PSA', c: 23, v: 1 }, 'kjv');
  const sample = (v: typeof web) => v?.flatMap((x) => x.verses.map((s) => s.t)).join(' ').replace(/\[|\]/g, '') ?? '';
  const start = () => {
    setBible(pick);
    setReminders({ firstRunDone: true, firstDay: her.reminders.firstDay ?? todayFn() });
    void askToPersist({ force: true });
    nav({ s: 'today' });
  };
  return <FirstRunView heading="Choose Your Bible"
    choices={BIBLES.map((b) => ({ key: b.key, name: b.name, line: b.line, sample: sample(b.key === 'web' ? web : kjv), reference: 'Psalm 23:1', chosen: pick === b.key, onChoose: () => setPick(b.key) }))}
    lines={['Each day has two walks with God: a Morning Walk and an Evening Walk.', 'You can change this anytime in Settings.']}
    foot="Everything you add stays on this phone." start="Start" onStart={start}
    restore="Restore From a Backup" onRestore={() => file.current?.click()}>
    <input ref={file} type="file" accept=".html,text/html" hidden data-restore onChange={async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return;
      const r = readBackup(await f.text());
      if (!r.ok) setErr(RESTORE_ERRORS[r.error]); else { setErr(''); setPending({ data: r.data, savedAt: r.savedAt }); }
      (e.target as HTMLInputElement).value = '';
    }} />
    {err && <ToastHost message={err} onDone={() => setErr('')} />}
    {pending && <SheetHost onClose={() => setPending(null)}><BottomSheet kind="confirm" title={`Replace what’s on this phone with your backup from ${fmtMonthDay(pending.savedAt)}?`}
      line="Your lists, answered prayers, progress, and settings on this phone will be replaced." onClose={() => setPending(null)}>
      <Button kind="secondary" label="Replace" onClick={async () => { await replaceHer({ ...pending.data, reminders: { ...pending.data.reminders, firstRunDone: true } }); setPending(null); nav({ s: 'today' }); }} />
      <Button kind="quiet" label="Cancel" onClick={() => setPending(null)} /></BottomSheet></SheetHost>}
  </FirstRunView>;
}
