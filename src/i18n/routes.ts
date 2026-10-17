/** URL helpers for the pages listed in pages.ts. */
import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from './index';
import { pageSlugs, type PageId } from './pages';

export { pageIds, pageSlugs, hreflang, type PageId } from './pages';

/** The three solutions, each with its own page. */
export const solutionIds = ['hospital', 'clinic', 'homeCare'] as const satisfies readonly PageId[];
export type SolutionId = (typeof solutionIds)[number];
export const isSolution = (page: PageId): page is SolutionId => (solutionIds as readonly string[]).includes(page);

export const legalIds = ['privacy', 'legal'] as const satisfies readonly PageId[];
export type LegalId = (typeof legalIds)[number];

/** Root-relative URL of a page, e.g. pageUrl('hospital', 'en', '#kontakt') → /w4h/en/hospital/#kontakt */
export function pageUrl(page: PageId, locale: Locale, hash = '') {
  return getRelativeLocaleUrl(locale, pageSlugs[page][locale]) + hash;
}

/** Absolute URL of a page, for canonical and hreflang links. */
export function absolutePageUrl(page: PageId, locale: Locale) {
  return getAbsoluteLocaleUrl(locale, pageSlugs[page][locale]);
}
