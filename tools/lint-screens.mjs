// The screen-styling check (build-standards §5.8): a screen file holds layout and data only. Any class,
// className or style attribute, or a stylesheet import, in app/src/ui/screens fails. Styling lives in the
// library (one folder per registry id, and patterns/ for registry one-offs). Run: node tools/lint-screens.mjs app/src/ui/screens
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
const dir = process.argv[2] ?? 'app/src/ui/screens';
let bad = 0, files = 0;
for (const f of readdirSync(dir).filter((x) => /\.tsx?$/.test(x))) {
  files++;
  readFileSync(path.join(dir, f), 'utf8').split('\n').forEach((l, i) => {
    const hits = [...l.matchAll(/\b(class|className|style)=|import\s+['"][^'"]+\.css['"]/g)].map((m) => m[0]);
    if (hits.length && !/^\s*\/\//.test(l)) { bad++; console.log(`${path.join(dir, f)}:${i + 1}  ${hits.join(', ')}: screens hold no styling; use or add a library component`); }
  });
}
// A ChoiceRow in a screen must sit inside <Choices> (the library's list: spacing, radio group). Forgetting it gave the evening sheet no gap (Nov 18).
for (const f of readdirSync(dir).filter((x) => /\.tsx?$/.test(x))) {
  const L = readFileSync(path.join(dir, f), 'utf8').split('\n');
  L.forEach((l, i) => {
    if (!/<ChoiceRow\b/.test(l) || /^\s*\/\//.test(l)) return;
    let open = false;
    for (let j = i; j >= Math.max(0, i - 6); j--) { if (j < i && /<\/Choices>/.test(L[j])) break; if (/<Choices\b/.test(L[j])) { open = true; break; } }
    if (!open) { bad++; console.log(`${path.join(dir, f)}:${i + 1}  <ChoiceRow> outside <Choices>: wrap the rows in <Choices kind=...> so the sheet spaces them like every other pick sheet`); }
  });
}
console.log(`screen files: ${files}; styling found: ${bad}`); process.exitCode = bad ? 1 : 0;
