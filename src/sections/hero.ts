import type { Content } from "../content";
import { h, Raw } from "../html";
import { btn, dimLine, kicker, label } from "../primitives";

export function hero(c: Content): Raw {
  const x = c.hero;
  const resume = c.career.resumeFile ? btn(x.ghost, { href: `/${c.career.resumeFile}`, icon: "down", download: true }) : "";
  return h`<section class="hero" aria-labelledby="hero-name">
  <div class="hero-grid">
    <div class="hero-text">
      ${kicker(x.kicker)}
      <h1 class="hero-name" id="hero-name">${x.name}</h1>
      <p class="hero-title">${x.titleA} <span class="amp">&amp;</span> ${x.titleB}</p>
      <p class="hero-lead">${x.line}</p>
      <div class="hero-actions">${btn(x.primary, { href: "#apps", primary: true, icon: "arrow" })}${resume}</div>
    </div>
    <div class="hero-figure">
      <div class="frame-wrap">
        ${dimLine(x.side)}
        <div class="frame"><img src="/img/${x.portrait}" alt="${x.name}" width="380" height="420" fetchpriority="high"></div>
        <div class="figcap mono"><span>${x.figcap}</span><span>${c.labels.scale}</span></div>
      </div>
    </div>
  </div>
  <div class="proof-wrap">
    <div class="proof">
      ${x.proof.map(p => h`<a class="proof-cell" href="${p.href}">${label(p.label)}<div class="proof-n">${p.n}${p.unit ? h` <span class="proof-unit">${p.unit}</span>` : ""}</div><div class="proof-sub">${p.sub}</div></a>`)}
    </div>
    <div class="proof-foot mono">${x.foot}</div>
  </div>
</section>`;
}
