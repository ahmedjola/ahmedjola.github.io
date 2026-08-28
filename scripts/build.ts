import { mkdirSync, writeFileSync, cpSync, readFileSync, rmSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderPage } from "../src/page";
import { loadContent } from "../src/content";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

export async function build(out = "dist"): Promise<void> {
  const outDir = `${ROOT}${out}`;
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(`${outDir}/ar`, { recursive: true });
  mkdirSync(`${outDir}/assets`, { recursive: true });
  cpSync(`${ROOT}public`, outDir, { recursive: true });

  const pages: Record<string, string> = { "index.html": renderPage("en"), "ar/index.html": renderPage("ar") };
  for (const [f, html] of Object.entries(pages)) {
    if (/\[[A-Z ]+\]/.test(html)) throw new Error(`placeholder left in ${f}`);
    if (html.includes("—")) throw new Error(`em dash in ${f}`);
    for (const m of html.matchAll(/src="\/img\/([^"]+)"/g)) {
      if (!existsSync(`${ROOT}public/img/${m[1]}`)) throw new Error(`missing image ${m[1]} referenced by ${f}`);
    }
    writeFileSync(`${outDir}/${f}`, html);
  }
  writeFileSync(`${outDir}/assets/site.css`, readFileSync(`${ROOT}src/styles.css`));
  writeFileSync(`${outDir}/assets/site.js`, readFileSync(`${ROOT}src/client.js`));

  const c = loadContent("en");
  const urls = [`${c.meta.url}/`, `${c.meta.url}/ar/`].map(u => `<url><loc>${u}</loc><lastmod>${c.meta.lastUpdated}</lastmod></url>`).join("");
  writeFileSync(`${outDir}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
  writeFileSync(`${outDir}/.nojekyll`, "");
  console.log(`built ${out}`);
}

if (process.argv[1] && /build\.ts$/.test(process.argv[1])) {
  build(process.argv[2]).catch(e => { console.error(e.message); process.exit(1); });
}
