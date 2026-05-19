import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  DEFAULT_LANG,
  type Lang,
  SUPPORTED_LANGS,
  getAllArticles,
  normalizeLang,
} from "@/lib/articles";

export const metadata: Metadata = {
  title: "Articles | Miavka Studio",
  description:
    "Brand breakdowns, systems, and stories for founder-led businesses.",
};

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

function articlesIndexHref(lang: Lang): string {
  return lang === DEFAULT_LANG ? "/articles" : `/articles?lang=${lang}`;
}

function articleCardHref(slug: string, lang: Lang): string {
  return `/articles/${slug}?lang=${lang}`;
}

function formatArticleDate(iso: string, lang: Lang): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  const locale = lang === "de" ? "de-DE" : lang === "fr" ? "fr-FR" : "en-US";
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readTimeLabel(minutes: number, lang: Lang): string {
  if (lang === "de") return `${minutes} Min. Lesezeit`;
  if (lang === "fr") return `${minutes} min de lecture`;
  return `${minutes} min read`;
}

const TAB_LABEL: Record<Lang, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
};

export default async function ArticlesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const lang = normalizeLang(sp.lang);
  const articles = await getAllArticles(lang);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-cream pt-[72px] md:pt-[80px] pb-20 md:pb-28">
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
          <h1
            className="mb-4 text-brand-black mt-10"
            style={{
              fontFamily: "'TG Girthy', Impact, sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
            }}
          >
            Articles
          </h1>
          <p
            className="mb-8 max-w-2xl text-md leading-relaxed text-ui-gray-700"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            Brand breakdowns and practical notes — the kind of reading I wished
            existed when I was building from zero.
          </p>

          <nav
            aria-label="Article language"
            className="mb-10 flex flex-wrap gap-2 border-b border-ui-gray-300 pb-6"
          >
            {SUPPORTED_LANGS.map((code) => {
              const active = code === lang;
              return (
                <Link
                  key={code}
                  href={articlesIndexHref(code)}
                  className={`min-w-[3rem] rounded px-4 py-2 text-center text-xs font-bold uppercase tracking-widest transition-colors ${
                    active
                      ? "bg-brand-black text-brand-cream"
                      : "bg-white text-brand-black shadow-sm ring-1 ring-ui-gray-300 hover:text-brand-red"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  {TAB_LABEL[code]}
                </Link>
              );
            })}
          </nav>

          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-8 lg:gap-10">
            {articles.map((article) => {
              const href = articleCardHref(article.slug, lang);
              return (
                <li key={article.slug}>
                  <article className="flex h-full flex-col overflow-hidden border-b bg-white shadow-md">
                    <div className="group flex h-full flex-col">
                      <Link
                        href={href}
                        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                      >
                        <div className="flex w-full items-center justify-center bg-brand-black px-2 py-3 md:px-3 md:py-4">
                          <Image
                            src={article.image}
                            alt={article.title}
                            width={1600}
                            height={800}
                            className="h-auto w-full object-contain"
                            sizes="(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 560px"
                          />
                        </div>
                      </Link>

                      <div className="flex flex-1 flex-col p-6 md:p-7">
                        <Link
                          href={href}
                          className="mb-3 block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                        >
                          <p
                            className="text-[11px] font-medium uppercase tracking-wider text-ui-gray-700"
                            style={{
                              fontFamily:
                                "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                            }}
                          >
                            {formatArticleDate(article.date, lang)}
                          </p>
                        </Link>

                        {article.tags.length > 0 ? (
                          <ul className="mb-3 flex flex-wrap gap-2">
                            {article.tags.map((tag, ti) => (
                              <li key={`${tag}-${ti}`}>
                                <span className="inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium text-brand-black/60 inset-ring inset-ring-brand-black/20">
                                  {tag}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        <Link
                          href={href}
                          className="flex min-h-0 flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                        >
                          <h2
                            className="mb-3 text-lg font-black leading-snug text-brand-black transition-colors group-hover:text-brand-red md:text-xl"
                            style={{
                              fontFamily:
                                "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
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
                            {readTimeLabel(article.readTimeMinutes, lang)}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
