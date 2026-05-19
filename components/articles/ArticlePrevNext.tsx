import Link from "next/link";
import type { AdjacentArticleLink } from "@/lib/articles";

type Props = {
  prev: AdjacentArticleLink | null;
  next: AdjacentArticleLink | null;
};

export default function ArticlePrevNext({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <section className="border-t border-ui-gray-300 bg-brand-black px-6 py-16 md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-6">
        <div className="min-w-0">
          {prev ? (
            <Link
              href={prev.href}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
            >
              <span className="mb-3 block text-3xl font-light text-brand-cream transition-colors group-hover:text-brand-red">
                ←
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-cream/70">
                Previous article
              </span>
              <span
                className="mt-2 block text-lg font-black leading-snug text-brand-cream underline decoration-ui-gray-700 underline-offset-4 transition-colors group-hover:decoration-brand-red md:text-xl"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
        <div className="min-w-0 text-left md:text-right">
          {next ? (
            <Link
              href={next.href}
              className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
            >
              <span className="mb-3 block text-3xl font-light text-brand-cream transition-colors group-hover:text-brand-red md:text-right">
                →
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-cream/70 md:text-right">
                Next article
              </span>
              <span
                className="mt-2 block text-lg font-black leading-snug text-brand-cream underline decoration-ui-gray-700 underline-offset-4 transition-colors group-hover:decoration-brand-red md:text-xl md:text-right"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
