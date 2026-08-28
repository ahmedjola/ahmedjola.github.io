/**
 * Render the built site to A4 PDFs with headless Chrome, using the print stylesheet.
 * Output: dist/Ahmed-Jola-Portfolio.pdf (English) and dist/ar/Ahmed-Jola-Portfolio-ar.pdf (Arabic).
 * Run after `npm run build`. Chrome is found via CHROME_PATH or common install locations.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DIST = join(ROOT, "dist");
const MIME: Record<string, string> = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".xml": "application/xml", ".txt": "text/plain" };

function chromePath(): string {
  const candidates = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium-browser", "/usr/bin/chromium"].filter(Boolean) as string[];
  const found = candidates.find(p => existsSync(p));
  if (!found) throw new Error("Chrome not found; set CHROME_PATH");
  return found;
}

async function serve(): Promise<{ port: number; close: () => void }> {
  const server = createServer(async (req, res) => {
    let p = normalize(decodeURIComponent((req.url ?? "/").split("?")[0]));
    if (p.endsWith("/")) p += "index.html";
    const file = join(DIST, p);
    try {
      const s = await stat(file);
      const target = s.isDirectory() ? join(file, "index.html") : file;
      res.writeHead(200, { "Content-Type": MIME[extname(target)] ?? "application/octet-stream" });
      res.end(await readFile(target));
    } catch {
      res.writeHead(404); res.end("not found");
    }
  });
  await new Promise<void>(r => server.listen(0, "127.0.0.1", () => r()));
  const port = (server.address() as { port: number }).port;
  return { port, close: () => server.close() };
}

function print(chrome: string, url: string, out: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ["--headless=new", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer", "--virtual-time-budget=15000", `--print-to-pdf=${out}`, url];
    const child = spawn(chrome, args, { stdio: "ignore" });
    child.on("exit", code => (code === 0 && existsSync(out) ? resolve() : reject(new Error(`chrome exited ${code} for ${url}`))));
    child.on("error", reject);
  });
}

export async function pdf(): Promise<void> {
  const chrome = chromePath();
  const { port, close } = await serve();
  try {
    await print(chrome, `http://127.0.0.1:${port}/`, join(DIST, "Ahmed-Jola-Portfolio.pdf"));
    await print(chrome, `http://127.0.0.1:${port}/ar/`, join(DIST, "ar", "Ahmed-Jola-Portfolio-ar.pdf"));
    console.log("pdf: dist/Ahmed-Jola-Portfolio.pdf, dist/ar/Ahmed-Jola-Portfolio-ar.pdf");
  } finally {
    close();
  }
}

if (process.argv[1] && /pdf\.ts$/.test(process.argv[1])) {
  pdf().catch(e => { console.error(e.message); process.exit(1); });
}
