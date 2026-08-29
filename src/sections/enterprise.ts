import type { Content } from "../content";
import { h, Raw } from "../html";
import { chips, fact, label, sectionHead, sheetFoot, titleBlock } from "../primitives";
import { schematic } from "../schematics";

export function enterprise(c: Content): Raw {
  const L = c.labels;
  const H = c.enterprise;
  const n = H.cases.length;
  return h`<section class="section" id="enterprise" aria-labelledby="enterprise-title">
  ${sectionHead(H.num, H.title, `${L.sheet} 04 · ${L.index}`, "enterprise-title")}
  <div class="ent-intro">
    <div class="ent-text">
      <h3 class="sheet-title">${H.headline}</h3>
      <p class="sheet-lead">${H.line}</p>
      <div class="facts">${H.facts.map(([l, v]) => fact(l, v))}</div>
    </div>
    <div class="sheet index">
      ${label(H.indexLabel)}
      <div class="index-rows">
        ${H.cases.map((k, i) => h`<a class="index-row" href="#case-${k.key}"><span class="mono index-num">4.${i + 1}</span><span class="index-name">${k.name}</span><span class="index-tag">${k.tag}</span><span class="mono index-size">${k.size}</span></a>`)}
      </div>
    </div>
  </div>
  <div class="sheets">
  ${H.cases.map((k, i) => {
    const fig = k.shot
      ? h`<img src="/img/${k.shot}" alt="${k.name}: ${L.renderedFrom.toLowerCase()}" loading="lazy"><div class="figcap mono"><span>${L.fig} ${i + 8} · ${L.renderedFrom}</span><span>${L.sampleData}</span></div>`
      : h`${schematic(k.schematic!)}<div class="figcap mono"><span>${L.fig} ${i + 8} · ${L.schematic}</span><span>${L.notToScale}</span></div>`;
    return h`<article class="sheet case-sheet" id="case-${k.key}" aria-labelledby="case-${k.key}-title">
    ${titleBlock([{ label: L.project, value: k.code }, { label: L.status, value: k.status, status: true }, { label: L.years, value: k.years }, { label: L.size, value: k.size }])}
    <div class="case-grid">
      <div class="case-body">
        <div class="mono label label-12">${L.sheet} 04 · ${i + 1} ${L.of} ${n}</div>
        <h3 class="sheet-title" id="case-${k.key}-title">${k.name}</h3>
        <dl class="case-rows">
          <dt class="mono label">${L.problem}</dt><dd>${k.problem}</dd>
          <dt class="mono label">${L.built}</dt><dd>${k.built}</dd>
          <dt class="mono label">${L.result}</dt><dd>${k.impact}</dd>
        </dl>
        ${chips(k.stack)}
      </div>
      <div class="case-fig">${fig}</div>
    </div>
    ${sheetFoot([H.footer, H.footerRight])}
  </article>`;
  })}
  </div>
</section>`;
}
