// The backup: one readable .html file with her data inside (1273, 1287, 1362).
// The visible page is written out at save time, so it reads and prints with no script.
// Her data rides in <script type="application/json" id="thy-kingdom-backup">, as references, never Bible text.
import { FORMAT } from './db';
import { type CivilDate, fmtBackupDate, fmtFileDate, fmtMonthDay } from '../engine/dates';
import { type HerData, LISTS, type Content } from '../engine/types';
import { streaks } from '../engine/progress';
import { answeredIds } from '../engine/people';

export const APP_VERSION = '0.1.0-skeleton';
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** What leaves the phone: everything she owns except what belongs to this phone (Data Ownership, "What she owns"). */
export function backupData(her: HerData): HerData {
  const copy: HerData = JSON.parse(JSON.stringify(her));
  copy.reminders.lastBackup = null;
  copy.reminders.homeCardClosed = false;
  return copy;
}

export function backupFileName(today: CivilDate) { return `Thy Kingdom backup ${fmtFileDate(today)}.html`; }

export function buildBackupHtml(her: HerData, content: Content, today: CivilDate): string {
  const data = backupData(her);
  const payload = { app: 'thy-kingdom', format: FORMAT, savedAt: today, appVersion: APP_VERSION, contentVersion: content.cal.contentVersion, data };
  // "<" is escaped so no text she typed can close the script tag.
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  const gone = answeredIds(her);
  const lists = LISTS.map((l, i) => {
    const people = her.people.filter((p) => p.list === i && !p.removed && !gone.has(p.id));
    const rows = people.length ? people.map((p) => `<li><b>${esc(p.name)}</b>${p.request ? ` · ${esc(p.request)}` : ''}</li>`).join('') : `<li class="m">${i === 6 ? 'No requests yet' : 'No one yet'}</li>`;
    return `<h3>${l.name}</h3><p class="m">${l.night} · ${l.line}</p><ul>${rows}</ul>`;
  }).join('');
  const answered = her.answered.filter((a) => !a.removed).sort((a, b) => b.on.localeCompare(a.on));
  const ans = answered.length
    ? answered.map((a) => `<li>${a.answer ? `${esc(a.answer)}<br>` : ''}<span class="m">${esc(a.request || a.name)} · Answered ${fmtMonthDay(a.on)} · ${LISTS[a.list].name}</span></li>`).join('')
    : '<li class="m">None yet</li>';
  const s = streaks(her, today);
  const set = her.settings;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Thy Kingdom backup · ${fmtBackupDate(today)}</title>
<style>body{background:#FFFFFF;color:#2B2520;font:17px/1.55 Georgia,"Times New Roman",serif;max-width:640px;margin:0 auto;padding:24px 20px 48px}
h1{font-size:28px;line-height:1.2;margin:0 0 12px}h2{font-size:22px;margin:32px 0 8px;padding-top:16px;border-top:1px solid #CFC6BA}h3{font-size:18px;margin:20px 0 0}
.m{color:#5E554C}ul{padding-left:20px;margin:6px 0}li{margin:4px 0}p{margin:4px 0}</style></head>
<body>
<h1>Thy Kingdom backup · ${fmtBackupDate(today)}</h1>
<p>Open this file on any phone, tablet, or computer to read or print your lists.</p>
<p>To bring everything back, open the app and choose Restore From a Backup.</p>
<h2>Your Lists</h2>${lists}
<h2>Answered Prayers</h2><ul>${ans}</ul>
<h2>Your Progress</h2><p>${set.tracking ? `Current streak: ${s.current} ${s.current === 1 ? 'day' : 'days'}<br>Longest streak: ${s.longest} ${s.longest === 1 ? 'day' : 'days'}` : 'Progress is hidden in Settings. It is kept in this backup.'}</p>
<h2>Your Settings</h2><p>Bible: ${her.sources.bible === 'kjv' ? 'King James Version' : 'World English Bible'}<br>Your evening begins: ${fmtTime(set.eveningStart)}<br>Track My Progress: ${set.tracking ? 'On' : 'Off'}</p>
<script type="application/json" id="thy-kingdom-backup">${json}</script>
</body></html>`;
}

const fmtTime = (hhmm: string) => { const h = +hhmm.slice(0, 2), m = hhmm.slice(3); return `${h % 12 || 12}${m === '00' ? '' : `:${m}`} ${h < 12 ? 'am' : 'pm'}`; };

export type RestoreResult = { ok: true; data: HerData; savedAt: CivilDate } | { ok: false; error: 'not-backup' | 'newer' };

/** Read a backup file. Older formats are upgraded step by step; a newer one is refused with its own message (1273). */
export function readBackup(text: string): RestoreResult {
  const m = text.match(/<script type="application\/json" id="thy-kingdom-backup">([\s\S]*?)<\/script>/);
  if (!m) return { ok: false, error: 'not-backup' };
  let p: any;
  try { p = JSON.parse(m[1]); } catch { return { ok: false, error: 'not-backup' }; }
  if (p?.app !== 'thy-kingdom' || typeof p.format !== 'number' || !p.data) return { ok: false, error: 'not-backup' };
  if (p.format > FORMAT) return { ok: false, error: 'newer' };
  let data = p.data;
  for (let f = p.format; f < FORMAT; f++) data = MIGRATIONS[f](data);
  return { ok: true, data, savedAt: p.savedAt };
}
/** MIGRATIONS[n] turns format n into format n + 1. Kept forever. */
const MIGRATIONS: Record<number, (d: any) => any> = {};

export const RESTORE_ERRORS = {
  'not-backup': 'This file isn’t a Thy Kingdom backup.',
  newer: 'This backup is from a newer version of the app. Update the app, then try again.',
};
