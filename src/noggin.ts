import { h, raw, Raw, esc } from "./html";
import { label, kicker, btn, titleBlock } from "./primitives";

/** Noggin: Lost Face. A game page plus the privacy policy and support pages the App Store links to. */

export const NOGGIN = {
  name: "Noggin: Lost Face",
  email: "ahmedjola@icloud.com",
  updated: "7 October 2026",
  updatedIso: "2026-10-07",
  pages: {
    game: "noggin/index.html",
    privacy: "noggin/privacy/index.html",
    support: "noggin/support/index.html",
  },
} as const;

export type NogginPage = keyof typeof NOGGIN.pages;

const FONTS = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap";
const PATHS: Record<NogginPage, string> = { game: "/noggin/", privacy: "/noggin/privacy/", support: "/noggin/support/" };
const SHEET: Record<NogginPage, string> = { game: "1", privacy: "2", support: "3" };

/** Inline text with `[label](url)` links; everything else is escaped. */
function t(s: string): Raw {
  let out = "";
  let last = 0;
  for (const m of s.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    out += esc(s.slice(last, m.index));
    const href = m[2];
    const ext = /^https?:/.test(href) ? ' rel="noopener" target="_blank"' : "";
    out += `<a href="${esc(href)}"${ext}>${esc(m[1])}</a>`;
    last = m.index! + m[0].length;
  }
  return raw(out + esc(s.slice(last)));
}

const MAIL = `[${NOGGIN.email}](mailto:${NOGGIN.email})`;

const p = (s: string): Raw => h`<p>${t(s)}</p>`;
const ul = (items: string[]): Raw => h`<ul>${items.map(i => h`<li>${t(i)}</li>`)}</ul>`;
const ol = (items: string[]): Raw => h`<ol>${items.map(i => h`<li>${t(i)}</li>`)}</ol>`;

function block(id: string, num: string, title: string, body: Raw[]): Raw {
  return h`<section class="nk-block" aria-labelledby="${id}">
  <div class="nk-block-head">${kicker(num)}<h2 id="${id}">${title}</h2></div>
  <div class="nk-prose">${body}</div>
</section>`;
}

function header(page: NogginPage): Raw {
  const items: [NogginPage, string][] = [["game", "Game"], ["privacy", "Privacy"], ["support", "Support"]];
  return h`<header class="nav nk-nav">
  <div class="nav-left">
    <a class="nav-chip mono" href="/">AJ / 2026</a>
    <span class="nav-sheet mono">NOGGIN · SHEET ${SHEET[page]} OF 3</span>
  </div>
  <nav class="nk-links" aria-label="Noggin">
    ${items.map(([k, text]) => h`<a href="${PATHS[k]}"${k === page ? raw(' aria-current="page"') : ""}>${text}</a>`)}
  </nav>
</header>`;
}

function pageHead(num: string, title: string, right: string, lead: string): Raw {
  return h`<div class="nk-head">
  <div class="section-head"><div class="section-head-left">${kicker(num)}<h1 class="nk-title">${title}</h1></div>${label(right, "label-12")}</div>
  <p class="sheet-lead nk-lead">${t(lead)}</p>
</div>`;
}

function shell(page: NogginPage, title: string, description: string, body: Raw): string {
  const url = `https://ahmedjola.github.io${PATHS[page]}`;
  const doc = h`<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#F5F3EC">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="/assets/site.css">
<link rel="stylesheet" href="${FONTS}">
</head>
<body class="en nk">
${header(page)}
<main class="nk-main">
${body}
</main>
<footer class="site-footer mono"><span>Ahmed Jola · Noggin: Lost Face</span><span>Made in Dubai</span><span>Updated ${NOGGIN.updated}</span></footer>
</body>
</html>`;
  return "<!doctype html>\n" + String(doc) + "\n";
}

