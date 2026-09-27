# W4H – Watch 4 Health

Marketing site for **W4H**, Preadico's system for continuous patient monitoring. It is a single Czech landing page built with [Astro](https://astro.build) and published to GitHub Pages.

**Live site:** https://etylsarin.github.io/w4h/

## Getting started

Requires Node.js 22.12 or newer (see `.nvmrc`).

```sh
npm install
npm run dev
```

The dev server runs at http://localhost:4321/w4h/. The `/w4h/` base path matches where GitHub Pages serves the site.

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload          |
| `npm run build`   | Build the static site into `dist/`            |
| `npm run preview` | Serve the built `dist/` locally               |
| `npm run check`   | Type-check `.astro` and TypeScript files      |

## Project structure

```text
src/
├── pages/index.astro      # the page: lists the sections in order
├── layouts/BaseLayout.astro  # <head>, fonts, header/footer, scroll reveal + parallax
├── sections/              # one component per page section (Hero, Solutions, Rhythm, Contact…)
├── components/            # shared building blocks (Header, Footer, Icon, Vis, SolutionDetail…)
├── data/                  # navigation, contact details, sample readings for the 15-minute strip
├── scripts/dom.ts         # small DOM helpers shared by the component scripts
├── assets/img/            # SVG illustrations (hashed and base-path aware at build time)
└── styles/global.css      # all styles: tokens, components, sections, responsive rules
public/favicon.svg
```

- **Text** lives in the section components under `src/sections/`. Repeated items like features, steps and devices are arrays at the top of each file.
- **Illustrations** are positioned inside `<Vis>` compositions with percentage coordinates (`x`, `y`, `w`) taken from the design.
- **Interactivity** is plain TypeScript in each component's `<script>` tag, and every script respects `prefers-reduced-motion`. The site stays fully readable with JavaScript disabled.
- **Fonts** (DM Serif Display, Manrope) are set up in `astro.config.mjs`. Astro downloads them at build time and serves them from the site, so visitors' browsers never contact Google.

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which type-checks, builds and publishes the site to GitHub Pages. You can also start it by hand from the Actions tab.

One-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**.

The workflow passes the Pages URL and base path to the build. If you add a custom domain in the Pages settings, the site will be built for the domain root, with no code change needed.

## Open items from the design template

- **The demo request form does not send anything yet.** It validates input and then simulates a successful submission. GitHub Pages has no backend, so the form needs a form service or an API endpoint wired into the script in `src/sections/Contact.astro`.
- **Only the Czech version exists.** The CZ/EN switch changes state and fires a `w4h:langchange` event, but there is no English content.
- **The footer shows placeholder slots** for the Preadico and Scalesoft logos (waiting for vector versions). The legal links (privacy, cookies, legal information) point to `#`.
- **The MDR certification wording** in the trust strip still needs to be confirmed by the client.
