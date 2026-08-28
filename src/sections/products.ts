import type { Content } from "../content";
import { h, Raw } from "../html";
import { btn, dimLine, fact, label, sectionHead, sheetFoot, titleBlock } from "../primitives";

export function products(c: Content): Raw {
  const L = c.labels;
  const n = c.products.length;
  return h`<section class="section" id="apps" aria-labelledby="apps-title">
  ${sectionHead(c.productsSection.num, c.productsSection.title, `${L.sheet} 02 · 1 ${L.of} ${n}`, "apps-title")}
  <div class="sheets">
  ${c.products.map((p, i) => {
    const sub = p.rating === null ? p.sub : `${p.sub} · ${p.rating} ${L.stars}`;
    const links = [
      btn(L.appStore, { href: `https://apps.apple.com/app/id${p.id}`, primary: true, icon: "arrow", external: true }),
      btn(p.site, { href: `https://${p.site}`, external: true }),
      p.repo ? btn(L.github, { href: p.repo, external: true }) : "",
    ];
    return h`<article class="sheet product-sheet" id="app-${p.key}" aria-labelledby="app-${p.key}-title">
    <div class="sheet-fig">
      <img src="/img/${p.shot}" alt="${p.store}, ${p.figcap.toLowerCase()}" width="552" height="1200" loading="${i === 0 ? "eager" : "lazy"}">
      ${dimLine(L.device)}
      <div class="fig-tag mono">${L.fig} ${i + 2} · ${p.figcap}</div>
    </div>
    <div class="sheet-body">
      ${titleBlock([{ label: L.project, value: p.code }, { label: L.status, value: L.shipped, status: true }, { label: L.rev, value: p.version }, { label: L.released, value: p.released }])}
      <div class="sheet-content">
        <div class="sheet-title-row">
          <img class="app-icon" src="/img/${p.icon}" alt="" width="64" height="64" loading="lazy">
          <div><h3 class="sheet-title" id="app-${p.key}-title">${p.store}</h3><div class="sheet-sub">${sub}</div></div>
        </div>
        <p class="sheet-lead">${p.line}</p>
        <div class="facts">${p.facts.map(([l, v]) => fact(l, v))}</div>
        <div class="sheet-actions">${links}</div>
      </div>
      ${sheetFoot([L.drawnBy, `ID ${p.id}`, L.checkedStore])}
    </div>
  </article>`;
  })}
  </div>
</section>`;
}
