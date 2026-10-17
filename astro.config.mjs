// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { hreflang, pageSlugs } from './src/i18n/pages.ts';

// GitHub Pages: the deploy workflow passes the origin and base path reported by
// actions/configure-pages, so switching to a custom domain needs no change here.
// The defaults below match https://etylsarin.github.io/w4h/ for local builds.
const site = process.env.SITE_ORIGIN || 'https://etylsarin.github.io';
const base = process.env.SITE_BASE_PATH ?? '/w4h';
const root = new URL(`${base.replace(/\/$/, '')}/`, site).href;

/** Sitemap entry with links to the same page in every language (slugs differ per language). */
function withLanguageLinks(/** @type {import('@astrojs/sitemap').SitemapItem} */ item) {
  const path = item.url.slice(root.length);
  const pageUrl = (/** @type {'cs' | 'en'} */ locale, /** @type {string} */ slug) =>
    root + [locale === 'cs' ? '' : locale, slug].filter(Boolean).map((p) => `${p}/`).join('');
  const slugs = Object.values(pageSlugs).find((s) => [pageUrl('cs', s.cs), pageUrl('en', s.en)].includes(item.url));
  if (!slugs) throw new Error(`Sitemap: no entry in src/i18n/pages.ts for /${path}`);
  item.links = [
    { lang: hreflang.cs, url: pageUrl('cs', slugs.cs) },
    { lang: hreflang.en, url: pageUrl('en', slugs.en) },
  ];
  return item;
}

export default defineConfig({
  site,
  base: base || '/',
  // Pages are folders (/nemocnice/index.html); link to them with a trailing slash so
  // GitHub Pages serves them directly instead of redirecting.
  trailingSlash: 'always',
  // The stylesheet is small; inlining it removes a render-blocking request.
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({ serialize: withLanguageLinks }),
  ],
  // Czech at the site root, other languages under /<code>/. Keep in sync with src/i18n/index.ts.
  i18n: {
    locales: ['cs', 'en'],
    defaultLocale: 'cs',
    routing: { prefixDefaultLocale: false },
  },
  // Fonts are downloaded at build time and served from the site itself,
  // so visitors' browsers never contact Google. latin-ext covers Czech diacritics.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'DM Serif Display',
      cssVariable: '--font-serif',
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-sans',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
    },
  ],
});
