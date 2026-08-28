import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { loadContent, fallbackKeys, LATIN_KEY_PATTERNS } from "../src/content";

const en = loadContent("en");
const ar = loadContent("ar");

describe("content", () => {
  it("has four products, six cases, fourteen verify rows", () => {
    expect(en.products).toHaveLength(4);
    expect(en.huspy.cases).toHaveLength(6);
    expect(en.verify.rows).toHaveLength(14);
  });

  it("contains no em dash and no placeholder tokens", () => {
    for (const c of [en, ar]) {
      const s = JSON.stringify(c);
      expect(s.includes("—")).toBe(false);
      expect(/\[[A-Z ]+\]/.test(s)).toBe(false);
    }
  });

  it("references only images that exist in public/img", () => {
    const imgs = [
      ...en.products.flatMap(p => [p.icon, p.shot]),
      ...en.huspy.cases.map(c => c.shot).filter((s): s is string => Boolean(s)),
      en.hero.portrait, en.opendxb.game.shot, en.opendxb.game.thumb,
    ];
    for (const i of imgs) expect(existsSync(`public/img/${i}`), i).toBe(true);
  });

  it("uses absolute https URLs in verify rows and product repos", () => {
    for (const r of en.verify.rows) expect(r.url.startsWith("https://"), r.url).toBe(true);
    for (const p of en.products) if (p.repo) expect(p.repo.startsWith("https://"), p.repo).toBe(true);
  });

  it("every case has exactly one of shot or schematic", () => {
    for (const c of en.huspy.cases) expect(Boolean(c.shot) !== Boolean(c.schematic), c.key).toBe(true);
  });

  it("translates every Arabic key that is not Latin-only data", () => {
    const untranslated = fallbackKeys().filter(k => !LATIN_KEY_PATTERNS.some(p => p.test(k)));
    expect(untranslated).toEqual([]);
  });

  it("keeps Arabic strings Arabic (no reversed-Latin fakes) for the hero and section titles", () => {
    for (const s of [ar.hero.name, ar.hero.titleA, ar.hero.line, ar.productsSection.title, ar.huspy.title, ar.career.title, ar.verify.title]) {
      expect(/[؀-ۿ]/.test(s), s).toBe(true);
    }
  });
});
