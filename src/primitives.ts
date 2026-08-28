import { h, raw, Raw } from "./html";

const ICONS = {
  arrow: raw('<svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"></path><path d="M8 7h9v9"></path></svg>'),
  down: raw('<svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12"></path><path d="M6 12l6 6 6-6"></path><path d="M4 20h16"></path></svg>'),
  none: raw(""),
};

export const label = (t: string, cls = ""): Raw => h`<div class="mono label${cls ? " " + cls : ""}">${t}</div>`;

export const kicker = (t: string): Raw => h`<div class="mono kicker">${t}</div>`;

export const sectionHead = (num: string, title: string, right: string, id?: string): Raw =>
  h`<div class="section-head"><div class="section-head-left">${kicker(num)}<h2${id ? raw(` id="${id}"`) : ""}>${title}</h2></div>${label(right, "label-12")}</div>`;

export function btn(text: string, o: { href: string; primary?: boolean; icon?: keyof typeof ICONS; external?: boolean; download?: boolean }): Raw {
  return h`<a class="btn ${o.primary ? "btn-primary" : "btn-ghost"}" href="${o.href}"${o.external ? raw(' rel="noopener" target="_blank"') : ""}${o.download ? raw(" download") : ""}>${ICONS[o.icon ?? "none"]}<span>${text}</span></a>`;
}

export const fact = (l: string, v: string): Raw => h`<div class="fact">${label(l)}<div class="fact-v">${v}</div></div>`;

export const chips = (items: string[]): Raw => h`<div class="chips">${items.map(i => h`<span class="chip mono">${i}</span>`)}</div>`;

/** Title block: label/value cells in a 1.5 px ink grid. Values are LTR isolates so dates and versions never reorder in RTL. */
export const titleBlock = (cells: { label: string; value: string; status?: boolean }[]): Raw =>
  h`<div class="tb" style="--tb-n: ${cells.length}">${cells.map(c =>
    h`<div class="tb-cell">${label(c.label, "label-10")}<div class="tb-v${c.status ? " tb-status" : ""}">${c.status ? raw('<span class="tb-dot" aria-hidden="true"></span>') : ""}<bdi dir="ltr">${c.value}</bdi></div></div>`)}</div>`;

/** Vertical dimension line with a rotated mono label (decorative). */
export const dimLine = (text: string): Raw =>
  h`<div class="dim" aria-hidden="true"><span class="dim-line"></span><span class="dim-cap dim-top"></span><span class="dim-cap dim-bottom"></span><span class="dim-text mono">${text}</span></div>`;

/** Mono footer strip under a sheet: two or three cells spread across. */
export const sheetFoot = (cells: string[]): Raw =>
  h`<div class="sheet-foot mono">${cells.map(c => h`<span>${c}</span>`)}</div>`;
