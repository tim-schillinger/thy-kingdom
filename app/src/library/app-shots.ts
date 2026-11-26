// The library's "real app" section (Sprint 3.1b chat 18): photographs of the built screens, taken from the test build's fixtures by
// tools/look-review.mjs (390 × 844 unless noted). The pictures are not in the code zip: they ride with the published library as files
// under shots/. Locally they show only after `node tools/look-review.mjs --out look-lib --dsf 2` and a copy into dist-artifact/shots.
export interface Shot { file: string; name: string; note: string }
export const APP_SHOTS: Shot[] = [
  { file: '17-prayer-intro-a', name: 'Prayer · intro', note: 'Five parts in a Stepper, “Don’t show this again” (J-intro). Amen reads “God’s hands” (458).' },
  { file: '18-p1-a', name: 'Prayer · 1 Father', note: 'The step header shows on the first part only (J-p1).' },
  { file: '19-p2-a', name: 'Prayer · 2 Kingdom', note: 'Tonight’s nations from the calendar, real Wikidata facts (461–464).' },
  { file: '19-p2-c', name: 'Prayer · 2 Kingdom · 320', note: 'J-k320.' },
  { file: '20-nation-a', name: 'Nation page', note: 'Capital, Population, Main language (Region left out, 463). The map’s spot comes from latitude and longitude on a placeholder globe.' },
  { file: '21-p3-a', name: 'Prayer · 3 People · first night', note: 'Ray’s empty Leaders list: “Who comes to mind?” and Add Person.' },
  { file: '22-p3-full-a', name: 'Prayer · 3 People · a full list', note: 'Neighbors, 5 tonight, the key line, ask toggles (J-p3).' },
  { file: '22-p3-full-b', name: 'Prayer · 3 People · dark', note: 'J-p3d.' },
  { file: '34-sat-a', name: 'Prayer · 3 Saturday Requests', note: 'Your own requests, one field each (J-sat).' },
  { file: '35-fri-a', name: 'Prayer · 3 Friday Difficult People', note: 'Matthew 5:44 above the list (J-fri).' },
  { file: '23-p4-a', name: 'Prayer · 4 Trust', note: 'J-p4.' },
  { file: '24-p5-a', name: 'Prayer · 5 Amen', note: 'J-p5.' },
  { file: '31-sheet-menu-a', name: 'People · ⋯ menu', note: 'Mark Answered, Edit, Remove (24 px under the header, 466).' },
  { file: '32-sheet-add-a', name: 'Add Person', note: 'Name, What to pray for, the List row with Change.' },
  { file: '32-sheet-add-d', name: 'Add Person · 200% text', note: 'Chat 18: Cancel and the title now keep an 8 px gap.' },
  { file: '33-sheet-answer-a', name: 'Mark Answered', note: 'The question, the answer, the date with Change (Pick a Day).' },
  { file: '29-ev-done-a', name: 'Evening Walk Complete', note: 'The Morning Walk still open: Go to Morning Walk (esph h1).' },
  { file: '29-ev-done-b', name: 'Evening Walk Complete · dark', note: 'esph h2.' },
  { file: '27-day-done-a', name: 'Day Complete · first day', note: 'No badge before 2 days. The psalm’s title line is gone (468, fixed in chat 18).' },
  { file: '36-day-badge-a', name: 'Day Complete · 13-day streak', note: 'The TKC-026 badge with the TKC-055 plant.' },
  { file: '11-still-a', name: 'Still Open', note: 'Two steps left, the done list under them (esph h5).' },
  { file: '11-still-d', name: 'Still Open · 200% text', note: 'One column, marks at 24 px (467 a).' },
  { file: '28-today-finished-a', name: 'Today · day finished', note: 'Both walks 7 of 7, See Tomorrow’s Walks.' },
];
