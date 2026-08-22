import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";

export const metadata: Metadata = {
  title: "Book Collections | Mari Miavka",
  description:
    "Curated book collections by theme: marketing, psychology, systems, and decision-making.",
};

const COLLECTIONS = [
  {
    title: "Marketing & Brand",
    description:
      "Positioning, messaging, and modern brand strategy books I return to often.",
  },
  {
    title: "Psychology & Behavior",
    description:
      "Books about attention, decision-making, emotional patterns, and human behavior.",
  },
  {
    title: "Systems & Thinking",
    description:
      "Frameworks for clarity, better decisions, and building durable personal systems.",
  },
  {
    title: "Business & Entrepreneurship",
    description:
      "Practical books on growth, offers, operations, and founder-level execution.",
  },
];

export default function BookCollectionsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[60vh] bg-[#F4F4F0] px-6 pb-20 pt-10 text-[#161515] md:px-10 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-[1680px]">
          <h1
            className="uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Book Collections
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#161515]/75 md:text-lg">
            A dedicated space for themed collections. This page is ready for
            continuous additions as your reading map expands.
          </p>

          <section className="mt-8 grid gap-4 md:grid-cols-2">
            {COLLECTIONS.map((collection) => (
              <article
                key={collection.title}
                className="rounded-[5px] border border-[#161515]/20 bg-[#F9F8F4] p-5"
              >
                <h2
                  className="uppercase text-[1.4rem] leading-tight text-[#161515]"
                  style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                >
                  {collection.title}
                </h2>
                <p className="mt-2 text-[#161515]/75">{collection.description}</p>
              </article>
            ))}
          </section>
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
