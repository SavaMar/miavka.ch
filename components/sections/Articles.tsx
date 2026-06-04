import LiquidButton from "@/components/LiquidButton";
import type { HomeCarouselCard } from "@/lib/article-shared";
import { getAllArticles, getAvailableLanguages } from "@/lib/articles";
import ArticlesHomeCarousel from "@/components/sections/ArticlesHomeCarousel";

export default async function Articles() {
  const en = await getAllArticles("en");

  const cards: HomeCarouselCard[] = await Promise.all(
    en.map(async (item) => {
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

  if (cards.length === 0) {
    return null;
  }

  return (
    <section
      id="articles"
      className="scroll-mt-24 bg-brand-cream px-6 pb-20 md:scroll-mt-28 md:px-10 md:pt-15 md:pb-28 lg:px-16"
    >
      <div className="mx-auto mb-10 max-w-6xl md:mb-12 text-center">
        <p
          className="text-brand-black text-center text-[clamp(1.5rem,3.5vw,2.35rem)] leading-[1.08]"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          Cult brands aren&apos;t built on luck. They&apos;re built on systems.
        </p>
        <p
          className="mt-7 mx-auto max-w-4xl text-center text-[17px] leading-[1.75] text-black"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          I study the brands that turned local businesses into cultural magnets
          — and write the kind of breakdown I wish someone had given me when I
          started. Philosophy, sales mechanics, lifecycle architecture, content
          rhythm. Everything that makes them impossible to copy at the surface —
          and possible to learn from underneath.
        </p>
      </div>

      <ArticlesHomeCarousel cards={cards} />

      <div className="mx-auto mt-10 flex max-w-6xl justify-center md:mt-16">
        <LiquidButton
          href="/articles"
          className="rounded-[10px] border-2 border-brand-red bg-transparent px-7 py-2.5 text-md font-bold uppercase text-brand-black md:px-10 md:py-3 md:text-md"
          fillClassName="bg-brand-red"
          labelHoverClassName="group-hover:text-brand-cream"
          style={{
            fontFamily:
              "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 700,
          }}
        >
          SHOW ALL ARTICLES
        </LiquidButton>
      </div>
    </section>
  );
}
