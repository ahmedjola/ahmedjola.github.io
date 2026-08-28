import { raw, Raw, esc } from "./html";

const INK = "#10243F", ORANGE = "#E8590C", TER = "#5B6B80";

export type SchematicKind = "mc360" | "crm" | "ai" | "audit";

const LABELS: Record<SchematicKind, string> = {
  mc360: "Block diagram of MC360: six LWC surfaces over Apex controllers over Salesforce data",
  crm: "Block diagram of Primary Hub: six LWC modules over shared Apex services over flows and triggers",
  ai: "Flow of the AI lead qualification pipeline from new lead to lead updated, with two retry tiers",
  audit: "Flow of the access audit from three SOQL exports through Python analysis to PDF and XLSX reports",
};

function box(x: number, y: number, w: number, hh: number, t: string, sub = ""): string {
  let o = `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="#FFFFFF" stroke="${INK}" stroke-width="1.5"/>`;
  o += `<text x="${x + w / 2}" y="${y + hh / 2 - (sub ? 4 : -4)}" text-anchor="middle" font-family="Space Grotesk, Helvetica Neue, Arial, sans-serif" font-size="13" font-weight="700" fill="${INK}">${esc(t)}</text>`;
  if (sub) o += `<text x="${x + w / 2}" y="${y + hh / 2 + 12}" text-anchor="middle" font-family="JetBrains Mono, SF Mono, Menlo, monospace" font-size="9.5" fill="${TER}">${esc(sub)}</text>`;
  return o;
}

const arrow = (id: string) => (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ORANGE}" stroke-width="1.5" marker-end="url(#${id})"/>`;

const note = (y: number, t: string): string =>
  `<text x="10" y="${y}" font-family="JetBrains Mono, SF Mono, Menlo, monospace" font-size="9" letter-spacing="1" fill="${TER}">${esc(t)}</text>`;

export function schematic(kind: SchematicKind): Raw {
  const id = `ah-${kind}`;
  const a = arrow(id);
  let s = "", hgt = 0;
  if (kind === "mc360") {
    s += box(10, 10, 160, 50, "KPI cards", "leads · SLA · conversion") + box(180, 10, 160, 50, "Leads board", "priority · source") + box(350, 10, 160, 50, "SLA countdown", "per lead, live");
    s += box(10, 90, 160, 50, "Activity feed", "calls · tasks · notes") + box(180, 90, 160, 50, "Source chart", "campaign attribution") + box(350, 90, 160, 50, "Task reassign", "one tap");
    s += box(60, 180, 400, 50, "Apex controllers", "cacheable · 3 classes · skeleton loaders") + box(60, 260, 400, 50, "Salesforce data", "Lead · Opportunity · Task · SLA fields");
    s += a(90, 140, 150, 180) + a(260, 140, 260, 180) + a(430, 140, 370, 180) + a(260, 230, 260, 260);
    hgt = 320;
  } else if (kind === "crm") {
    const mods = ["Kanban", "Chat", "Calendar", "Clock in/out", "Search", "Commission"];
    mods.forEach((m, i) => { s += box(10 + (i % 3) * 170, 10 + Math.floor(i / 3) * 80, 160, 50, m, m === "Chat" ? "LWC · platform events" : "LWC"); });
    s += box(10, 180, 500, 50, "Shared Apex services", "32 classes · lead conversion with team split") + box(10, 260, 500, 50, "Flows, triggers, visit log", "6 flows · 4 platform events · scheduled cleanup");
    s += a(90, 140, 90, 180) + a(260, 140, 260, 180) + a(430, 140, 430, 180) + a(260, 230, 260, 260);
    hgt = 320;
  } else if (kind === "ai") {
    s += box(10, 20, 115, 50, "New lead", "trigger") + box(140, 20, 115, 50, "Platform event", "published") + box(270, 20, 115, 50, "Queueable", "retries · backoff") + box(400, 20, 115, 50, "AI callout", "REST, scored");
    s += box(140, 120, 115, 50, "Scheduled", "catches misses") + box(270, 120, 115, 50, "Monitor", "LWC, 30 s") + box(400, 120, 115, 50, "Lead updated", "score · next step");
    s += a(125, 45, 140, 45) + a(255, 45, 270, 45) + a(385, 45, 400, 45) + a(457, 70, 457, 120) + a(400, 145, 385, 145) + a(197, 120, 197, 70);
    s += note(205, "ASYNC END TO END · TWO RETRY TIERS · DUBAI CALLING HOURS");
    hgt = 220;
  } else {
    s += box(10, 10, 140, 50, "Login history", "SOQL export") + box(10, 80, 140, 50, "Visit log", "SOQL export") + box(10, 150, 140, 50, "Ownership fields", "6 per application");
    s += box(200, 80, 140, 50, "Python analysis", "join · classify") + box(370, 80, 140, 50, "PDF + XLSX", "per team · per user");
    s += a(150, 35, 200, 100) + a(150, 105, 200, 105) + a(150, 175, 200, 110) + a(340, 105, 370, 105);
    s += note(235, "WHO SAW WHAT, WHEN, AND WHETHER THEY SHOULD HAVE");
    hgt = 250;
  }
  const defs = `<defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="${ORANGE}"/></marker></defs>`;
  return raw(`<svg class="schematic" viewBox="0 0 520 ${hgt}" role="img" aria-label="${esc(LABELS[kind])}" xmlns="http://www.w3.org/2000/svg">${defs}${s}</svg>`);
}
