import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lora } from "next/font/google";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ArticleReadProgress from "@/components/articles/ArticleReadProgress";
import ArticleTableOfContents from "@/components/articles/ArticleTableOfContents";
import ArticlePrevNext from "@/components/articles/ArticlePrevNext";
import NotesSubscribeForm from "@/components/articles/NotesSubscribeForm";
import {
  DEFAULT_LANG,
  SUPPORTED_LANGS,
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
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const SITE_ORIGIN = SITE_URL.startsWith("http")
  ? SITE_URL
  : `https://${SITE_URL}`;

const EMPTY_SECTIONS: ArticleSection[] = [];
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
    signature: string;
  }
> = {
  en: {
    heading: "If you want to do this together",
    paragraph1:
      "Somewhere right now, your ideal customer is looking for exactly what you do — and not finding you. Not because you're not good. Because your online presence doesn't say what you are. I fix that. I go through everything your customer sees, find where the gap is, and rebuild it in the words that make them choose you.",
    paragraph2:
      "A 30-minute call: we look at your current voice, your positioning, and exactly where the gap is. If you want to work together after, we'll talk. If not — take the insights and run.",
    buttonLabel: "Book a discovery call",
    signature:
      "Mari Miavka — Brand Architect for Sport & Expert Businesses | I close the gap between what you are and what people see online | Positioning · Brand · Marketing Systems | Switzerland",
  },
  de: {
    heading: "Wenn du das gemeinsam angehen willst",
    paragraph1:
      "Gerade jetzt sucht dein idealer Kunde nach genau dem, was du anbietest — und findet dich nicht. Nicht, weil du nicht gut bist. Sondern weil deine Online-Präsenz nicht klar zeigt, was du wirklich bist. Genau da setze ich an. Ich analysiere alles, was dein Kunde sieht, finde die Luecke und baue es mit Worten neu auf, die Menschen dazu bringen, sich fuer dich zu entscheiden.",
    paragraph2:
      "Ein 30-minuetiges Gespräch: Wir schauen uns deine aktuelle Stimme, deine Positionierung und die konkrete Luecke an. Wenn du danach zusammenarbeiten willst, sprechen wir darueber. Wenn nicht — nimm die Erkenntnisse mit und setze sie um.",
    buttonLabel: "Discovery Call buchen",
    signature:
      "Mari Miavka — Brand Architect for Sport & Expert Businesses | Ich schliesse die Luecke zwischen dem, was du bist, und dem, was Menschen online sehen | Positionierung · Brand · Marketing Systems | Schweiz",
  },
  fr: {
    heading: "Si vous voulez faire ce travail ensemble",
    paragraph1:
      "En ce moment me me, votre client ideal cherche exactement ce que vous faites — et ne vous trouve pas. Pas parce que vous n'etes pas bon. Mais parce que votre presence en ligne ne dit pas clairement ce que vous etes. C'est ce que je corrige. Je passe en revue tout ce que votre client voit, j'identifie l'ecart et je reconstruis votre message avec des mots qui donnent envie de vous choisir.",
    paragraph2:
      "Un appel de 30 minutes : on regarde votre voix actuelle, votre positionnement et l'ecart exact. Si vous voulez travailler ensemble ensuite, on en parle. Sinon — repartez avec les insights et avancez.",
    buttonLabel: "Reserver un discovery call",
    signature:
      "Mari Miavka — Brand Architect for Sport & Expert Businesses | Je comble l'ecart entre ce que vous etes et ce que les gens voient en ligne | Positioning · Brand · Marketing Systems | Suisse",
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
      title: "Article | Miavka Studio",
      alternates: {
        canonical: canonicalPath,
        languages: languageAlternates,
      },
    };
  }

  const articleTitle = `${article.frontmatter.title} | Miavka Studio`;
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
      siteName: "Miavka Studio",
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
  const adjacent = await getAdjacentArticles(slug, effectiveLang);
  const shouldShowDiscoveryCta = !slug.toLowerCase().startsWith("addendum-");
  const discoveryCtaCopy = DISCOVERY_CTA_COPY[effectiveLang];

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
      "@type": "Organization",
      name: "Miavka Studio",
      logo: {
        "@type": "ImageObject",
        url: new URL("/images/logo.png", SITE_ORIGIN).toString(),
      },
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

  return (
    <>
      <Nav />
      <ArticleReadProgress articleRootId={ARTICLE_ROOT_ID} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, breadcrumbJsonLd]),
        }}
      />
      <main className="min-h-screen bg-[#EFE7D8] pb-0 pt-[108px] md:pt-[116px]">
        <div className="mx-auto max-w-[1200px] px-6 pt-10 md:px-8 lg:px-10">
          <div className="lg:grid lg:grid-cols-[minmax(0,680px)_minmax(0,280px)] lg:justify-center lg:items-start lg:gap-10">
            <div className="min-w-0">
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
                    alt={`${frontmatter.title} cover image`}
                    fill
                    className="rounded-[10px] object-contain object-center"
                    sizes="(max-width: 1024px) 100vw, 680px"
                    priority
                  />
                </div>

                <ArticleTableOfContents
                  sections={
                    frontmatter.sections?.length
                      ? frontmatter.sections
                      : EMPTY_SECTIONS
                  }
                  showDesktop={false}
                  showMobileInline
                  showMobileFab
                />

                <div className={lora.className}>{content}</div>

                {shouldShowDiscoveryCta ? (
                  <section className="mt-14 rounded-[10px] border border-brand-red bg-brand-cream p-6 md:p-8">
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
                        href="/discovery-call"
                        className="inline-flex cursor-pointer items-center justify-center rounded-[10px] bg-brand-red px-5 py-2.5 text-center text-[14px] font-semibold tracking-[0.02em] text-brand-cream transition hover:bg-brand-red/85 hover:text-brand-cream"
                        style={{
                          color: "#ffffff",
                          fontFamily:
                            "'Space Grotesk', 'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                        }}
                      >
                        {discoveryCtaCopy.buttonLabel}
                      </Link>
                    </div>
                    <p
                      className="mt-6 border-t border-brand-red/30 pt-6 text-sm leading-relaxed text-ui-gray-700"
                      style={{
                        fontFamily:
                          "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      {discoveryCtaCopy.signature}
                    </p>
                  </section>
                ) : null}

                <section className="mt-14 rounded-2xl border border-ui-gray-300 bg-brand-cream p-6 md:p-8">
                  <h2
                    className="text-[2rem] uppercase leading-[0.95] text-brand-black"
                    style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                  >
                    More like this, once a week.
                  </h2>
                  <p
                    className="mt-4 text-[18px] leading-[1.75] text-ui-gray-700"
                    style={{
                      fontFamily: "'Lora', Georgia, serif",
                    }}
                  >
                    Brand breakdowns, marketing systems, and what actually works
                    for sport businesses and founders. No pitch. Just the
                    thinking.
                  </p>
                  <NotesSubscribeForm
                    offer="article-bottom-notes"
                    className="mt-6"
                    layout="inline"
                  />
                </section>
              </article>
            </div>

            <aside className="hidden w-full max-w-[280px] space-y-8 lg:block">
              <div>
                <section className="rounded-2xl border border-ui-gray-300 bg-brand-cream p-6 shadow-[0_18px_40px_rgba(17,17,17,0.06)]">
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
                      fontFamily:
                        "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Join my free weekly notes on brand strategy, sport business
                    growth, visibility, and content systems.
                  </p>
                  <NotesSubscribeForm
                    offer="article-sidebar-notes"
                    className="mt-5"
                    layout="stacked"
                  />
                </section>
              </div>

              <div>
                <ArticleTableOfContents
                  sections={
                    frontmatter.sections?.length
                      ? frontmatter.sections
                      : EMPTY_SECTIONS
                  }
                  showDesktop
                  showMobileInline={false}
                  showMobileFab={false}
                />
              </div>
            </aside>
          </div>
        </div>

        <ArticlePrevNext prev={adjacent.prev} next={adjacent.next} />
      </main>
      <Footer />
    </>
  );
}
