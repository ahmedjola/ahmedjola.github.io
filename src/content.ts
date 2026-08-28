import { readFileSync } from "node:fs";
import { z } from "zod";

const Pair = z.tuple([z.string(), z.string()]);

const Product = z.object({
  key: z.string(), code: z.string(), name: z.string(), store: z.string(), sub: z.string(), line: z.string(),
  version: z.string(), released: z.string(), rating: z.number().nullable(), id: z.string(),
  site: z.string(), repo: z.string().nullable(), icon: z.string(), shot: z.string(), figcap: z.string(),
  facts: z.array(Pair).length(4),
});

const Case = z.object({
  key: z.string(), code: z.string(), name: z.string(), tag: z.string(), status: z.string(), years: z.string(),
  size: z.string(), stack: z.array(z.string()), problem: z.string(), built: z.string(), impact: z.string(),
  shot: z.string().optional(), schematic: z.enum(["mc360", "crm", "ai", "audit"]).optional(),
});

export const ContentSchema = z.object({
  meta: z.object({ title: z.string(), description: z.string(), url: z.string(), lastUpdated: z.string() }),
  labels: z.record(z.string(), z.string()),
  nav: z.object({
    chip: z.string(), sheet: z.string(), toggle: z.string(), toggleHref: z.string(),
    items: z.array(z.object({ id: z.string(), text: z.string() })).length(5),
  }),
  hero: z.object({
    kicker: z.string(), name: z.string(), titleA: z.string(), titleB: z.string(), line: z.string(),
    primary: z.string(), ghost: z.string(), portrait: z.string(), figcap: z.string(), side: z.string(), foot: z.string(),
    proof: z.array(z.object({ label: z.string(), n: z.string(), unit: z.string(), sub: z.string(), href: z.string() })).length(4),
  }),
  productsSection: z.object({ num: z.string(), title: z.string() }),
  products: z.array(Product),
  opendxb: z.object({
    num: z.string(), title: z.string(),
    sdk: z.object({ figcap: z.string(), terminal: z.string(), headline: z.string(), line: z.string(), facts: z.array(Pair).length(4), repo: z.string(), npm: z.string(), docs: z.string(), repoLabel: z.string(), npmLabel: z.string(), docsLabel: z.string() }),
    game: z.object({ title: z.string(), figcap: z.string(), shot: z.string(), thumb: z.string(), url: z.string(), headline: z.string(), line: z.string(), ways: z.array(z.object({ k: z.string(), t: z.string(), d: z.string() })).length(3), facts: z.array(Pair).length(2), play: z.string(), guide: z.string(), guideUrl: z.string(), unofficial: z.string() }),
  }),
  huspy: z.object({
    num: z.string(), title: z.string(), headline: z.string(), line: z.string(), facts: z.array(Pair).length(4),
    indexLabel: z.string(), cases: z.array(Case), footer: z.string(), footerRight: z.string(),
  }),
  career: z.object({
    num: z.string(), title: z.string(),
    jobs: z.array(z.object({ dates: z.string(), company: z.string(), role: z.string(), desc: z.string() })).length(4),
    certsLabel: z.string(), certs: z.array(z.object({ name: z.string(), id: z.string() })).length(3), verifyLine: z.string(),
    eduLabel: z.string(), degree: z.string(), school: z.string(), resume: z.string(), resumeFile: z.string().nullable(),
  }),
  verify: z.object({
    num: z.string(), title: z.string(), headline: z.string(), line: z.string(), contactLabel: z.string(),
    city: z.string(), email: z.string(), linkedin: z.string(),
    rows: z.array(z.object({ kind: z.string(), name: z.string(), url: z.string() })),
  }),
  footer: z.object({ left: z.string(), mid: z.string(), right: z.string() }),
});

export type Content = z.infer<typeof ContentSchema>;

/** Key paths that legitimately stay Latin in the Arabic content (data, not copy). */
export const LATIN_KEY_PATTERNS: RegExp[] = [
  /^meta\./,
  /\.(id|key|code|version|released|rating|site|repo|icon|shot|thumb|figcap|years|size|url|href|toggleHref|resumeFile|schematic|linkedin|email|npm|docs|guideUrl|terminal|portrait|company|chip|n)$/,
  /\.stack\.\d+$/,
  /^labels\.(appStore|github|device)$/,
  /^products\.\d+\.(name|store)$/,
  /^career\.certs\.\d+\.(name|id)$/,
  /^verify\.rows\.\d+\.(name|url|kind)$/,
  /^opendxb\.(title|game\.title)$/,
];

let fallbacks: string[] = [];

function merge(base: unknown, over: unknown, path = ""): unknown {
  if (Array.isArray(base)) {
    const o = Array.isArray(over) ? over : [];
    return base.map((v, i) => merge(v, o[i], `${path}.${i}`));
  }
  if (base && typeof base === "object") {
    const out: Record<string, unknown> = {};
    const o = (over && typeof over === "object" ? over : {}) as Record<string, unknown>;
    for (const k of Object.keys(base as Record<string, unknown>)) {
      out[k] = merge((base as Record<string, unknown>)[k], o[k], path ? `${path}.${k}` : k);
    }
    return out;
  }
  if (over === undefined || over === null) { fallbacks.push(path); return base; }
  return over;
}

function readJson(name: string): unknown {
  return JSON.parse(readFileSync(new URL(`../content/${name}.json`, import.meta.url), "utf8"));
}

export function loadContent(lang: "en" | "ar"): Content {
  const en = readJson("en");
  if (lang === "en") return ContentSchema.parse(en);
  fallbacks = [];
  return ContentSchema.parse(merge(en, readJson("ar")));
}

/** Every key path where the Arabic content fell back to English on the last `loadContent("ar")`. */
export function fallbackKeys(): string[] {
  loadContent("ar");
  return [...fallbacks];
}
