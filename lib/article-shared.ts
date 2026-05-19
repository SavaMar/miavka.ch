/**
 * Article types and URL helpers safe to import from client components
 * (no Node fs / server-only APIs).
 */
export const SUPPORTED_LANGS = ["en", "de", "fr"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = "en";

export type ArticleListItem = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  lang: string;
  tags: string[];
  readTimeMinutes: number;
};

export function articleDetailPath(slug: string, lang: Lang): string {
  return lang === DEFAULT_LANG ? `/articles/${slug}` : `/articles/${slug}?lang=${lang}`;
}

export function normalizeLang(lang: string | undefined): Lang {
  const l = (lang ?? DEFAULT_LANG).toLowerCase();
  if ((SUPPORTED_LANGS as readonly string[]).includes(l)) return l as Lang;
  return DEFAULT_LANG;
}

export type ArticleLocaleBundle = {
  slug: string;
  locales: Partial<Record<Lang, ArticleListItem>>;
};

/** Home page article strip: one row per slug + language. */
export type HomeCarouselCard = {
  slug: string;
  lang: Lang;
  item: ArticleListItem;
};
