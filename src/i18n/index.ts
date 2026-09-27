/**
 * Translations. Each language has one JSON file in this folder; cs.json is the
 * reference, and every other language must provide the same keys (checked by
 * `npm run check`). Placeholders in {braces} are filled in with format().
 *
 * To add a language: add <code>.json, register it below and in the `i18n.locales`
 * list in astro.config.mjs. The page is then built at /<code>/ automatically.
 */
import cs from './cs.json';
import en from './en.json';

export type Dictionary = typeof cs;

const dictionaries = { cs, en } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;

/** The default language lives at the site root, the others under /<code>/. */
export const defaultLocale: Locale = 'cs';
export const locales = Object.keys(dictionaries) as Locale[];

/** Labels for the language switch, each in its own language. */
export const localeLabels: Record<Locale, { short: string; name: string }> = {
  cs: { short: 'CZ', name: 'Čeština' },
  en: { short: 'EN', name: 'English' },
};

export function toLocale(value: string | undefined): Locale {
  return locales.find((l) => l === value) ?? defaultLocale;
}

/** Dictionary for the given locale, usually `useTranslations(Astro.currentLocale)`. */
export function useTranslations(locale: string | undefined): Dictionary {
  return dictionaries[toLocale(locale)];
}

/** Fills {placeholders}: format('{value} °C', { value: '36,5' }) → '36,5 °C'. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Number with the locale's decimal separator: 36.5 → '36,5' in Czech. */
export function formatNumber(value: number, locale: string | undefined) {
  return new Intl.NumberFormat(toLocale(locale)).format(value);
}
