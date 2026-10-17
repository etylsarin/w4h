/**
 * Pages of the site and their URL slug in each language. Plain data, so that
 * astro.config.mjs (sitemap) can import it too; URL helpers are in routes.ts.
 */
export const pageSlugs = {
  index: { cs: '', en: '' },
  hospital: { cs: 'nemocnice', en: 'hospital' },
  clinic: { cs: 'ambulance', en: 'clinic' },
  homeCare: { cs: 'domaci-a-dlouhodoba-pece', en: 'home-and-long-term-care' },
  privacy: { cs: 'ochrana-osobnich-udaju', en: 'privacy-policy' },
  legal: { cs: 'pravni-informace', en: 'legal-information' },
} satisfies Record<string, Record<'cs' | 'en', string>>;

export type PageId = keyof typeof pageSlugs;
export const pageIds = Object.keys(pageSlugs) as PageId[];

/** Language tags for hreflang and the sitemap. */
export const hreflang = { cs: 'cs-CZ', en: 'en' } as const;
