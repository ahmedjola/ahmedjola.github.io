import { loadContent } from "./content";
import { h, raw } from "./html";
import { nav } from "./sections/nav";
import { hero } from "./sections/hero";
import { products } from "./sections/products";
import { opendxb } from "./sections/opendxb";
import { huspy } from "./sections/huspy";
import { career } from "./sections/career";
import { verify, footer } from "./sections/verify";

const FONTS = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap";

export function renderPage(lang: "en" | "ar"): string {
  const c = loadContent(lang);
  const dir = lang === "ar" ? "rtl" : "ltr";
  const base = c.meta.url;
  const self = lang === "ar" ? `${base}/ar/` : `${base}/`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ahmed Jola",
    jobTitle: "Software Engineer & Product Builder",
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
    url: base,
    sameAs: c.verify.rows.filter(r => ["LinkedIn", "GitHub", "App Store"].includes(r.kind)).map(r => r.url),
  };
  const doc = h`<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.meta.title}</title>
<meta name="description" content="${c.meta.description}">
<link rel="canonical" href="${self}">
<link rel="alternate" hreflang="en" href="${base}/">
<link rel="alternate" hreflang="ar" href="${base}/ar/">
<link rel="alternate" hreflang="x-default" href="${base}/">
<meta property="og:title" content="${c.meta.title}">
<meta property="og:description" content="${c.meta.description}">
<meta property="og:image" content="${base}/img/og.jpg">
<meta property="og:url" content="${self}">
<meta property="og:type" content="profile">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F5F3EC">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<link rel="preload" as="style" href="${FONTS}">
<link rel="stylesheet" href="${FONTS}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${FONTS}"><style>.nav-links{display:flex}</style></noscript>
<script type="application/ld+json">${raw(JSON.stringify(ld))}</script>
</head>
<body class="${lang === "ar" ? "ar" : "en"}">
${nav(c, lang)}
<main>
${hero(c)}
${products(c)}
${opendxb(c)}
${huspy(c)}
${career(c)}
${verify(c)}
</main>
${footer(c)}
<script src="/assets/site.js" defer></script>
</body>
</html>`;
  return "<!doctype html>\n" + String(doc) + "\n";
}
