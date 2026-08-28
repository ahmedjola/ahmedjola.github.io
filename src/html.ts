/** Minimal HTML templating: `h` escapes interpolations; `raw` marks trusted markup. */
export class Raw {
  constructor(public s: string) {}
  toString(): string { return this.s; }
}

export const raw = (s: string | Raw): Raw => (s instanceof Raw ? s : new Raw(s));

export const esc = (v: unknown): string =>
  String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function h(strings: TemplateStringsArray, ...vals: unknown[]): Raw {
  let out = "";
  strings.forEach((s, i) => {
    out += s;
    if (i >= vals.length) return;
    const v = vals[i];
    if (Array.isArray(v)) out += v.map(x => (x instanceof Raw ? x.s : esc(x))).join("");
    else if (v instanceof Raw) out += v.s;
    else if (v === null || v === undefined || v === false) out += "";
    else out += esc(v);
  });
  return new Raw(out);
}
