// Guard (Sprint 1a finding): Preact 11 no longer adds "px" to bare numbers in inline styles, so
// style={{ marginTop: 24 }} is silently dropped. 43 such styles in the skeleton were a hidden cause of PM-001.
// Fails on any inline style with a bare number for a length. Run: node tools/lint-styles.mjs app/src
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const UNITLESS = /^(opacity|zIndex|flex|flexGrow|flexShrink|order|fontWeight|lineHeight|zoom)$/;
const walk = (d) => readdirSync(d).flatMap((f) => { const p = path.join(d, f); return statSync(p).isDirectory() ? walk(p) : /\.tsx$/.test(f) ? [p] : []; });
let bad = 0;
for (const f of walk(process.argv[2] ?? 'app/src')) readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
  for (const m of l.matchAll(/style=\{\{([^}]*)\}\}/g)) for (const [, k] of m[1].matchAll(/\b([a-zA-Z]+):\s*-?\d+(?:\.\d+)?\s*(?=[,}]|$)/g))
    if (!UNITLESS.test(k)) { bad++; if (bad <= 50) console.log(`${f}:${i + 1}  ${k}: a bare number is dropped by Preact 11; write '${k}: "Npx"'`); }
});
console.log(`inline styles with bare-number lengths: ${bad}`); process.exitCode = bad ? 1 : 0;
