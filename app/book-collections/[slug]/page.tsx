import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";
import BookCover from "@/components/books/BookCover";
import BooksPattern, { BOOKS_BG_COLOR } from "@/components/books/BooksPattern";
import CollectionIcon from "@/components/books/CollectionIcon";
import type { BookItem } from "@/components/books/BooksLibrary";
import {
  BOOK_COLLECTIONS,
  getCollection,
  getCollectionBooks,
} from "@/content/book-collections";

type Props = {
  params: Promise<{ slug: string }>;
};

const MONO_STYLE = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
  letterSpacing: "0.08em",
} as const;

const DISPLAY_STYLE = { fontFamily: "'TG Girthy', Impact, sans-serif" } as const;

const LABEL_CLASS = "text-[11px] uppercase text-[#161515]/60";

export const dynamicParams = false;

export function generateStaticParams() {
  return BOOK_COLLECTIONS.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: `${collection.title} | Book Collections | Mari Miavka`,
    description: `${collection.forWho} ${collection.why}`,
  };
}

/** Some titles in books.json put the subtitle on its own line. */
function cleanTitle(title: string) {
  return title.trim().replace(/\s*\n+\s*/g, ": ").replace(/\s+/g, " ");
}

function Score({ score }: { score: BookItem["myScore"] | undefined }) {
  if (score === "lifechanging") {
    return (
      <p className="text-[11px] uppercase text-[#D0320E]" style={MONO_STYLE}>
        ★ Life changing
      </p>
    );
  }
  if (typeof score === "number") {
    const stars = Math.max(0, Math.min(5, Math.round(score)));
    return (
      <p
        className="text-base leading-none tracking-[0.15em] text-[#C9992A]"
        role="img"
        aria-label={`${stars} out of 5`}
      >
        {"★".repeat(stars)}
        <span className="text-[#161515]/20">{"★".repeat(5 - stars)}</span>
      </p>
    );
  }
  return (
    <p className="text-[11px] uppercase text-[#161515]/55" style={MONO_STYLE}>
      Not rated yet
    </p>
  );
}

export default async function BookCollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const collectionBooks = getCollectionBooks(collection);
  const otherCollections = BOOK_COLLECTIONS.filter((item) => item.slug !== collection.slug);

  return (
    <>
      <Nav />
      <main className="min-h-[60vh] bg-[#F4F4F0] text-[#161515]">
        <div className="mx-auto max-w-[1680px] px-4 pb-10 pt-10 md:px-8 md:pb-12 lg:px-12">
          <Link
            href="/book-collections"
            className="text-[11px] uppercase underline underline-offset-2 hover:text-[#D0320E]"
            style={MONO_STYLE}
          >
            ← All collections
          </Link>

          <header className="mt-6 border-t-4 pt-5" style={{ borderTopColor: collection.color }}>
            <p className={LABEL_CLASS} style={MONO_STYLE}>
              [ Book collection · {collectionBooks.length} books ]
            </p>
            <div className="mt-2 flex items-center gap-4">
              <CollectionIcon collection={collection} size="lg" />
              <h1
                className="uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95]"
                style={DISPLAY_STYLE}
              >
                {collection.title}
              </h1>
            </div>

            <div className="mt-6 grid max-w-5xl gap-6 md:grid-cols-2">
              <div>
                <h2 className={LABEL_CLASS} style={MONO_STYLE}>
                  Who it&apos;s for
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-[#161515]/85">
                  {collection.forWho}
                </p>
              </div>
              <div>
                <h2 className={LABEL_CLASS} style={MONO_STYLE}>
                  Why these books
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-[#161515]/85">
                  {collection.why}
                </p>
              </div>
            </div>
          </header>
        </div>

        <section
          aria-label={`Books in ${collection.title}`}
          className="relative overflow-hidden px-4 py-10 md:px-8 md:py-14 lg:px-12"
          style={{ backgroundColor: BOOKS_BG_COLOR }}
        >
          <BooksPattern />
          <ol className="relative z-10 mx-auto grid max-w-[1680px] gap-4">
            {collectionBooks.map((book) => {
              const title = cleanTitle(book.title);
              const quotes = (book.quotes ?? []).slice(0, 3);
              return (
                <li
                  key={book.id}
                  className="grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-5 rounded-[5px] border border-[#161515]/20 bg-[#F9F8F4] p-4 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1.1fr)] md:gap-6 md:p-5"
                >
                  <div className="relative aspect-[2/3] w-full self-start overflow-hidden bg-[#161515]/8">
                    <BookCover title={title} cover={book.cover} />
                  </div>

                  <div>
                    <Score score={book.myScore} />
                    <h2
                      className="mt-2 text-[1.15rem] leading-tight"
                      style={{ fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif" }}
                    >
                      {title}
                    </h2>
                    <p className="mt-1 text-sm text-[#161515]/65">by {book.author}</p>
                    <p className="mt-3 text-base leading-relaxed text-[#161515]/85">
                      {book.description}
                    </p>
                  </div>

                  {quotes.length > 0 ? (
                    <ul className="col-span-2 grid content-start gap-3 md:col-span-1" aria-label="Quotes">
                      {quotes.map((quote) => (
                        <li key={quote}>
                          <blockquote className="border-l-2 border-[#D0320E] pl-3 italic leading-relaxed text-[#161515]/85">
                            &ldquo;{quote}&rdquo;
                          </blockquote>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        <nav
          className="mx-auto max-w-[1680px] px-4 pb-20 pt-10 md:px-8 md:pb-24 lg:px-12"
          aria-label="Other book collections"
        >
          <Link
            href="/book-collections"
            className="text-[11px] uppercase underline underline-offset-2 hover:text-[#D0320E]"
            style={MONO_STYLE}
          >
            ← All collections
          </Link>
          <h2 className={`${LABEL_CLASS} mt-8`} style={MONO_STYLE}>
            More collections
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {otherCollections.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/book-collections/${item.slug}`}
                  className="inline-flex min-h-11 items-center gap-2.5 rounded-[5px] border border-[#161515]/25 py-2 pl-2 pr-3 text-[11px] uppercase transition-colors hover:border-(--accent) hover:bg-(--accent)/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                  style={{ ...MONO_STYLE, "--accent": item.color } as CSSProperties}
                >
                  <CollectionIcon collection={item} size="sm" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
      <PersonalFooter />
    </>
  );
}
