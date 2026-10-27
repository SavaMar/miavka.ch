"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import type { ArticleListItem } from "@/lib/article-shared";
import PressableCard from "@/components/motion/PressableCard";
import { SPRING_SMOOTH } from "@/components/motion/springs";

const PRESS = {
  whileTap: { scale: 0.94 },
  transition: { type: "spring", duration: 0.2, bounce: 0 },
} as const;

type ArticleCategoryId =
  | "brand-story"
  | "book-club"
  | "physics-life"
  | "psychology"
  | "philosophy";

type ArticleCategory = {
  id: ArticleCategoryId;
  label: string;
  color: string;
};

type ArticleCardData = {
  article: ArticleListItem;
  availableLangs: string[];
};

const ARTICLE_CATEGORIES: readonly ArticleCategory[] = [
  { id: "brand-story", label: "BRAND STORY", color: "#E8320A" },
  { id: "book-club", label: "BOOK CLUB", color: "#C9A24B" },
  { id: "physics-life", label: "PHYSICS & LIFE", color: "#3E6B8A" },
  { id: "psychology", label: "PSYCHOLOGY", color: "#7A5C74" },
  { id: "philosophy", label: "PHILOSOPHY", color: "#4F7A6B" },
];

const CATEGORY_BY_SLUG: Partial<Record<string, ArticleCategoryId>> = {
  "boxraw-eight-million": "brand-story",
  "story-brand": "book-club",
  "corparate-lang": "psychology",
  h2h: "philosophy",
};

const ARTICLES_BG_COLOR = "#0A0A0A";

function articleCardHref(slug: string): string {
  return `/articles/${slug}`;
}

function formatArticleDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

function translationBadge(langs: string[]): string {
  const hasDe = langs.includes("de");
  const hasFr = langs.includes("fr");
  if (hasDe && hasFr) return "EN + FR + DE";
  if (hasFr) return "EN + FR";
  if (hasDe) return "EN + DE";
  return "EN only";
}

function resolveCategoryId(article: ArticleListItem): ArticleCategoryId {
  const bySlug = CATEGORY_BY_SLUG[article.slug];
  if (bySlug) return bySlug;

  const normalizedTags = article.tags.map((tag) => tag.toLowerCase());
  if (normalizedTags.some((tag) => tag.includes("book"))) return "book-club";
  if (normalizedTags.some((tag) => tag.includes("psych"))) return "psychology";
  if (normalizedTags.some((tag) => tag.includes("philos"))) return "philosophy";
  if (normalizedTags.some((tag) => tag.includes("physics"))) return "physics-life";
  return "brand-story";
}

function CategoryBadge({
  category,
  active,
  onClick,
  compact = false,
}: {
  category: ArticleCategory;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      {...PRESS}
      className={`inline-flex cursor-pointer items-center rounded-full border-[1.5px] bg-transparent transition-colors ${
        compact ? "h-7 gap-1.5 px-3" : "h-8 gap-2 px-4"
      }`}
      style={{
        borderColor: category.color,
        color: active ? "#111111" : category.color,
        backgroundColor: active ? category.color : "transparent",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 600,
        fontSize: compact ? "11px" : "12px",
        letterSpacing: "0.08em",
      }}
      aria-pressed={active}
    >
      <span
        className={`${compact ? "size-2" : "size-2.5"} rounded-full`}
        style={{
          backgroundColor: active ? "#111111" : category.color,
        }}
        aria-hidden
      />
      <span
        className={`whitespace-nowrap uppercase ${
          compact ? "text-[10px] sm:text-[11px]" : "text-[11px] sm:text-[12px]"
        }`}
      >
        {category.label}
      </span>
    </motion.button>
  );
}

export default function ArticlesIndexClient({
  items,
}: {
  items: ArticleCardData[];
}) {
  const [activeCategory, setActiveCategory] = useState<ArticleCategoryId | "all">(
    "all"
  );

  const enriched = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        categoryId: resolveCategoryId(item.article),
      })),
    [items]
  );

  const visibleItems = useMemo(() => {
    if (activeCategory === "all") return enriched;
    return enriched.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, enriched]);

  const categoryById = useMemo(
    () => new Map(ARTICLE_CATEGORIES.map((category) => [category.id, category])),
    []
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          onClick={() => setActiveCategory("all")}
          {...PRESS}
          className="inline-flex h-8 cursor-pointer items-center rounded-full border-[1.5px] border-brand-black/40 px-4 text-[11px] uppercase tracking-wide text-brand-black transition-colors hover:bg-brand-black/8"
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 600,
            backgroundColor: activeCategory === "all" ? "#111111" : "transparent",
            color: activeCategory === "all" ? "#EFE7D8" : "#111111",
            borderColor: activeCategory === "all" ? "#111111" : "rgba(17,17,17,0.35)",
          }}
          aria-pressed={activeCategory === "all"}
        >
          All
        </motion.button>
        {ARTICLE_CATEGORIES.map((category) => (
          <CategoryBadge
            key={category.id}
            category={category}
            active={activeCategory === category.id}
            onClick={() =>
              setActiveCategory((prev) => (prev === category.id ? "all" : category.id))
            }
          />
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
        <AnimatePresence mode="popLayout" initial={false}>
        {visibleItems.map(({ article, availableLangs, categoryId }) => {
          const href = articleCardHref(article.slug);
          const translationState = translationBadge(availableLangs);
          const category = categoryById.get(categoryId) ?? ARTICLE_CATEGORIES[0];

          return (
            <motion.li
              key={article.slug}
              layout="position"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={SPRING_SMOOTH}
            >
              <PressableCard className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-[10px] border-b bg-white shadow-md">
                <div className="group flex h-full flex-col">
                  <Link
                    href={href}
                    className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                  >
                    <div className="w-full overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={1600}
                        height={800}
                        className="h-auto w-full object-cover"
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 33vw, 25vw"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <Link
                        href={href}
                        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                      >
                        <p
                          className="text-[11px] font-medium uppercase tracking-wider text-ui-gray-700"
                          style={{
                            fontFamily:
                              "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                          }}
                        >
                          {formatArticleDate(article.date)}
                        </p>
                      </Link>
                      <CategoryBadge
                        category={category}
                        active={activeCategory === category.id}
                        onClick={() => setActiveCategory(category.id)}
                        compact
                      />
                    </div>

                    <p
                      className="mb-3 text-[10px] font-bold uppercase tracking-wider text-brand-red"
                      style={{
                        fontFamily:
                          "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      {translationState}
                    </p>

                    <Link
                      href={href}
                      className="flex min-h-0 flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                    >
                      <h2
                        className="mb-3 text-lg font-black leading-snug transition-colors group-hover:text-brand-red md:text-xl"
                        style={{
                          fontFamily:
                            "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                          color: ARTICLES_BG_COLOR,
                        }}
                      >
                        {article.title}
                      </h2>
                      <p
                        className="mb-4 flex-1 text-sm leading-relaxed text-ui-gray-700"
                        style={{
                          fontFamily:
                            "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                          fontWeight: 300,
                        }}
                      >
                        {article.excerpt}
                      </p>
                      <p
                        className="text-[11px] font-medium text-ui-gray-700"
                        style={{
                          fontFamily:
                            "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                        }}
                      >
                        {readTimeLabel(article.readTimeMinutes)}
                      </p>
                    </Link>
                  </div>
                </div>
              </article>
              </PressableCard>
            </motion.li>
          );
        })}
        </AnimatePresence>
      </ul>
    </>
  );
}
