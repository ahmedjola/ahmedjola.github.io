import { describe, it, expect, afterAll } from "vitest";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { build } from "../scripts/build";

const out = "dist-test";

describe("build", () => {
  afterAll(() => rmSync(out, { recursive: true, force: true }));

  it("writes both pages, assets, sitemap, robots and the resume", async () => {
    await build(out);
    for (const f of ["index.html", "ar/index.html", "assets/site.css", "assets/site.js", "sitemap.xml", "robots.txt", ".nojekyll", "favicon.svg", "img/headshot.jpg", "Ahmed-Jola-Resume.pdf"]) {
      expect(existsSync(`${out}/${f}`), f).toBe(true);
    }
  });

  it("every internal anchor resolves to an id on the same page", () => {
    for (const f of ["index.html", "ar/index.html"]) {
      const html = readFileSync(`${out}/${f}`, "utf8");
      const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]);
      expect(anchors.length).toBeGreaterThan(10);
      for (const a of anchors) expect(html.includes(`id="${a}"`), `${f} #${a}`).toBe(true);
    }
  });

  it("writes the Noggin game, privacy and support pages, listed in the sitemap", () => {
    const sitemap = readFileSync(`${out}/sitemap.xml`, "utf8");
    for (const [f, path] of [["noggin/index.html", "/noggin/"], ["noggin/privacy/index.html", "/noggin/privacy/"], ["noggin/support/index.html", "/noggin/support/"]]) {
      const html = readFileSync(`${out}/${f}`, "utf8");
      expect(html, f).toContain("ahmedjola@icloud.com");
      expect(html, f).toContain("Made in Dubai");
      expect(html, f).not.toContain("site.js");
      expect(html, f).not.toMatch(/[\u2013\u2014]/);
      expect(sitemap).toContain(`https://ahmedjola.github.io${path}`);
    }
    const privacy = readFileSync(`${out}/noggin/privacy/index.html`, "utf8");
    for (const s of ["Firebase Analytics", "Crashlytics", "14 months", "90 days", "GameSave", "Game Center", "installed from the App Store"]) expect(privacy).toContain(s);
    const support = readFileSync(`${out}/noggin/support/index.html`, "utf8");
    expect(support).toContain("Restore");
  });

  it("every referenced image exists in the output", () => {
    const html = readFileSync(`${out}/index.html`, "utf8");
    for (const m of html.matchAll(/src="\/img\/([^"]+)"/g)) expect(existsSync(`${out}/img/${m[1]}`), m[1]).toBe(true);
  });
});
