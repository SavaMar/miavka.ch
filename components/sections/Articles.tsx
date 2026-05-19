import LiquidButton from "@/components/LiquidButton";
import type { HomeCarouselCard, Lang } from "@/lib/article-shared";
import { getAllArticles } from "@/lib/articles";
import ArticlesHomeCarousel from "@/components/sections/ArticlesHomeCarousel";

const CAROUSEL_LANG_ORDER: Lang[] = ["en", "de", "fr"];

export default async function Articles() {
  const [en, de, fr] = await Promise.all([
    getAllArticles("en"),
    getAllArticles("de"),
    getAllArticles("fr"),
  ]);

  const top2 = en.slice(0, 2);

  const cards: HomeCarouselCard[] = [];
  const listFor = (lang: Lang) =>
    lang === "en" ? en : lang === "de" ? de : fr;

  for (const enItem of top2) {
    for (const lang of CAROUSEL_LANG_ORDER) {
      const item = listFor(lang).find((a) => a.slug === enItem.slug);
      if (item) {
        cards.push({ slug: enItem.slug, lang, item });
      }
    }
  }

  if (cards.length === 0) {
    return null;
  }

  return (
    <section
      id="articles"
      className="scroll-mt-24 bg-brand-cream px-6 pb-20 md:scroll-mt-28 md:px-10 md:pb-28 lg:px-16"
    >
      <ArticlesHomeCarousel cards={cards} />

      <div className="mx-auto mt-10 flex max-w-6xl justify-center md:mt-16">
        <LiquidButton
          href="/articles"
          className="border-2 border-brand-red bg-brand-cream px-7 py-2.5 text-md font-body font-bold uppercase text-brand-black md:px-10 md:py-3 md:text-md"
          fillClassName="bg-brand-red"
          labelHoverClassName="group-hover:text-brand-cream"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          SHOW ALL ARTICLES
        </LiquidButton>
      </div>
    </section>
  );
}
