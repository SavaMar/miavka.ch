"use client";

import { useEffect, useMemo, useState } from "react";

type BookScore = number | "lifechanging";

export type BookItem = {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  hashtags: string[];
  myScore: BookScore;
  translation: string[];
  quotes: string[];
};

const POPULAR_TAGS_LIMIT = 16;

function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

function scoreToLabel(score: BookScore): string | null {
  if (score === "lifechanging") return "Life changing";
  if (typeof score === "number" && score >= 5) return "Top pick";
  return null;
}

function scoreToFilterKey(score: BookScore): "lifechanging" | "top-pick" | "other" {
  if (score === "lifechanging") return "lifechanging";
  if (typeof score === "number" && score >= 5) return "top-pick";
  return "other";
}

function coverProxyUrl(url: string): string {
  if (!url) return "";
  return `https://images.weserv.nl/?url=${encodeURIComponent(
    url.replace(/^https?:\/\//, "")
  )}`;
}

function BookCover({ book }: { book: BookItem }) {
  const [src, setSrc] = useState(book.cover);
  const [didRetryViaProxy, setDidRetryViaProxy] = useState(false);
  const [showFallback, setShowFallback] = useState(!book.cover);

  if (showFallback) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#201f1c] p-3 text-center text-sm font-semibold leading-tight text-[#F4F4F0]/75">
        {book.title}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${book.title} cover`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-contain"
      onError={() => {
        if (!didRetryViaProxy && book.cover) {
          setDidRetryViaProxy(true);
          setSrc(coverProxyUrl(book.cover));
          return;
        }
        setShowFallback(true);
      }}
    />
  );
}

export default function BooksLibrary({ books }: { books: BookItem[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [scoreFilter, setScoreFilter] = useState<"all" | "lifechanging" | "top-pick">(
    "all"
  );
  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  const allTags = useMemo(() => {
    const tags = new Map<string, number>();
    books.forEach((book) => {
      book.hashtags.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1));
    });
    return [...tags.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .map(([tag]) => tag);
  }, [books]);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = normalizeText(query);
    return books
      .filter((book) => {
        if (activeTag && !book.hashtags.includes(activeTag)) return false;
        if (scoreFilter !== "all" && scoreToFilterKey(book.myScore) !== scoreFilter)
          return false;
        if (!normalizedQuery) return true;

        const searchable = [
          book.title,
          book.author,
          book.description,
          ...book.hashtags.map((tag) => `#${tag}`),
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
      .sort((a, b) => b.id - a.id);
  }, [activeTag, books, query, scoreFilter]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedBook(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedBook ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBook]);

  return (
    <>
      <section className="mt-8" aria-label="Book filters">
        <div className="grid gap-2 md:grid-cols-[1fr_180px_auto]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, author, or hashtag..."
            autoComplete="off"
            className="h-11 rounded-[5px] border border-[#161515]/25 bg-[#F4F4F0] px-3 text-sm text-[#161515] placeholder:text-[#161515]/45 focus:border-[#D0320E] focus:outline-none"
          />
          <select
            value={scoreFilter}
            onChange={(event) =>
              setScoreFilter(event.target.value as "all" | "lifechanging" | "top-pick")
            }
            className="h-11 rounded-[5px] border border-[#161515]/25 bg-[#F4F4F0] px-3 text-sm text-[#161515] focus:border-[#D0320E] focus:outline-none"
          >
            <option value="all">All scores</option>
            <option value="lifechanging">Life changing</option>
            <option value="top-pick">Top pick</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTag(null);
              setScoreFilter("all");
              setShowAllTags(false);
            }}
            className="h-11 rounded-[5px] border border-[#161515]/25 px-4 text-[11px] uppercase text-[#161515] transition-colors hover:bg-[#D0320E] hover:text-[#161515]"
            style={{
              fontFamily:
                "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.08em",
            }}
          >
            Clear
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <p
            className="text-[11px] uppercase text-[#F4F4F0]/70"
            style={{
              fontFamily:
                "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.08em",
            }}
          >
            Popular hashtags
          </p>
          <button
            type="button"
            onClick={() => setShowAllTags((value) => !value)}
            className="rounded-[5px] border border-[#D0320E] bg-[#F4F4F0] px-3 py-1.5 text-[10px] uppercase text-[#161515] transition-colors hover:bg-[#D0320E] hover:text-[#161515]"
            style={{
              fontFamily:
                "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.08em",
            }}
            hidden={allTags.length <= POPULAR_TAGS_LIMIT}
          >
            {showAllTags ? "Show fewer tags" : "Show all tags"}
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(showAllTags ? allTags : allTags.slice(0, POPULAR_TAGS_LIMIT)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((prev) => (prev === tag ? null : tag))}
              className={`rounded-[5px] border px-3 py-1 text-[11px] uppercase transition-colors ${
                activeTag === tag
                  ? "border-[#D0320E] bg-[#D0320E] text-[#F4F4F0]"
                  : "border-[#F4F4F0]/35 bg-[#F4F4F0] text-[#161515] hover:bg-[#E8E5DE]"
              }`}
              style={{
                fontFamily:
                  "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                letterSpacing: "0.08em",
              }}
            >
              #{tag}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {filteredBooks.map((book) => {
          const scoreLabel = scoreToLabel(book.myScore);
          return (
            <button
              key={book.id}
              type="button"
              onClick={() => setSelectedBook(book)}
              className="group cursor-pointer overflow-hidden rounded-[5px] border border-[#F4F4F0]/18 bg-[#1B1A18] text-left transition-[transform,border-color] duration-200 hover:scale-[1.01] hover:border-[#D0320E]/65"
            >
              <div className="relative aspect-[2/3]">
                <BookCover book={book} />
                <div className="pointer-events-none absolute inset-0 bg-[#161515]/0 transition-colors duration-300 group-hover:bg-[#161515]/18" />
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  {/* Subtle brand mark appears on hover */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo.png"
                    alt=""
                    aria-hidden
                    className="h-10 w-10 -translate-y-1 scale-95 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-80"
                  />
                </div>
                {scoreLabel ? (
                  <span className="absolute right-2 top-2 rounded-[5px] border border-[#F4F4F0]/35 bg-[#161515]/75 px-2 py-1 text-[10px] uppercase text-[#F3C95B]">
                    ★ {scoreLabel}
                  </span>
                ) : null}
              </div>
              <div className="flex min-h-[138px] flex-col gap-2 p-3">
                <h3
                  className="line-clamp-3 text-[1.06rem] leading-tight text-[#F4F4F0] transition-colors group-hover:text-[#D0320E]"
                  style={{ fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  {book.title}
                </h3>
                <p className="line-clamp-2 text-sm text-[#F4F4F0]/70">by {book.author}</p>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {book.hashtags.slice(0, 2).map((tag) => (
                    <span
                      key={`${book.id}-${tag}`}
                      className="rounded-[5px] border border-[#F4F4F0]/18 px-2 py-0.5 text-[10px] uppercase text-[#F4F4F0]/58"
                      style={{
                        fontFamily:
                          "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                        letterSpacing: "0.06em",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {filteredBooks.length === 0 ? (
        <p className="mt-8 text-center text-[#161515]/65">No books match your filters.</p>
      ) : null}

      {selectedBook ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-[#161515]/70"
            onClick={() => setSelectedBook(null)}
            aria-label="Close details"
          />
          <article className="relative z-10 max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-[5px] border border-[#161515]/20 bg-[#F4F4F0] p-5 md:p-6">
            <button
              type="button"
              onClick={() => setSelectedBook(null)}
              className="absolute right-3 top-2 text-3xl text-[#161515]/60 transition-colors hover:text-[#161515]"
              aria-label="Close details"
            >
              ×
            </button>
            <h2
              className="pr-8 uppercase text-[#161515]"
              style={{
                fontFamily: "'TG Girthy', Impact, sans-serif",
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                lineHeight: 0.95,
              }}
            >
              {selectedBook.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[#161515]/70">
              <p>Author: {selectedBook.author}</p>
              {scoreToLabel(selectedBook.myScore) ? (
                <p className="font-semibold text-[#C9992A]">★ {scoreToLabel(selectedBook.myScore)}</p>
              ) : null}
            </div>

            <section className="mt-5">
              <h3
                className="text-[11px] uppercase text-[#161515]/60"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.08em",
                }}
              >
                Description
              </h3>
              <p className="mt-2 leading-relaxed text-[#161515]/85">
                {selectedBook.description || "No description yet."}
              </p>
            </section>

            <section className="mt-5">
              <h3
                className="text-[11px] uppercase text-[#161515]/60"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.08em",
                }}
              >
                Tags
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedBook.hashtags.map((tag) => (
                  <span
                    key={`${selectedBook.id}-modal-${tag}`}
                    className="rounded-[5px] border border-[#161515]/20 px-2 py-0.5 text-xs text-[#161515]/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-5">
              <h3
                className="text-[11px] uppercase text-[#161515]/60"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.08em",
                }}
              >
                Quotes
              </h3>
              <ul className="mt-2 grid gap-3">
                {selectedBook.quotes.map((quote) => (
                  <li
                    key={`${selectedBook.id}-${quote}`}
                    className="border-l-2 border-[#D0320E] pl-3 italic leading-relaxed text-[#161515]/85"
                  >
                    {quote}
                  </li>
                ))}
              </ul>
            </section>
          </article>
        </div>
      ) : null}
    </>
  );
}
