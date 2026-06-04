import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import NotesSubscribeForm from "@/components/articles/NotesSubscribeForm";
import ArticlesHomeCarousel from "@/components/sections/ArticlesHomeCarousel";
import type { HomeCarouselCard } from "@/lib/article-shared";
import { getAllArticles, getAvailableLanguages } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Newsletter | Miavka Studio",
  description:
    "Subscribe to weekly notes from Mari Miavka on brand strategy, sport business growth, and visibility systems.",
};

export default async function NewsletterPage() {
  const en = await getAllArticles("en");
  const latest = en.slice(0, 4);
  const cards: HomeCarouselCard[] = await Promise.all(
    latest.map(async (item) => {
      const languages = await getAvailableLanguages(item.slug);
      const translatedTo = languages.filter(
        (lang): lang is "de" | "fr" => lang === "de" || lang === "fr"
      );
      return {
        slug: item.slug,
        item,
        translatedTo,
      };
    })
  );

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-cream pt-[108px] md:pt-[116px]">
        <section className="px-6 py-16 md:px-10 md:py-20 lg:px-16">
          <div className="mx-auto max-w-[820px] rounded-2xl  bg-white/80 p-6 md:p-10">
            <p
              className="text-sm uppercase tracking-[0.22em] text-brand-red"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Newsletter
            </p>
            <h1
              className="mt-4 text-brand-black uppercase leading-[0.94] text-[clamp(2rem,5vw,4rem)]"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              Subscribe to Notes
            </h1>
            <p
              className="mt-5 max-w-2xl text-[18px] leading-[1.75] text-ui-gray-700"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              More like this, once a week. Brand breakdowns, marketing systems,
              and what actually works for sport businesses and founders. No
              pitch. Just the thinking.
            </p>

            <NotesSubscribeForm
              offer="newsletter-page-notes"
              className="mt-8"
              layout="stacked"
              inputClassName="bg-white"
            />
          </div>
        </section>

        {cards.length > 0 ? (
          <section className="px-6 pb-16 md:px-10 md:pb-20 lg:px-16">
            <div className="mx-auto max-w-6xl">
              <h2
                className="text-brand-black text-center text-[clamp(1.6rem,3.8vw,2.8rem)] leading-[1.02]"
                style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
              >
                Here are my last articles
              </h2>
              <p
                className="mt-3 mx-auto max-w-4xl text-center text-[16px] leading-[1.75] text-ui-gray-700"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 400,
                }}
              >
                You will learn how cult brands are built in practice — from
                positioning and messaging to conversion mechanics, retention,
                and content systems you can actually apply.
              </p>

              <div className="mt-8">
                <ArticlesHomeCarousel cards={cards} />
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
