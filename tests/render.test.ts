import { describe, it, expect } from "vitest";
import { loadContent } from "../src/content";
import { nav } from "../src/sections/nav";
import { hero } from "../src/sections/hero";
import { products } from "../src/sections/products";
import { opendxb } from "../src/sections/opendxb";
import { enterprise } from "../src/sections/enterprise";
import { career } from "../src/sections/career";
import { verify, footer } from "../src/sections/verify";

for (const lang of ["en", "ar"] as const) {
  const c = loadContent(lang);
  describe(`sections (${lang})`, () => {
    it("nav has five anchors that match section ids", () => {
      const s = String(nav(c, lang));
      for (const i of c.nav.items) expect(s).toContain(`href="#${i.id}"`);
      expect(s).toContain(`href="${c.nav.toggleHref}"`);
    });
    it("hero shows the name, the title and four proof cells", () => {
      const s = String(hero(c));
      expect(s).toContain(c.hero.name);
      expect(s).toContain(c.hero.titleB);
      expect(s.match(/class="proof-cell"/g)).toHaveLength(4);
    });
    it("products render four sheets with App Store links by id", () => {
      const s = String(products(c));
      expect(s.match(/class="sheet product-sheet"/g)).toHaveLength(4);
      for (const p of c.products) expect(s).toContain(`https://apps.apple.com/app/id${p.id}`);
    });
    it("only the rated product shows a rating, and only the product with a repo gets a GitHub button", () => {
      const s = String(products(c));
      expect(s.match(/4\.7/g)).toHaveLength(1);
      expect(s.match(/github\.com\/ahmedjola\/clipbridge"/g)).toHaveLength(1);
    });
    it("opendxb renders the terminal and both sheets", () => {
      const s = String(opendxb(c));
      expect(s).toContain('class="terminal"');
      expect(s).toContain("opendxb.io");
      expect(s.match(/class="way"/g)).toHaveLength(3);
    });
    it("enterprise renders six index rows, six case sheets, four schematics", () => {
      const s = String(enterprise(c));
      expect(s.match(/class="index-row"/g)).toHaveLength(6);
      expect(s.match(/class="sheet case-sheet"/g)).toHaveLength(6);
      expect(s.match(/<svg class="schematic"/g)).toHaveLength(4);
    });
    it("career hides the resume button when no file is set", () => {
      const s = String(career({ ...c, career: { ...c.career, resumeFile: null } }));
      expect(s).not.toContain(c.career.resume);
      expect(String(career(c))).toContain("Ahmed-Jola-Resume.pdf");
    });
    it("verify renders fourteen rows, all noopener", () => {
      const s = String(verify(c));
      expect(s.match(/class="verify-row"/g)).toHaveLength(14);
      expect(s.match(/rel="noopener"/g)!.length).toBeGreaterThanOrEqual(14);
    });
    it("footer carries the three strings", () => {
      const s = String(footer(c));
      for (const t of [c.footer.left, c.footer.mid, c.footer.right]) expect(s).toContain(t);
    });
  });
}
