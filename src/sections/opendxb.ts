import type { Content } from "../content";
import { h, Raw } from "../html";
import { btn, fact, label, sectionHead, sheetFoot, titleBlock } from "../primitives";

export function opendxb(c: Content): Raw {
  const L = c.labels;
  const s = c.opendxb.sdk, g = c.opendxb.game;
  return h`<section class="section" id="opendxb" aria-labelledby="opendxb-title">
  ${sectionHead(c.opendxb.num, c.opendxb.title, `${L.sheet} 03 · 1 ${L.of} 2`, "opendxb-title")}
  <div class="sdk-grid">
    <div class="terminal">
      <div class="terminal-cap mono">${s.figcap}</div>
      <pre class="mono">${s.terminal}</pre>
      <div class="terminal-foot mono"><span>npm: opendxb</span><span>node 20+ · MIT</span></div>
    </div>
    <article class="sheet sdk-sheet">
      ${titleBlock([{ label: L.project, value: "OPENDXB" }, { label: L.status, value: L.live, status: true }, { label: L.rev, value: "v0.1.0" }, { label: L.since, value: "AUG 2026" }])}
      <div class="sheet-content">
        <h3 class="sheet-title">${s.headline}</h3>
        <p class="sheet-lead">${s.line}</p>
        <div class="facts">${s.facts.map(([l, v]) => fact(l, v))}</div>
        <div class="sheet-actions">${btn(s.repoLabel, { href: s.repo, primary: true, icon: "arrow", external: true })}${btn(s.npmLabel, { href: s.npm, external: true })}${btn(s.docsLabel, { href: s.docs, external: true })}</div>
      </div>
      ${sheetFoot([L.drawnBy, L.licence, L.checkedRepo])}
    </article>
  </div>

  ${sectionHead(c.opendxb.num, g.title, `${L.sheet} 03 · 2 ${L.of} 2`, "game-title")}
  <article class="sheet game-sheet" aria-labelledby="game-title">
    <div class="game-fig">
      <div class="game-shot">
        <img src="/img/${g.shot}" alt="${g.title}: ${g.figcap.toLowerCase()}" width="1440" height="862" loading="lazy">
        <div class="fig-tag fig-tag-dark mono">${g.figcap}</div>
      </div>
      <div class="ways">${g.ways.map(w => h`<div class="way">${label(w.k)}<div class="way-t">${w.t}</div><div class="way-d">${w.d}</div></div>`)}</div>
    </div>
    <div class="sheet-body">
      ${titleBlock([{ label: L.project, value: "LANDING IN DUBAI" }, { label: L.status, value: L.live, status: true }, { label: L.url, value: "opendxb.io" }])}
      <div class="sheet-content">
        <h3 class="sheet-title">${g.headline}</h3>
        <p class="sheet-lead">${g.line}</p>
        <div class="facts facts-1">${g.facts.map(([l, v]) => fact(l, v))}</div>
        <div class="game-thumb-row">
          <img class="game-thumb" src="/img/${g.thumb}" alt="" width="200" height="125" loading="lazy">
          <div class="sheet-actions sheet-actions-col">${btn(g.play, { href: g.url, primary: true, icon: "arrow", external: true })}${btn(g.guide, { href: g.guideUrl, external: true })}</div>
        </div>
      </div>
      ${sheetFoot([L.drawnBy, g.unofficial])}
    </div>
  </article>
</section>`;
}
