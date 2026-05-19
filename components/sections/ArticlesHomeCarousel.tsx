"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { HomeCarouselCard } from "@/lib/article-shared";

type Props = {
  cards: HomeCarouselCard[];
};

/** Mobile: 1 full + 20% peek. Tablet+: 2 full + 20% peek. */
const SCROLL_CARD =
  "min-w-[calc((100%-10px)/1.2)] w-[calc((100%-10px)/1.2)] md:min-w-[calc((100%-20px)/2.2)] md:w-[calc((100%-20px)/2.2)] shrink-0 snap-start";

function homeArticleHref(slug: string, lang: string): string {
  return `/articles/${slug}?lang=${lang}`;
}

function HomeArticleCard({ card }: { card: HomeCarouselCard }) {
  const { slug, lang, item } = card;
  const href = homeArticleHref(slug, lang);

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border border-ui-gray-300 bg-brand-cream">
      <Link
        href={href}
        className="block w-full bg-brand-black px-3 pt-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        <div className="relative aspect-video w-full">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-contain object-top"
            sizes="(max-width: 767px) 84vw, (max-width: 1023px) 42vw, 50vw"
          />
        </div>
      </Link>

      <Link
        href={href}
        className="group flex min-h-0 flex-1 flex-col bg-brand-black p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
      >
        <p
          className="mb-2 line-clamp-2 min-h-[2.7rem] text-sm font-black leading-snug text-white transition-colors duration-700 ease-in-out group-hover:text-brand-red md:min-h-12 md:text-base"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {item.title}
        </p>
        <p
          className="line-clamp-3 min-h-13 text-xs leading-snug text-brand-cream md:min-h-[3.9rem] md:text-sm"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          {item.excerpt}
        </p>
      </Link>
    </div>
  );
}

export default function ArticlesHomeCarousel({ cards }: Props) {
  const pages = useMemo(() => {
    const out: HomeCarouselCard[][] = [];
    for (let i = 0; i < cards.length; i += 2) {
      out.push(cards.slice(i, i + 2));
    }
    return out;
  }, [cards]);

  const pageCount = Math.max(1, pages.length);
  const [page, setPage] = useState(0);

  const canPrev = page > 0;
  const canNext = page < pageCount - 1;

  const goPrev = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPage((p) => Math.min(pageCount - 1, p + 1));
  }, [pageCount]);

  if (cards.length === 0) {
    return null;
  }

  const slidePercent = 100 / pageCount;

  return (
    <>
      {/* Mobile & tablet: horizontal scroll — 2 full cards + ~20% of the next */}
      <div className="lg:hidden">
        <div className="max-w-6xl" role="region" aria-label="Article carousel">
          <ul className="flex w-full touch-pan-x gap-[10px] overflow-x-auto overflow-y-hidden pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory motion-reduce:overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {cards.map((card) => (
              <li key={`${card.slug}-${card.lang}`} className={SCROLL_CARD}>
                <HomeArticleCard card={card} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop: arrows + sliding 2-up track */}
      <div className="mx-auto hidden max-w-6xl items-stretch gap-2 md:gap-4 lg:flex">
        <CarouselArrow
          direction="prev"
          label="Previous articles"
          disabled={!canPrev}
          onClick={goPrev}
        />

        <div className="min-w-0 flex-1 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{
              width: `${pageCount * 100}%`,
              transform: `translateX(-${page * slidePercent}%)`,
            }}
          >
            {pages.map((pair, slideIdx) => (
              <div
                key={slideIdx}
                className="grid shrink-0 grid-cols-2 gap-[10px]"
                style={{ width: `${slidePercent}%` }}
              >
                {pair.map((card) => (
                  <HomeArticleCard
                    key={`${card.slug}-${card.lang}`}
                    card={card}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow
          direction="next"
          label="Next articles"
          disabled={!canNext}
          onClick={goNext}
        />
      </div>
    </>
  );
}

function CarouselArrow({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-12 w-12 shrink-0 items-center justify-center self-center text-4xl font-light leading-none text-brand-black transition-colors hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-brand-black md:h-14 md:w-14 md:text-5xl lg:h-16 lg:w-16 lg:text-6xl"
    >
      {direction === "prev" ? "‹" : "›"}
    </button>
  );
}
