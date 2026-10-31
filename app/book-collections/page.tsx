import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";
import CollectionIcon from "@/components/books/CollectionIcon";
import {
  BOOK_COLLECTIONS,
  GOODREADS_URL,
  getCollectionBooks,
} from "@/content/book-collections";

export const metadata: Metadata = {
  title: "Book Collections | Mari Miavka",
  description:
    "Book collections by Mari Miavka: marketing, business, systems thinking, science, focus, psychology, communication, money and creativity.",
};

const MONO_STYLE = {
  fontFamily: "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
  letterSpacing: "0.08em",
} as const;

const DISPLAY_STYLE = { fontFamily: "'TG Girthy', Impact, sans-serif" } as const;

const BUTTON_CLASS =
  "inline-flex min-h-11 items-center rounded-[5px] border border-[#161515] px-4 py-2 text-[11px] uppercase transition-colors hover:bg-[#D0320E] hover:text-[#161515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]";

export default function BookCollectionsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[60vh] bg-[#F4F4F0] px-4 pb-20 pt-10 text-[#161515] md:px-8 md:pb-24 lg:px-12">
        <div className="mx-auto max-w-[1680px]">
          <h1
            className="uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95]"
            style={DISPLAY_STYLE}
          >
            Book Collections
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#161515]/75 md:text-lg">
            The books I&apos;ve read, grouped by what they help you do. Pick a
            topic to see each book with a short description, three quotes and my
            score.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/books" className={BUTTON_CLASS} style={MONO_STYLE}>
              [ All books ]
            </Link>
            <a
              href={GOODREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={BUTTON_CLASS}
              style={MONO_STYLE}
            >
              [ My full list on Goodreads ↗ ]
            </a>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {BOOK_COLLECTIONS.map((collection) => {
              const collectionBooks = getCollectionBooks(collection);
              return (
                <li key={collection.slug}>
                  <Link
                    href={`/book-collections/${collection.slug}`}
                    className="group flex h-full flex-col rounded-[5px] border border-t-4 border-[#161515]/20 border-t-(--accent) bg-[#F9F8F4] p-5 transition-colors hover:border-(--accent) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent)"
                    style={{ "--accent": collection.color } as CSSProperties}
                  >
                    <div className="flex items-center gap-4">
                      <CollectionIcon collection={collection} />
                      <h2
                        className="uppercase text-[1.4rem] leading-tight transition-colors group-hover:text-(--accent)"
                        style={DISPLAY_STYLE}
                      >
                        {collection.title}
                      </h2>
                    </div>
                    <p className="mt-3 text-[#161515]/75">{collection.forWho}</p>
                    <p
                      className="mt-auto pt-4 text-[11px] uppercase text-[#161515]/60"
                      style={MONO_STYLE}
                    >
                      {collectionBooks.length} books →
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
