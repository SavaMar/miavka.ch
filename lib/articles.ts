import { readFile, readdir } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import { createArticleMdxComponents } from "./article-mdx-components";
import {
  DEFAULT_LANG,
  type Lang,
  type ArticleListItem,
  SUPPORTED_LANGS,
  articleDetailPath,
  normalizeLang,
} from "./article-shared";

export const CONTENT_ARTICLES_ROOT = path.join(process.cwd(), "content/articles");

export {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  type Lang,
  type ArticleListItem,
  articleDetailPath,
  normalizeLang,
} from "./article-shared";

export type ArticleSection = { id: string; title: string };

function isAddendumSlug(slug: string): boolean {
  return slug.toLowerCase().startsWith("addendum");
}

export type ArticleFrontmatter = {
  slug: string;
  lang: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  image: string;
  translatedBy: "ai" | "human" | null;
  availableIn: string[];
  sections: ArticleSection[];
};

/** ~200 words per minute; minimum 1 minute */
export function estimateReadTimeMinutes(mdxBody: string): number {
  const text = mdxBody
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~|[\]]/g, " ");
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => /[0-9A-Za-zÀ-ÖØ-öø-ÿ]/.test(w)).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getSlugDirectories(): Promise<string[]> {
  try {
    const entries = await readdir(CONTENT_ARTICLES_ROOT, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => e.name);
  } catch {
    return [];
  }
}

export async function getAvailableLanguages(slug: string): Promise<Lang[]> {
  const dir = path.join(CONTENT_ARTICLES_ROOT, slug);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return [];
  }
  const langs = files
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
    .filter((code): code is Lang =>
      (SUPPORTED_LANGS as readonly string[]).includes(code)
    );
  return langs.sort((a, b) => a.localeCompare(b));
}

export async function getAllArticles(lang: string): Promise<ArticleListItem[]> {
  const normalized = normalizeLang(lang);
  const slugs = (await getSlugDirectories()).filter((slug) => !isAddendumSlug(slug));
  const items: ArticleListItem[] = [];

  for (const slug of slugs) {
    const fp = path.join(CONTENT_ARTICLES_ROOT, slug, `${normalized}.mdx`);
    let raw: string;
    try {
      raw = await readFile(fp, "utf8");
    } catch {
      continue;
    }

    const { data, content } = matter(raw);
    const fm = data as Partial<ArticleFrontmatter>;
    if (!fm.slug || !fm.title) continue;

    items.push({
      slug: fm.slug,
      title: fm.title,
      excerpt: fm.excerpt ?? "",
      image: fm.image ?? "/images/articles/boxraw.jpg",
      date: fm.date ?? "",
      lang: fm.lang ?? normalized,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      readTimeMinutes: estimateReadTimeMinutes(content),
    });
  }

  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return items;
}

export type CompiledArticle = {
  frontmatter: ArticleFrontmatter;
  content: ReactElement;
};

export async function getArticleBySlug(
  slug: string,
  lang: string
): Promise<CompiledArticle | null> {
  const normalized = normalizeLang(lang);
  const fp = path.join(CONTENT_ARTICLES_ROOT, slug, `${normalized}.mdx`);
  let raw: string;
  try {
    raw = await readFile(fp, "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
    },
    components: createArticleMdxComponents(frontmatter.sections ?? []),
  });

  return {
    content: mdxContent,
    frontmatter,
  };
}

/** Resolves a URL for `slug`, preferring `preferredLang`, then falling back to English. */
export async function resolveArticleDetailPath(
  slug: string,
  preferredLang: Lang
): Promise<string> {
  const hasPreferred = await getArticleBySlug(slug, preferredLang);
  if (hasPreferred) return articleDetailPath(slug, preferredLang);
  const hasEn = await getArticleBySlug(slug, DEFAULT_LANG);
  if (hasEn) return articleDetailPath(slug, DEFAULT_LANG);
  return articleDetailPath(slug, DEFAULT_LANG);
}

export type AdjacentArticleLink = { slug: string; title: string; href: string };

/**
 * Previous / next by **listing order** (newest first, same as getAllArticles with `en`).
 * Titles are taken from `preferredLang` when that translation exists.
 */
export async function getAdjacentArticles(
  currentSlug: string,
  preferredLang: Lang
): Promise<{ prev: AdjacentArticleLink | null; next: AdjacentArticleLink | null }> {
  const canonical = await getAllArticles(DEFAULT_LANG);
  const idx = canonical.findIndex((a) => a.slug === currentSlug);
  if (idx === -1) return { prev: null, next: null };

  const localized = await getAllArticles(preferredLang);
  const titleFor = (slug: string) =>
    localized.find((a) => a.slug === slug)?.title ??
    canonical.find((a) => a.slug === slug)?.title ??
    slug;

  const makeLink = async (slug: string | undefined): Promise<AdjacentArticleLink | null> => {
    if (!slug) return null;
    const href = await resolveArticleDetailPath(slug, preferredLang);
    return { slug, title: titleFor(slug), href };
  };

  const prevSlug = idx > 0 ? canonical[idx - 1].slug : undefined;
  const nextSlug = idx < canonical.length - 1 ? canonical[idx + 1].slug : undefined;

  return {
    prev: await makeLink(prevSlug),
    next: await makeLink(nextSlug),
  };
}