function gamePage(): string {
  const body = h`${pageHead("N-01", NOGGIN.name, "IPHONE · IPAD", "A wordless point-and-click puzzle game. A giant head sneezed his face off. You help him find his eyes, his nose and the rest of himself across five hand-drawn rooms.")}
<article class="sheet nk-sheet">
  ${titleBlock([
    { label: "Devices", value: "iPhone and iPad" },
    { label: "Price", value: "Rooms 1 and 2 free" },
    { label: "Length", value: "About 1 hour" },
    { label: "Status", value: "Not on the App Store yet", status: true },
  ])}
  <div class="sheet-content">
    <div class="nk-prose">
      ${p("There are no words in the game. You tap, drag and look closely. In the later rooms you also tilt the phone or lay it face down, and every one of those puzzles has a way to solve it by touch too.")}
      ${p("Rooms 1 and 2 are free. One purchase unlocks rooms 3 to 5. There are no ads, no account and no timers.")}
      ${p("Your progress saves in your own iCloud, so you can carry on from another iPhone or iPad signed in to the same Apple Account. Achievements are in Game Center.")}
      ${p("Questions or problems: email " + MAIL + ".")}
    </div>
    <div class="sheet-actions">
      ${btn("Support", { href: "/noggin/support/", primary: true })}
      ${btn("Privacy policy", { href: "/noggin/privacy/" })}
    </div>
  </div>
</article>`;
  return shell("game", "Noggin: Lost Face", "A wordless point-and-click puzzle game for iPhone and iPad by Ahmed Jola, made in Dubai.", body);
}

const DATA_ROWS: { type: string; what: string; why: string }[] = [
  { type: "Game events", what: "Which room you are in, which puzzle you solved or got wrong, hints used, settings you switched, and how long a room took, sent as a range such as \"under 5 minutes\". Only fixed short codes are sent, never free text.", why: "To see where players get stuck and fix those puzzles." },
  { type: "Purchase steps", what: "That the unlock screen was shown, that the buy button was tapped, the result (bought, cancelled or failed) and whether the game is unlocked. No payment details.", why: "To check that the unlock screen works." },
  { type: "Crash reports", what: "Where the game stopped, the device model, the iOS version and the game version.", why: "To find and fix crashes." },
  { type: "Install ID", what: "A random ID that Firebase creates for this install of the game. It is not your Apple Account and not the advertising ID. Deleting the game resets it.", why: "To count players without knowing who they are." },
  { type: "Country", what: "Worked out by Google from the connection's IP address. Google Analytics does not store the IP address itself.", why: "To see which countries play." },
];

function privacyPage(): string {
  const table = h`<div class="nk-table" role="table" aria-label="Data the game sends">
  <div class="nk-row nk-row-head" role="row"><span class="mono label" role="columnheader">Data</span><span class="mono label" role="columnheader">What it is</span><span class="mono label" role="columnheader">Why</span></div>
  ${DATA_ROWS.map(r => h`<div class="nk-row" role="row"><span class="nk-cell-type" role="cell">${r.type}</span><span role="cell">${r.what}</span><span role="cell" class="nk-why"><span class="mono label nk-why-label">Why </span>${r.why}</span></div>`)}
</div>`;

  const body = h`${pageHead("N-02", "Privacy policy", `EFFECTIVE ${NOGGIN.updatedIso}`, `This policy covers ${NOGGIN.name} for iPhone and iPad, made by Ahmed Jola in Dubai, United Arab Emirates. It describes what the game does with data, as the game is built today.`)}
<article class="sheet nk-sheet">
  <div class="sheet-content nk-doc">
    ${block("short", "01", "In short", [ul([
      "No account, no sign-up, no ads, and no tracking across other apps or websites.",
      "Analytics and crash reports are sent only from copies installed from the App Store. They are not linked to your name, email or Apple Account.",
      "Your progress is saved in your own iCloud. I cannot see it.",
      "Apple runs purchases and Game Center. I never see your payment details or your Game Center identity.",
    ])])}
    ${block("sends", "02", "What the game sends", [
      p("Noggin uses Google Firebase Analytics and Firebase Crashlytics. Before either one starts, the game asks Apple whether this copy was installed from the App Store. If Apple does not confirm it, Firebase is not started at all on that launch. Copies from TestFlight, App Review, Xcode or the simulator send nothing."),
      p("When it does run, this is everything it sends:"),
      table,
      p("All of it is not linked to your identity and is not used for tracking. The game never collects your name, email, phone number, contacts, photos, precise location, the advertising ID, or your Game Center name or ID. It does not show the App Tracking Transparency prompt because it does not track you. Google Signals and ad personalization are turned off for Noggin."),
    ])}
    ${block("kept", "03", "How long it is kept", [ul([
      "Analytics events and analytics user data: 14 months, then Google deletes them.",
      "Crash reports: 90 days, then Firebase starts removing them.",
    ])])}
    ${block("who", "04", "Who handles it", [
      p("Google processes the analytics and crash data on my behalf as the provider of Firebase. Its terms are on [Firebase's privacy page](https://firebase.google.com/support/privacy). I do not sell this data, share it with advertisers, or combine it with data from anywhere else."),
    ])}
    ${block("saves", "05", "Your saved progress", [
      p("The game saves which rooms and puzzles you have finished, the hints you used and your play time. It saves through Apple's GameSave into your own iCloud, so you can continue on your other devices signed in to the same Apple Account. If iCloud is off, progress is saved on the device only. I cannot see or open your save."),
      p("Sound, haptics and hint settings are stored on the device and are not sent anywhere."),
      p("To delete your progress, delete the game, then remove Noggin's data from iCloud in the Settings app, under your Apple Account, iCloud, then storage."),
    ])}
    ${block("apple", "06", "Game Center and purchases", [
      p("If you are signed in to Game Center, the game reports your achievements to Apple. Game Center is run by Apple under [Apple's privacy policy](https://www.apple.com/legal/privacy/)."),
      p("The unlock for rooms 3 to 5 is an in-app purchase handled by Apple. I never see your card, your Apple Account or your name. Apple gives me sales reports with the country, date, price and refunds, without personal details."),
    ])}
    ${block("device", "07", "Motion and screenshots", [
      p("In rooms 3 to 5 the game reads the phone's motion, such as tilting it or laying it face down, to run some puzzles. This stays on the device and is never sent. In one room the game notices that you took a screenshot. It never opens the screenshot or your photo library."),
    ])}
    ${block("children", "08", "Children", [
      p("The game is rated 4+. It has no chat, no ads and no account, and the data above is the same for every player and is not linked to anyone."),
    ])}
    ${block("rights", "09", "Your choices", [
      p("Because the analytics and crash data are not linked to you, I cannot find one person's records in them. Deleting the game resets the install ID, and all records are deleted on the schedule above. For any question or request, email " + MAIL + "."),
    ])}
    ${block("changes", "10", "Changes", [
      p("If this policy changes, the new version will be posted on this page with a new effective date."),
    ])}
    ${block("contact", "11", "Contact", [
      p("Ahmed Jola, Dubai, United Arab Emirates. Email " + MAIL + "."),
    ])}
  </div>
</article>`;
  return shell("privacy", "Noggin Privacy Policy", "What Noggin: Lost Face collects, why, and for how long.", body);
}

