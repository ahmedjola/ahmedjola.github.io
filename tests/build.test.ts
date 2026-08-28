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

  it("every referenced image exists in the output", () => {
    const html = readFileSync(`${out}/index.html`, "utf8");
    for (const m of html.matchAll(/src="\/img\/([^"]+)"/g)) expect(existsSync(`${out}/img/${m[1]}`), m[1]).toBe(true);
  });
});
