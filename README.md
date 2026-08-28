# ahmedjola.github.io

Ahmed Jola, Software Engineer and Product Builder in Dubai. A static, bilingual (English at `/`, Arabic at `/ar/`) portfolio: four iPhone apps on the App Store, the opendxb open data layer and game, and six enterprise case studies from Huspy's Salesforce platform. Every claim on the page links to where it can be checked.

## Run it

```bash
npm ci
npm run check    # type-check, tests, build into dist/
npm run dev      # build, then serve dist/ locally
```

Node 20 or newer. No framework: `scripts/build.ts` renders `content/en.json` and `content/ar.json` through the templates in `src/` into plain HTML, one stylesheet and one small script.

## Change something

- Copy and data live in `content/en.json` (English) and `content/ar.json` (Arabic overrides, same shape). Latin-only values (versions, dates, IDs, domains, stacks) are kept once in the English file.
- Images live in `public/img/`. The resume is `public/Ahmed-Jola-Resume.pdf`.
- The build refuses to ship an em dash, a `[PLACEHOLDER]`, a missing image, an untranslated Arabic key or a dead internal anchor.

Push to `main` and GitHub Actions deploys `dist/` to GitHub Pages.
