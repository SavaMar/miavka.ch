import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lora } from "next/font/google";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";
import ArticleReadProgress from "@/components/articles/ArticleReadProgress";
import ArticleTocPinned from "@/components/articles/ArticleTocPinned";
import NotesSubscribeForm from "@/components/articles/NotesSubscribeForm";
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
  type ArticleSection,
  type Lang,
  articleDetailPath,
  getAllArticles,
  getArticleBySlug,
  getAvailableLanguages,
  getSlugDirectories,
  normalizeLang,
} from "@/lib/articles";

const ARTICLE_ROOT_ID = "article-read-root";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const SITE_ORIGIN = SITE_URL.startsWith("http")
  ? SITE_URL
  : `https://${SITE_URL}`;

const EMPTY_SECTIONS: ArticleSection[] = [];
const ARTICLES_BG_COLOR = "#FFFFFF";
const ARTICLES_PATTERN_COLOR = "#BAB7B7";
const ARTICLES_PATTERN_OPACITY = 0.3;
const OG_LOCALE: Record<Lang, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
};
const DISCOVERY_CTA_COPY: Record<
  Lang,
  {
    heading: string;
    paragraph1: string;
    paragraph2: string;
    buttonLabel: string;
  }
> = {
  en: {
    heading: "If you want to do this together",
    paragraph1:
      "Somewhere right now, your ideal customer is looking for exactly what you do — and not finding you. Not because you're not good. Because your online presence doesn't say what you are. I fix that. I go through everything your customer sees, find where the gap is, and rebuild it in the words that make them choose you.",
    paragraph2:
      "We look at your current voice, your positioning, and exactly where the gap is.",
    buttonLabel: "Tell me about your pain",
  },
  de: {
    heading: "Wenn du das gemeinsam angehen willst",
    paragraph1:
      "Gerade jetzt sucht dein idealer Kunde nach genau dem, was du anbietest — und findet dich nicht. Nicht, weil du nicht gut bist. Sondern weil deine Online-Präsenz nicht klar zeigt, was du wirklich bist. Genau da setze ich an. Ich analysiere alles, was dein Kunde sieht, finde die Luecke und baue es mit Worten neu auf, die Menschen dazu bringen, sich fuer dich zu entscheiden.",
    paragraph2:
      "Wir schauen uns deine aktuelle Stimme, deine Positionierung und die konkrete Luecke an.",
    buttonLabel: "Tell me about your pain",
  },
  fr: {
    heading: "Si vous voulez faire ce travail ensemble",
    paragraph1:
      "En ce moment me me, votre client ideal cherche exactement ce que vous faites — et ne vous trouve pas. Pas parce que vous n'etes pas bon. Mais parce que votre presence en ligne ne dit pas clairement ce que vous etes. C'est ce que je corrige. Je passe en revue tout ce que votre client voit, j'identifie l'ecart et je reconstruis votre message avec des mots qui donnent envie de vous choisir.",
    paragraph2:
      "On regarde votre voix actuelle, votre positionnement et l'ecart exact.",
    buttonLabel: "Tell me about your pain",
  },
};
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
  const languageAlternates = SUPPORTED_LANGS.reduce<Record<string, string>>(
    (acc, lang) => {
      acc[lang] = articleDetailPath(slug, lang);
      return acc;
    },
    {}
  );
  languageAlternates["x-default"] = articleDetailPath(slug, DEFAULT_LANG);

  const available = await getAvailableLanguages(slug);
  const canonicalLang = available.includes(requested)
    ? requested
    : DEFAULT_LANG;
  const canonicalPath = articleDetailPath(slug, canonicalLang);
  let article = await getArticleBySlug(slug, requested);
  if (!article && requested !== DEFAULT_LANG) {
    article = await getArticleBySlug(slug, DEFAULT_LANG);
  }
  if (!article) {
    return {
      title: "Article | Mari Miavka",
      alternates: {
        canonical: canonicalPath,
        languages: languageAlternates,
      },
    };
  }

  const articleTitle = `${article.frontmatter.title} | Mari Miavka`;
  const articleDescription = article.frontmatter.excerpt;
  const imageUrl = new URL(article.frontmatter.image, SITE_ORIGIN).toString();
  const effectiveLang = article.frontmatter.lang
    ? normalizeLang(article.frontmatter.lang)
    : canonicalLang;

  return {
    title: articleTitle,
    description: articleDescription,
    alternates: {
      canonical: canonicalPath,
      languages: languageAlternates,
    },
    openGraph: {
      type: "article",
      title: articleTitle,
      description: articleDescription,
      url: canonicalPath,
      siteName: "Mari Miavka",
      locale: OG_LOCALE[effectiveLang],
      images: [
        {
          url: imageUrl,
          alt: article.frontmatter.title,
        },
      ],
      publishedTime: article.frontmatter.date,
      tags: article.frontmatter.tags,
      authors: ["Mari Miavka"],
    },
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
  const shouldShowDiscoveryCta = !slug.toLowerCase().startsWith("addendum-");
  const discoveryCtaCopy = DISCOVERY_CTA_COPY[effectiveLang];
  const allArticles = await getAllArticles(effectiveLang);
  const currentTags = new Set((frontmatter.tags ?? []).map((tag) => tag.toLowerCase()));
  const readNextArticles = allArticles
    .filter((item) => item.slug !== slug)
    .sort((a, b) => {
      const aOverlap = a.tags.filter((tag) =>
        currentTags.has(tag.toLowerCase())
      ).length;
      const bOverlap = b.tags.filter((tag) =>
        currentTags.has(tag.toLowerCase())
      ).length;
      if (aOverlap !== bOverlap) return bOverlap - aOverlap;
      return a.date < b.date ? 1 : -1;
    })
    .slice(0, 3);

  const showAiNotice =
    (effectiveLang === "de" || effectiveLang === "fr") &&
    frontmatter.translatedBy === "ai";
  const articleUrl = new URL(
    articleDetailPath(slug, effectiveLang),
    SITE_ORIGIN
  ).toString();
  const articleImageUrl = new URL(frontmatter.image, SITE_ORIGIN).toString();
  const parsedDate = new Date(frontmatter.date);
  const datePublished = Number.isNaN(parsedDate.getTime())
    ? frontmatter.date
    : parsedDate.toISOString();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.excerpt,
    image: [articleImageUrl],
    datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    keywords: frontmatter.tags?.join(", "),
    author: {
      "@type": "Person",
      name: "Mari Miavka",
    },
    publisher: {
      "@type": "Person",
      name: "Mari Miavka",
      url: SITE_ORIGIN,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_ORIGIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: new URL("/articles", SITE_ORIGIN).toString(),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: frontmatter.title,
        item: articleUrl,
      },
    ],
  };
  const showArticleMetaStrip =
    usedFallback ||
    showAiNotice ||
    available.length > 1 ||
    (frontmatter.translatedBy === "ai" && !showAiNotice);

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]),
        }}
      />
      <main
        className="relative min-h-screen overflow-x-hidden pb-0"
        style={{ backgroundColor: ARTICLES_BG_COLOR }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundColor: ARTICLES_PATTERN_COLOR,
            opacity: ARTICLES_PATTERN_OPACITY,
            WebkitMaskImage: "url('/bg_1.svg')",
            WebkitMaskRepeat: "repeat",
            WebkitMaskSize: "520px auto",
            WebkitMaskPosition: "top left",
            maskImage: "url('/bg_1.svg')",
            maskRepeat: "repeat",
            maskSize: "520px auto",
            maskPosition: "top left",
          }}
          aria-hidden
        />

        <section className="relative z-10 w-full overflow-hidden">
          <div className="relative h-[40vh] min-h-65 w-full">
            <Image
              src={frontmatter.image}
              alt={`${frontmatter.title} cover image`}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/45" aria-hidden />
            <div className="absolute inset-x-0 bottom-0">
              <div className="mx-auto max-w-7xl px-6 pb-6 pt-14 md:px-10 md:pb-10 lg:px-16">
                <h1
                  className="mb-3 text-white"
                  style={{
                    fontFamily: "'TG Girthy', Impact, sans-serif",
                    fontSize: "clamp(1.9rem, 4.5vw, 3.35rem)",
                    lineHeight: 1.02,
                  }}
                >
                  {frontmatter.title}
                </h1>
                <p
                  className="max-w-3xl text-sm italic leading-relaxed text-white/85"
                  style={{
                    fontFamily:
                      "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 300,
                  }}
                >
                  {frontmatter.excerpt}
                </p>
              </div>
            </div>
          </div>
        </section>

        <ArticleReadProgress articleRootId={ARTICLE_ROOT_ID} mode="sticky" />

        {showArticleMetaStrip ? (
          <section className="relative z-10 mt-3 w-full bg-[#FFFFFF]">
            <div className="mx-auto max-w-7xl px-6 py-5 md:px-10 md:py-6 lg:px-16">
              {usedFallback ? (
                <p className="mb-6 rounded border border-ui-gray-300/45 bg-white px-4 py-3 text-xs leading-relaxed text-ui-gray-700">
                  This article isn&apos;t available in the selected language yet;
                  showing English.
                </p>
              ) : null}

              {showAiNotice ? <AiTranslationNotice lang={effectiveLang} /> : null}

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
                              : "text-brand-black underline decoration-ui-gray-300/45 underline-offset-4 hover:text-brand-red"
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
            </div>
          </section>
        ) : null}

        <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-6 md:px-10 lg:px-16">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_360px]">
            <article
              id={ARTICLE_ROOT_ID}
              className="rounded-[10px] bg-white p-6 md:p-8"
            >
              <div className={lora.className}>{content}</div>

              {shouldShowDiscoveryCta ? (
                <section className="mt-14 rounded-[10px] bg-brand-cream p-6 md:p-8">
                  <h2
                    className="text-[2rem] uppercase leading-[0.95] text-brand-black"
                    style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                  >
                    {discoveryCtaCopy.heading}
                  </h2>
                  <p
                    className="mt-4 text-[18px] leading-[1.75] text-ui-gray-700"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    {discoveryCtaCopy.paragraph1}
                  </p>
                  <p
                    className="mt-4 text-[18px] leading-[1.75] text-ui-gray-700"
                    style={{ fontFamily: "'Lora', Georgia, serif" }}
                  >
                    {discoveryCtaCopy.paragraph2}
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/contact"
                      className="flex h-13 w-full cursor-pointer items-center justify-center rounded-[10px] bg-brand-black px-6 text-center text-base font-semibold tracking-[0.02em] text-white transition hover:bg-brand-black/88 hover:text-white"
                      style={{
                        color: "#ffffff",
                        fontFamily:
                          "'Space Grotesk', 'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      {discoveryCtaCopy.buttonLabel}
                    </Link>
                  </div>
                </section>
              ) : null}
            </article>

            <aside className="md:pr-1">
              <section className="rounded-[10px] bg-white p-6 shadow-[0_8px_22px_rgba(17,17,17,0.06)]">
                <h2
                  className="text-[2.05rem] uppercase leading-[0.95] text-brand-black"
                  style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                >
                  Subscribe
                  <br />
                  to Notes
                </h2>
                <p
                  className="mt-4 text-sm leading-relaxed text-ui-gray-700"
                  style={{
                    fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Notes from the middle of the work: what I&apos;m watching,
                  reading, testing and building. The AI tools and prompts I
                  actually use, marketing insights that worked, and what it&apos;s
                  really like starting a business in Switzerland as an expat.
                  Short, honest, and ready for you to steal.
                </p>
                <NotesSubscribeForm
                  offer="article-sidebar-notes"
                  className="mt-5"
                  layout="stacked"
                />
                <p
                  className="mt-5 text-xs leading-relaxed text-ui-gray-700"
                  style={{
                    fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 300,
                  }}
                >
                  By submitting this form, you&apos;ll be signed up to my free
                  newsletter. I may also send you other emails about my courses.
                  You can opt-out at any time. For more information, see our
                  privacy policy.
                </p>
              </section>

              <ArticleTocPinned
                sections={
                  frontmatter.sections?.length
                    ? frontmatter.sections
                    : EMPTY_SECTIONS
                }
                articleRootId={ARTICLE_ROOT_ID}
              />
            </aside>
          </div>
        </section>

        {readNextArticles.length > 0 ? (
          <section className="relative z-10 mb-6 w-full bg-brand-black py-14 md:mb-8 md:py-16">
            <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
              <div className="flex flex-wrap items-center justify-between gap-5">
                <h2
                  className="text-[clamp(2rem,4.5vw,3.6rem)] uppercase leading-[0.95] text-brand-cream"
                  style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                >
                  Read Next
                </h2>
                <Link
                  href={
                    effectiveLang !== DEFAULT_LANG
                      ? `/articles?lang=${effectiveLang}`
                      : "/articles"
                  }
                  className="inline-flex h-11 items-center justify-center rounded-[10px] border border-brand-cream/30 px-6 text-sm font-medium text-brand-cream transition hover:border-brand-cream hover:bg-brand-cream/10"
                  style={{
                    fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  }}
                >
                  Explore all articles
                </Link>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {readNextArticles.map((item) => (
                  <Link
                    key={item.slug}
                    href={articleDetailPath(item.slug, effectiveLang)}
                    className="group rounded-[10px] bg-[#222222] p-5 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-black/20">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <h3
                      className="mt-4 text-[1.45rem] leading-[1.1] text-brand-cream"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-cream/72"
                      style={{
                        fontFamily:
                          "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      {item.excerpt}
                    </p>
                    <span
                      className="mt-4 inline-flex text-sm font-semibold text-brand-cream underline decoration-brand-cream/45 underline-offset-4 transition-colors group-hover:text-white"
                      style={{
                        fontFamily:
                          "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      Read more
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <PersonalFooter />
    </>
  );
}
