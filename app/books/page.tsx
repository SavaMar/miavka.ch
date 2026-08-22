import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BooksLibrary, { type BookItem } from "@/components/books/BooksLibrary";
import PersonalFooter from "@/components/home/PersonalFooter";
import books from "@/data/books.json";

const BOOKS_BG_COLOR = "#262326";
const BOOKS_PATTERN_COLOR = "#5A2C33";
const BOOKS_PATTERN_OPACITY = 0.58;

export const metadata: Metadata = {
  title: "Books | Mari Miavka",
  description: "Books Mari Miavka reads, revisits, and recommends.",
};

export default function BooksPage() {
  const items = books as BookItem[];

  return (
    <>
      <Nav />
      <main
        className="relative min-h-[50vh] overflow-hidden px-6 pb-20 pt-10 text-[#F4F4F0] md:px-10 md:pb-24 lg:px-16"
        style={{ backgroundColor: BOOKS_BG_COLOR }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundColor: BOOKS_PATTERN_COLOR,
            opacity: BOOKS_PATTERN_OPACITY,
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
        <div className="relative z-10 mx-auto max-w-[1680px]">
          <h1
            className="mb-5 uppercase leading-none text-[clamp(2.2rem,5vw,4.2rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Books I&apos;ve read
          </h1>

          <p className="max-w-3xl text-base leading-relaxed text-[#F4F4F0]/80 md:text-lg">
            A collection of books that influenced me. Use search and hashtag
            filters to browse by topic.
          </p>

          <BooksLibrary books={items} />
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
