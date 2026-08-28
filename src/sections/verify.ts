import type { Content } from "../content";
import { h, raw, Raw } from "../html";
import { label, sectionHead } from "../primitives";

const ARROW = raw('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8590C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"></path><path d="M8 7h9v9"></path></svg>');

export function verify(c: Content): Raw {
  const L = c.labels;
  const v = c.verify;
  return h`<section class="section" id="verify" aria-labelledby="verify-title">
  ${sectionHead(v.num, v.title, `${L.sheet} 06 · 1 ${L.of} 1`, "verify-title")}
  <div class="verify-grid">
    <div class="verify-intro">
      <h3 class="sheet-title">${v.headline}</h3>
      <p class="sheet-lead">${v.line}</p>
      <div class="sheet contact">
        ${label(v.contactLabel)}
        <address class="contact-body">
          <div>${v.city}</div>
          <div><a href="mailto:${v.email}"><bdi dir="ltr">${v.email}</bdi></a></div>
          <div><a href="https://www.linkedin.com/in/ahmedjola" rel="noopener" target="_blank"><bdi dir="ltr">${v.linkedin}</bdi></a></div>
        </address>
      </div>
    </div>
    <div class="sheet verify-table">
      ${v.rows.map(r => h`<a class="verify-row" href="${r.url}" rel="noopener" target="_blank"><span class="mono verify-kind">${r.kind.toUpperCase()}</span><span class="verify-name">${r.name}</span><span class="mono verify-url"><bdi dir="ltr">${raw(r.url.replace(/^https:\/\/(www\.)?/, "").split("/").map(s => s.replace(/[&<>"']/g, "")).join("/<wbr>"))}</bdi></span>${ARROW}</a>`)}
    </div>
  </div>
</section>`;
}

export function footer(c: Content): Raw {
  return h`<footer class="site-footer mono"><span>${c.footer.left}</span><span>${c.footer.mid}</span><span>${c.footer.right}</span></footer>`;
}