function supportPage(): string {
  const body = h`${pageHead("N-03", "Support", "NOGGIN: LOST FACE", "Help with Noggin: Lost Face for iPhone and iPad.")}
<article class="sheet nk-sheet">
  <div class="sheet-content nk-doc">
    ${block("contact", "01", "Contact", [
      p("Email " + MAIL + "."),
      p("Please include your device (for example iPhone 16 or iPad Air), the iOS version and the room you were in. A screenshot or a screen recording helps."),
    ])}
    ${block("game", "02", "What the game is", [
      p("Noggin: Lost Face is a wordless point-and-click puzzle game. A giant head sneezed his face off, and you help him find it across five hand-drawn rooms. Rooms 1 and 2 are free, and one purchase unlocks rooms 3 to 5. A full play takes about an hour."),
      p("If you are stuck, a paper scrap in the bottom corner gets ready after a while. Tap it and the game draws a hint on the room. Every puzzle that uses tilting or laying the phone face down can also be solved by touch."),
    ])}
    ${block("restore", "03", "Restore your purchase", [
      ol([
        "Make sure the device is signed in to the App Store with the Apple Account you used to buy the unlock.",
        "Open Noggin and tap the Pause button in the top corner.",
        "Tap Restore. You may be asked to sign in to your Apple Account.",
      ]),
      p("On a new device the game usually unlocks by itself. Restore is there for when it does not. The unlock works with Family Sharing, so people in your Family Sharing group can unlock it the same way."),
    ])}
    ${block("devices", "04", "Your progress on another device", [
      p("Progress saves in your iCloud. Sign in to the same Apple Account on the other iPhone or iPad, keep iCloud turned on, and open Noggin. It picks up from the furthest point either device reached."),
    ])}
    ${block("refunds", "05", "Refunds", [
      p("Apple handles payments, so refunds are requested from Apple at [reportaproblem.apple.com](https://reportaproblem.apple.com)."),
    ])}
    ${block("privacy", "06", "Privacy", [
      p("What the game collects and why is in the [privacy policy](/noggin/privacy/)."),
    ])}
    ${block("credits", "07", "Credits", [
      p("Made in Dubai by Ahmed Jola."),
    ])}
  </div>
</article>`;
  return shell("support", "Noggin Support", "Contact, restoring the purchase and help for Noggin: Lost Face.", body);
}

export function renderNoggin(page: NogginPage): string {
  return page === "game" ? gamePage() : page === "privacy" ? privacyPage() : supportPage();
}
