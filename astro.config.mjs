// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// GitHub Pages: the deploy workflow passes the origin and base path reported by
// actions/configure-pages, so switching to a custom domain needs no change here.
// The defaults below match https://etylsarin.github.io/w4h/ for local builds.
const site = process.env.SITE_ORIGIN || 'https://etylsarin.github.io';
const base = process.env.SITE_BASE_PATH ?? '/w4h';

export default defineConfig({
  site,
  base: base || '/',
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
