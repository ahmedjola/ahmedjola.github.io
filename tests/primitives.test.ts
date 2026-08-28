import { describe, it, expect } from "vitest";
import { h, raw } from "../src/html";
import { titleBlock, btn, chips } from "../src/primitives";
import { schematic } from "../src/schematics";

describe("html", () => {
  it("escapes interpolations and passes raw through", () => {
    expect(String(h`<b>${"<x>"}</b>`)).toBe("<b>&lt;x&gt;</b>");
    expect(String(h`<b>${raw("<i>ok</i>")}</b>`)).toBe("<b><i>ok</i></b>");
  });
  it("joins arrays and drops null, undefined and false", () => {
    expect(String(h`<ul>${[raw("<li>a</li>"), "<b>"]}</ul>${null}${false}`)).toBe("<ul><li>a</li>&lt;b&gt;</ul>");
  });
});

describe("primitives", () => {
  it("wraps every title-block value in an LTR isolate", () => {
    const out = String(titleBlock([{ label: "REV", value: "v1.0.5" }, { label: "STATUS", value: "SHIPPED", status: true }]));
    expect(out.match(/<bdi dir="ltr">/g)).toHaveLength(2);
    expect(out).toContain("tb-status");
    expect(out).toContain("--tb-n: 2");
  });
  it("marks external buttons noopener and new tab", () => {
    const out = String(btn("App Store", { href: "https://apps.apple.com/app/id1", primary: true, icon: "arrow", external: true }));
    expect(out).toContain('rel="noopener" target="_blank"');
    expect(out).toContain("btn-primary");
  });
  it("renders one chip per item", () => {
    expect(String(chips(["LWC", "Apex"])).match(/class="chip mono"/g)).toHaveLength(2);
  });
});

describe("schematics", () => {
  it("renders the four diagrams as svg with a 520-wide viewBox and an aria-label", () => {
    for (const k of ["mc360", "crm", "ai", "audit"] as const) {
      const s = String(schematic(k));
      expect(s).toMatch(/^<svg[^>]*viewBox="0 0 520 \d+"/);
      expect(s).toContain('role="img"');
      expect(s).toContain(`id="ah-${k}"`);
    }
  });
});
