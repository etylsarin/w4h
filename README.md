# W4H – Watch 4 Health

Marketing site for **W4H**, Preadico's system for continuous patient monitoring. It is a one-page site in Czech and English, built with [Astro](https://astro.build) and published to GitHub Pages.

**Live site:** https://etylsarin.github.io/w4h/ (Czech) · https://etylsarin.github.io/w4h/en/ (English)

## Getting started

Requires Node.js 22.12 or newer (see `.nvmrc`).

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:4321/w4h/ (English at `/w4h/en/`). The `/w4h/` base path matches where GitHub Pages serves the site.

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload          |
| `npm run build`   | Build the static site into `dist/`            |
| `npm run preview` | Serve the built `dist/` locally               |
| `npm run check`   | Type-check `.astro` and TypeScript files      |

## Project structure

```text
src/
├── pages/[...locale].astro   # the page, built once per language; lists the sections in order
├── i18n/                  # translations: cs.json, en.json and the helpers in index.ts
├── layouts/BaseLayout.astro  # <head>, fonts, hreflang links, header/footer, scroll reveal + parallax
├── sections/              # one component per page section (Hero, Solutions, Rhythm, Contact…)
├── components/            # shared building blocks (Header, Footer, Icon, Vis, SolutionDetail…)
├── data/                  # navigation anchors, contact details, sample readings for the 15-minute strip
├── scripts/dom.ts         # small DOM helpers shared by the component scripts
├── assets/img/            # SVG illustrations (hashed and base-path aware at build time)
└── styles/global.css      # all styles: tokens, components, sections, responsive rules
public/favicon.svg
```

- **Text** lives in `src/i18n/*.json` (see [Languages](#languages)). The section components under `src/sections/` hold only markup and non-text data such as images, icons and positions.
- **Illustrations** are positioned inside `<Vis>` compositions with percentage coordinates (`x`, `y`, `w`) taken from the design.
- **Interactivity** is plain TypeScript in each component's `<script>` tag, and every script respects `prefers-reduced-motion`. The site stays fully readable with JavaScript disabled.
- **Fonts** (DM Serif Display, Manrope) are set up in `astro.config.mjs`. Astro downloads them at build time and serves them from the site, so visitors' browsers never contact Google.

## Languages

The site is built once per language from the same components:

| Language | URL       | Translations         |
| -------- | --------- | -------------------- |
| Czech    | `/w4h/`   | `src/i18n/cs.json`   |
| English  | `/w4h/en/`| `src/i18n/en.json`   |

- **Editing text:** change the JSON files. They are plain key/value JSON, so they can be edited by hand or loaded into any translation tool. `cs.json` is the reference: `npm run check` fails if another language is missing a key.
- **Placeholders** in `{braces}` (for example `"{value} bpm"`) are filled in by the code. Keep them in the translation, but you can move them within the sentence.
- **Language switch:** the CZ/EN switch in the header links to the same page in the other language and keeps the current section (`#anchor`). Each page declares its language versions with `hreflang` links for search engines.
- **Adding a language:** add `src/i18n/<code>.json`, register it in `src/i18n/index.ts` (the dictionary and its switch label), and add the code to `i18n.locales` in `astro.config.mjs`. The page is then built at `/<code>/`. The switch's sliding pill is styled for two languages, so a third one also needs a small CSS change.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which type-checks, builds and publishes the site to GitHub Pages. You can also start it by hand from the Actions tab.

One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**.

The workflow passes the Pages URL and base path to the build. If you add a custom domain in the Pages settings, the site will be built for the domain root, with no code change needed.

## Open items from the design template

- **The demo request form does not send anything yet.** It validates input and then simulates a successful submission. GitHub Pages has no backend, so the form needs a form service or an API endpoint wired into the script in `src/sections/Contact.astro`.
- **The UI illustrations are in Czech on both pages.** Text is drawn inside `ui-virtual-ward-tablet.svg`, `ui-ecg-report-tablet.svg`, `ui-patient-app-phone.svg` and `seal-mdr-ring.svg`, so the English page needs English versions of these images.
- **The footer shows placeholder slots** for the Preadico and Scalesoft logos (waiting for vector versions). The legal links (privacy, cookies, legal information) point to `#`.
- **The MDR certification wording** in the trust strip still needs to be confirmed by the client.
