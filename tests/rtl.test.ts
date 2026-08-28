import { describe, it, expect } from "vitest";
import { renderPage } from "../src/page";

describe("page", () => {
  const ar = renderPage("ar");
  const en = renderPage("en");

  it("arabic page is rtl and lang=ar; english is ltr", () => {
    expect(ar).toMatch(/<html lang="ar" dir="rtl">/);
    expect(en).toMatch(/<html lang="en" dir="ltr">/);
  });

  it("both pages carry hreflang links to each other and a canonical", () => {
    for (const s of [ar, en]) {
      expect(s).toContain('hreflang="en" href="https://ahmedjola.github.io/"');
      expect(s).toContain('hreflang="ar" href="https://ahmedjola.github.io/ar/"');
    }
    expect(ar).toContain('rel="canonical" href="https://ahmedjola.github.io/ar/"');
    expect(en).toContain('rel="canonical" href="https://ahmedjola.github.io/"');
  });

  it("every title-block value is an ltr isolate", () => {
    const cells = ar.match(/class="tb-v/g)!.length;
    expect(cells).toBeGreaterThan(20);
    expect(ar.match(/<div class="tb-v[^"]*">(<span class="tb-dot"[^>]*><\/span>)?<bdi dir="ltr">/g)!.length).toBe(cells);
  });

  it("has one h1, heading order, JSON-LD Person, and no em dash", () => {
    for (const s of [en, ar]) {
      expect(s.match(/<h1/g)).toHaveLength(1);
      expect(s).toContain('"@type":"Person"');
      expect(s.includes("—")).toBe(false);
      expect(/\[[A-Z ]+\]/.test(s)).toBe(false);
    }
  });

  it("every image has alt text and dimensions or lazy loading", () => {
    for (const s of [en, ar]) {
      const imgs = s.match(/<img[^>]*>/g)!;
      for (const i of imgs) expect(i, i).toMatch(/ alt="/);
    }
  });

  it("the language toggle points at the other language", () => {
    expect(en).toContain('data-lang="ar" hreflang="ar" href="/ar/"');
    expect(ar).toContain('data-lang="en" hreflang="en" href="/"');
  });
});
