import Image from "next/image";
import Link from "next/link";
import type { ArticleListItem } from "@/lib/article-shared";

function formatLongDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function readTimeLabel(minutes: number): string {
  return `${minutes} MIN READ`;
}

function resolveCategoryLabel(slug: string): string {
  if (slug === "story-brand") return "BOOK CLUB";
  if (slug === "corparate-lang") return "PSYCHOLOGY";
  if (slug === "h2h") return "PHILOSOPHY";
  if (slug.includes("boxraw")) return "BRAND STORY";
  return "BRAND STORY";
}

function resolveCategoryColor(slug: string): string {
  if (slug === "story-brand") return "#C9A24B";
  if (slug === "corparate-lang") return "#7A5C74";
  if (slug === "h2h") return "#4F7A6B";
  if (slug.includes("boxraw")) return "#E8320A";
  return "#E8320A";
}

export default function HomeArticlesSection({
  articles,
}: {
  articles: ArticleListItem[];
}) {
  return (
    <section className="border-b border-[#161515]/25 bg-[#F4F4F0] px-4 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="flex items-end gap-4 pt-1">
          <h2
            className="uppercase"
            style={{
              fontFamily: "'TG Girthy', Impact, sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 5.5rem)",
              lineHeight: 0.9,
            }}
          >
            Articles
          </h2>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <li key={article.slug}>
              <Link
                href={`/articles/${article.slug}`}
                className="group block h-full cursor-pointer"
              >
                <article className="flex h-full flex-col rounded-[5px] border border-[#161515]/25 bg-[#F4F4F0] p-5 transition-[transform,background-color,border-color] duration-200 ease-out group-hover:scale-[1.012] group-hover:border-[#D0320E]/60 group-hover:bg-[#F9F8F4]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={1200}
                    height={630}
                    className="h-auto w-full border border-[#161515]/20 object-cover"
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p
                      className="text-[11px] uppercase text-[#161515]/75"
                      style={{
                        fontFamily:
                          "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {formatLongDate(article.date)}
                    </p>
                    <span className="text-[#D0320E]">•</span>
                    <p
                      className="text-[11px] uppercase"
                      style={{
                        fontFamily:
                          "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                        letterSpacing: "0.08em",
                        color: resolveCategoryColor(article.slug),
                      }}
                    >
                      {resolveCategoryLabel(article.slug)}
                    </p>
                    <span className="text-[#D0320E]">•</span>
                    <p
                      className="text-[11px] uppercase text-[#161515]/75"
                      style={{
                        fontFamily:
                          "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {readTimeLabel(article.readTimeMinutes)}
                    </p>
                  </div>
                  <h3
                    className="mt-3 uppercase text-[#161515] transition-colors group-hover:text-[#D0320E]"
                    style={{
                      fontFamily: "'TG Girthy', Impact, sans-serif",
                      fontSize: "clamp(1.45rem, 2.6vw, 1.9rem)",
                      lineHeight: 0.9,
                    }}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-[#161515]/75">
                    {article.excerpt}
                  </p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-7">
          <Link
            href="/articles"
            className="inline-flex w-fit rounded-[5px] border border-[#161515] px-4 py-2 text-[11px] uppercase transition-colors hover:bg-[#D0320E] hover:text-[#161515]"
            style={{
              fontFamily:
                "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.08em",
            }}
          >
            [ SEE ALL ARTICLES ]
          </Link>
        </div>
      </div>
    </section>
  );
}
