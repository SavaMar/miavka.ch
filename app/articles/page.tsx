import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";
import ArticlesIndexClient from "@/components/articles/ArticlesIndexClient";
import {
  DEFAULT_LANG,
  getAllArticles,
  getAvailableLanguages,
} from "@/lib/articles";

const ARTICLES_BG_COLOR = "#FFFFFF";
const ARTICLES_PATTERN_COLOR = "#BAB7B7";
const ARTICLES_PATTERN_OPACITY = 0.3;

export const metadata: Metadata = {
  title: "Articles | Miavka Studio",
  description:
    "Brand breakdowns, systems, and stories for founder-led businesses.",
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    type: "website",
    title: "Articles | Miavka Studio",
    description:
      "Brand breakdowns, systems, and stories for founder-led businesses.",
    url: "/articles",
    siteName: "Miavka Studio",
    images: [
      {
        url: "/images/articles/boxraw.jpg",
        alt: "Miavka Studio articles",
      },
    ],
  },
};

export default async function ArticlesPage() {
  const articles = await getAllArticles(DEFAULT_LANG);
  const articleLanguages = await Promise.all(
    articles.map(async (article) => ({
      slug: article.slug,
      langs: await getAvailableLanguages(article.slug),
    }))
  );
  const items = articles.map((article) => ({
    article,
    availableLangs:
      articleLanguages.find((item) => item.slug === article.slug)?.langs ?? ["en"],
  }));

  return (
    <>
      <Nav theme="dark" />
      <main
        className="relative min-h-screen overflow-hidden pb-20 pt-8 md:pb-28 md:pt-10"
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
        <div className="relative z-10 mb-8 mt-10 w-full bg-[#0A0A0A]">
          <div className="mx-auto max-w-7xl px-6 py-3 md:px-10 md:py-10 lg:px-16">
            <h1
              className="mb-4 text-[#F4F4F0]"
              style={{
                fontFamily: "'TG Girthy', Impact, sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              Articles
            </h1>
            <p
              className="max-w-2xl text-md leading-relaxed text-[#F4F4F0]/80"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              Brand breakdowns and practical notes — the kind of reading I wished
              existed when I was building from zero.
            </p>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
          <ArticlesIndexClient items={items} />
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
