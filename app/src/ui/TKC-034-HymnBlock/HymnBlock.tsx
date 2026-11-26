// TKC-034 HymnBlock 0.3 (118): a credit line, "From The Army and Navy Hymnal, 1920", under the writer line. 0.2 (113): a hymn's refrain shows once, after the first verse, set apart in italic, as the book prints it. 0.1.1: a hymn's words, stanza by stanza, flat on the page. Each poetic line is its own block so a wrap can hang (840).
// The writer line sits under the last stanza (824). No card, no title: the SourceLine names the hymn.
import './hymnblock.css';
export interface HymnStanza { n: number | string; lines: string[] }
export interface HymnBlockProps { kind?: 'hymn' | 'writer' | 'credit'; stanzas?: HymnStanza[]; refrain?: string[]; writer?: string }
export function HymnBlock({ kind = 'hymn', stanzas = [], refrain = [], writer }: HymnBlockProps) {
  if (kind === 'credit') return <p class="tkc-hy-w tkc-hy-c" data-tkc="TKC-034" data-kind="credit">{writer}</p>;   // 0.3 (118): the hymnal's name under the writer line
  if (kind === 'writer') return <p class="tkc-hy-w" data-tkc="TKC-034" data-kind="writer">{writer}</p>;
  return <div class="tkc-hy" data-tkc="TKC-034" data-kind="hymn">
    {stanzas.map((s, i) => <>
      <div class="tkc-hy__s" data-part="stanza" key={String(s.n)}><span class="tkc-hy__n" data-part="number">{s.n}</span>{s.lines.map((l, k) => <span class="tkc-hy__l" data-part="line" key={k}>{l}</span>)}</div>
      {i === 0 && refrain.length > 0 && <div class="tkc-hy__s tkc-hy__r" data-part="refrain" key="refrain">{refrain.map((l, k) => <span class="tkc-hy__l" data-part="line" key={k}>{l}</span>)}</div>}</>)}
  </div>;
}
