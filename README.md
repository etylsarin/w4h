# W4H – Watch 4 Health

Marketing site for **W4H**, Preadico's system for continuous patient monitoring, in Czech and English. Built with [Astro](https://astro.build) and published to GitHub Pages.

**Live site:** https://etylsarin.github.io/w4h/ (Czech) · https://etylsarin.github.io/w4h/en/ (English)

| Page | Czech | English |
| --- | --- | --- |
| Home | `/` | `/en/` |
| W4H Hospital | `/nemocnice/` | `/en/hospital/` |
| W4H Clinic | `/ambulance/` | `/en/clinic/` |
| W4H Home & Long Term Care | `/domaci-a-dlouhodoba-pece/` | `/en/home-and-long-term-care/` |
| Privacy policy | `/ochrana-osobnich-udaju/` | `/en/privacy-policy/` |
| Legal information | `/pravni-informace/` | `/en/legal-information/` |

## Getting started

Requires Node.js 22.12 or newer (see `.nvmrc`).

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:4321/w4h/. The `/w4h/` base path matches where GitHub Pages serves the site.

| Command               | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `npm run dev`         | Start the dev server with hot reload                            |
| `npm run build`       | Build the static site into `dist/`                              |
| `npm run preview`     | Serve the built `dist/` locally                                 |
| `npm run check`       | Type-check `.astro` and TypeScript files, and the translations  |
| `npm run copy:export` | Export all copy to `w4h-copy-review.docx` for copywriter review |

## Project structure

```text
src/
├── pages/[...path].astro     # builds every page in every language (slugs in i18n/pages.ts)
├── templates/                # page layouts: HomePage, SolutionPage, LegalPage
├── layouts/BaseLayout.astro  # <head> (meta, hreflang, Open Graph, structured data), header, footer
├── sections/                 # one component per page section (Hero, Solutions, Rhythm, Contact…)
├── components/               # shared building blocks (Header, Footer, Breadcrumb, Vis, SolutionDetail…)
├── i18n/                     # translations (cs.json, en.json), page slugs (pages.ts), URL helpers (routes.ts),
│                             # per-language illustrations (images.ts)
├── content/legal/<lang>/     # privacy policy and legal information, as Markdown
├── data/                     # menu anchors, company details, sample readings for the 15-minute chart
├── scripts/dom.ts            # small DOM helpers shared by the component scripts
├── assets/img/               # illustrations and logos (hashed and base-path aware at build time)
└── styles/global.css         # all styles: tokens, components, sections, responsive rules
public/                       # favicon and the link preview image (og-image.png)
scripts/                      # copy export for review (export-copy.mjs, copy-review-notes.json)
```

- **Text** lives in `src/i18n/*.json`, and the legal pages in `src/content/legal/`. Components hold only markup and non-text data such as images, icons and positions.
- **Illustrations** are positioned inside `<Vis>` compositions with percentage coordinates (`x`, `y`, `w`) taken from the design. The four with text drawn in them (virtual ward, ECG report, patient app, MDR seal) have an English copy, `*-en.svg`, chosen per language in `src/i18n/images.ts`. When one of these illustrations changes, update its English copy too.
- **Interactivity** is plain TypeScript in each component's `<script>` tag, and every script respects `prefers-reduced-motion`. The site stays readable with JavaScript disabled.
- **Fonts** (DM Serif Display, Manrope) are set up in `astro.config.mjs`. Astro downloads them at build time and serves them from the site, so visitors' browsers never contact Google.

## Languages and pages

- **Editing text:** change the JSON files in `src/i18n/`. They are plain key/value JSON that can be edited by hand or loaded into a translation tool. `cs.json` is the reference: `npm run check` fails if another language misses a key. Placeholders in `{braces}` are filled in by the code; keep them in the translation.
- **Legal pages:** one Markdown file per page and language in `src/content/legal/<lang>/`. Links between pages are relative (`../privacy-policy/`).
- **URLs:** every page has a slug per language in `src/i18n/pages.ts`. The language switch, `hreflang` links, sitemap and menus all use it. The switch keeps the current section (`#anchor`) when changing language.
- **Adding a language:** add `src/i18n/<code>.json` and `src/content/legal/<code>/`, register the language in `src/i18n/index.ts`, `src/i18n/pages.ts` and `i18n.locales` in `astro.config.mjs`. The switch's sliding pill is styled for two languages, so a third one also needs a small CSS change.

## Copy review

`npm run copy:export` writes `w4h-copy-review.docx`: every text on the site in Czech and English side by side, grouped by page, with a comments column, followed by the legal texts and the text inside the illustrations. The opening sections ("Please confirm", "SEO suggestions") come from `scripts/copy-review-notes.json`. The file is not committed; regenerate it whenever the copy changes.

## SEO

- Each page has its own title, description, canonical URL and `hreflang` links to its other language version.
- Open Graph tags with `public/og-image.png` (1200 × 630) for link previews.
- Structured data (schema.org): the organisation (Preadico s.r.o.) and website on every page, plus breadcrumbs on solution and legal pages.
- `sitemap-index.xml` (with language alternates) and `robots.txt` are generated at build time. Search engines only read `robots.txt` at the root of a domain, so it takes effect once the site has its own domain.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which type-checks, builds and publishes the site to GitHub Pages. You can also start it by hand from the Actions tab.

One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**.

The workflow passes the Pages URL and base path to the build. If you add a custom domain in the Pages settings, the site will be built for the domain root, with no code change needed. GitHub Pages caches files for only 10 minutes and this cannot be configured; a host with longer cache times would remove the only remaining PageSpeed suggestion.

## Open items

- **The demo request form does not send anything yet.** It validates input and then simulates a successful submission. GitHub Pages has no backend, so the form needs a form service or an API endpoint wired into the script in `src/sections/Contact.astro`. The privacy policy must then name that service.
- **The legal texts are proposals** (privacy policy, legal information). They need a legal check, including the retention period for demo requests. The site uses no cookies or analytics; adding any later needs a consent banner and an update of the privacy policy.
- **The MDR certification wording** in the trust strip and hero badge needs to be confirmed by the client.
