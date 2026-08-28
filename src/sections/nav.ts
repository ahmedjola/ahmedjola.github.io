import type { Content } from "../content";
import { h, raw, Raw } from "../html";

const BURGER = raw('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>');

export function nav(c: Content, lang: "en" | "ar"): Raw {
  const other = lang === "en" ? "ar" : "en";
  return h`<header class="nav" id="top">
  <div class="nav-left">
    <a class="nav-chip mono" href="#top">${c.nav.chip}</a>
    <span class="nav-sheet mono">${c.nav.sheet}</span>
  </div>
  <nav class="nav-links" id="nav-links" aria-label="Sections">
    ${c.nav.items.map(i => h`<a href="#${i.id}">${i.text}</a>`)}
  </nav>
  <div class="nav-right">
    <a class="lang mono" data-lang="${other}" hreflang="${other}" href="${c.nav.toggleHref}">${c.nav.toggle}</a>
    <button class="nav-burger" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="${c.labels.menu}">${BURGER}</button>
  </div>
</header>`;
}
