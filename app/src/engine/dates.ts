// Civil dates as "YYYY-MM-DD" strings. No time zones are stored: the phone's local clock decides,
// and the day turns at 3 a.m. (IA decision 14).
export type CivilDate = string;

const MS_DAY = 86400000;
const toUTC = (d: CivilDate) => Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10));
const fromUTC = (t: number): CivilDate => new Date(t).toISOString().slice(0, 10);

export const addDays = (d: CivilDate, n: number): CivilDate => fromUTC(toUTC(d) + n * MS_DAY);
export const daysBetween = (a: CivilDate, b: CivilDate) => Math.round((toUTC(b) - toUTC(a)) / MS_DAY);
export const weekday = (d: CivilDate) => new Date(toUTC(d)).getUTCDay(); // 0 Sunday … 6 Saturday
export const year = (d: CivilDate) => +d.slice(0, 4);
export const month = (d: CivilDate) => +d.slice(5, 7);
export const dom = (d: CivilDate) => +d.slice(8, 10);
export const monthDay = (d: CivilDate) => d.slice(5); // "10-14": the calendars' key (1361)
export const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const daysInMonth = (y: number, m: number) => [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
export const isLastOfMonth = (d: CivilDate) => dom(d) === daysInMonth(year(d), month(d));
export const isQuarterEnd = (d: CivilDate) => isLastOfMonth(d) && month(d) % 3 === 0;
export const isYearEnd = (d: CivilDate) => monthDay(d) === '12-31';
export const isLeapDay = (d: CivilDate) => monthDay(d) === '02-29';
export const startOfWeek = (d: CivilDate) => addDays(d, -weekday(d)); // weeks run Sunday to Saturday (System Model item 2)

/** The app's date for a moment on the phone's clock: the day turns at 3 a.m. */
export function serviceDate(now: Date): CivilDate {
  const t = new Date(now.getTime() - 3 * 3600000);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${t.getFullYear()}-${p(t.getMonth() + 1)}-${p(t.getDate())}`;
}

/** Minutes since midnight on the phone's clock. */
export const clockMinutes = (now: Date) => now.getHours() * 60 + now.getMinutes();
export const parseHHMM = (s: string) => +s.slice(0, 2) * 60 + +s.slice(3, 5);

/** The Evening Walk leads from her evening start time until the day turns at 3 a.m. (469). */
export function eveningLeads(now: Date, eveningStart = '18:00'): boolean {
  const m = clockMinutes(now);
  const start = parseHHMM(eveningStart);
  if (start >= 12 * 60) return m >= start || m < 180;
  return m >= start && m < 180; // a start between midnight and 2:59 am (1265)
}

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WDL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MOL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmtShort = (d: CivilDate) => `${WD[weekday(d)]}, ${MO[month(d) - 1]} ${dom(d)}`; // "Wed, Oct 14"
export const fmtLong = (d: CivilDate) => `${WDL[weekday(d)]}, ${MOL[month(d) - 1]} ${dom(d)}`; // "Wednesday, October 14"
export const fmtMonthDay = (d: CivilDate) => `${MO[month(d) - 1]} ${dom(d)}`; // "Oct 14"
export const fmtMonthYear = (d: CivilDate) => `${MOL[month(d) - 1]} ${year(d)}`;
export const fmtFileDate = (d: CivilDate) => `${MO[month(d) - 1]} ${dom(d)} ${year(d)}`; // "Oct 26 2026"
export const fmtBackupDate = (d: CivilDate) => `${MO[month(d) - 1]} ${dom(d)}, ${year(d)}`; // "Oct 26, 2026"
export const weekdayLetter = (i: number) => 'SMTWTFS'[i];
export const weekdayShort = (i: number) => WD[i];

/** "6 pm", "6:30 pm", "12 am" (Frame Studio 3). */
export const fmtClock = (hhmm: string) => { const h = +hhmm.slice(0, 2), m = hhmm.slice(3, 5); return `${h % 12 || 12}${m === '00' ? '' : `:${m}`} ${h < 12 ? 'am' : 'pm'}`; };
