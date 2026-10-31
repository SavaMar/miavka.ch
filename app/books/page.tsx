import type { Metadata } from "next";
import Nav from "@/components/Nav";
import BooksLibrary, { type BookItem } from "@/components/books/BooksLibrary";
import PersonalFooter from "@/components/home/PersonalFooter";
import BooksPattern, { BOOKS_BG_COLOR } from "@/components/books/BooksPattern";
import books from "@/data/books.json";

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
        <BooksPattern />
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
