import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleReadProgress from "@/components/articles/ArticleReadProgress";
import ArticleTableOfContents from "@/components/articles/ArticleTableOfContents";
import ArticlePrevNext from "@/components/articles/ArticlePrevNext";
import {
  DEFAULT_LANG,
  type ArticleSection,
  type Lang,
  articleDetailPath,
  getAdjacentArticles,
  getArticleBySlug,
  getAvailableLanguages,
  getSlugDirectories,
  normalizeLang,
} from "@/lib/articles";

const ARTICLE_ROOT_ID = "article-read-root";

const EMPTY_SECTIONS: ArticleSection[] = [];

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export async function generateStaticParams() {
  const slugs = await getSlugDirectories();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;
  const requested = normalizeLang(sp.lang);
  let article = await getArticleBySlug(slug, requested);
  if (!article && requested !== DEFAULT_LANG) {
    article = await getArticleBySlug(slug, DEFAULT_LANG);
  }
  if (!article) return { title: "Article | Miavka Studio" };
  return {
    title: `${article.frontmatter.title} | Miavka Studio`,
    description: article.frontmatter.excerpt,
  };
}

function AiTranslationNotice({ lang }: { lang: Lang }) {
  if (lang === "de") {
    return (
      <div className="mb-6 rounded-sm bg-brand-black px-4 py-3 text-xs leading-relaxed text-brand-cream/95">
        <p
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Dieser Artikel wurde mithilfe von AI ins Deutsche übersetzt. Mari
          schreibt und spricht vor allem Englisch.
        </p>
      </div>
    );
  }
  if (lang === "fr") {
    return (
      <div className="mb-6 rounded-sm bg-brand-black px-4 py-3 text-xs leading-relaxed text-brand-cream/95">
        <p
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Cet article a été traduit en français par intelligence artificielle.
          Mari écrit et parle surtout en anglais.
        </p>
      </div>
    );
  }
  return (
    <div className="mb-6 rounded-sm bg-brand-black px-4 py-3 text-xs leading-relaxed text-brand-cream/95">
      <p
        style={{
          fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        This article was translated using AI. Mari writes and speaks primarily
        in English.
      </p>
    </div>
  );
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const requestedLang = normalizeLang(sp.lang);

  let compiled = await getArticleBySlug(slug, requestedLang);
  let effectiveLang: Lang = requestedLang;
  let usedFallback = false;

  if (!compiled && requestedLang !== DEFAULT_LANG) {
    compiled = await getArticleBySlug(slug, DEFAULT_LANG);
    if (compiled) {
      effectiveLang = DEFAULT_LANG;
      usedFallback = true;
    }
  }

  if (!compiled) notFound();

  const { frontmatter, content } = compiled;
  const available = await getAvailableLanguages(slug);
  const adjacent = await getAdjacentArticles(slug, effectiveLang);

  const showAiNotice =
    (effectiveLang === "de" || effectiveLang === "fr") &&
    frontmatter.translatedBy === "ai";

  return (
    <>
      <Nav />
      <ArticleReadProgress articleRootId={ARTICLE_ROOT_ID} />
      <main className="min-h-screen bg-brand-cream pb-0 pt-[108px] md:pt-[116px]">
        <div className="mx-auto max-w-[1400px] px-6 pt-10 md:px-10 lg:px-16">
          <div className="lg:grid lg:grid-cols-[220px_minmax(0,680px)_minmax(0,1fr)] lg:gap-x-10 lg:items-stretch">
            <ArticleTableOfContents
              sections={
                frontmatter.sections?.length
                  ? frontmatter.sections
                  : EMPTY_SECTIONS
              }
            />

            <div className="min-w-0 self-start">
              <p className="mb-6">
                <Link
                  href={
                    effectiveLang !== DEFAULT_LANG
                      ? `/articles?lang=${effectiveLang}`
                      : "/articles"
                  }
                  className="text-xs font-body font-bold uppercase text-brand-red hover:underline"
                >
                  ← All articles
                </Link>
              </p>

              {usedFallback ? (
                <p className="mb-6 rounded border border-ui-gray-300 bg-white/80 px-4 py-3 text-xs leading-relaxed text-ui-gray-700">
                  This article isn&apos;t available in the selected language
                  yet; showing English.
                </p>
              ) : null}

              {showAiNotice ? (
                <AiTranslationNotice lang={effectiveLang} />
              ) : null}

              <article
                id={ARTICLE_ROOT_ID}
                className="mx-auto max-w-[680px] pb-20"
              >
                <header className="mb-8">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    {available.length > 1 ? (
                      <nav
                        aria-label="Article language"
                        className="flex flex-wrap gap-2"
                      >
                        {available.map((lang) => {
                          const active = lang === effectiveLang;
                          return (
                            <Link
                              key={lang}
                              href={articleDetailPath(slug, lang)}
                              className={`rounded px-2 py-1 text-xs font-bold uppercase tracking-wide transition-colors ${
                                active
                                  ? "bg-brand-black text-brand-cream"
                                  : "text-brand-black underline decoration-ui-gray-300 underline-offset-4 hover:text-brand-red"
                              }`}
                            >
                              {lang}
                            </Link>
                          );
                        })}
                      </nav>
                    ) : null}
                    {frontmatter.translatedBy === "ai" && !showAiNotice ? (
                      <span className="text-[10px] uppercase tracking-wider text-ui-gray-700">
                        Translation: AI-assisted
                      </span>
                    ) : null}
                  </div>

                  <h1
                    className="mb-4 text-brand-black"
                    style={{
                      fontFamily: "'TG Girthy', Impact, sans-serif",
                      fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                      lineHeight: 1.05,
                    }}
                  >
                    {frontmatter.title}
                  </h1>
                  <p
                    className="text-sm italic leading-relaxed text-ui-gray-700"
                    style={{
                      fontFamily:
                        "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {frontmatter.excerpt}
                  </p>
                  {frontmatter.tags?.length ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {frontmatter.tags.map((tag, ti) => (
                        <li key={`${tag}-${ti}`}>
                          <span className="rounded-full border border-ui-gray-300 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ui-gray-700">
                            {tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </header>

                <div className="relative mb-12 aspect-video w-full overflow-hidden bg-brand-black">
                  <Image
                    src={frontmatter.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 680px"
                    priority
                  />
                </div>

                <div>{content}</div>
              </article>
            </div>

            <div className="hidden min-h-px lg:block" aria-hidden />
          </div>
        </div>

        <ArticlePrevNext prev={adjacent.prev} next={adjacent.next} />
      </main>
      <Footer />
    </>
  );
}
