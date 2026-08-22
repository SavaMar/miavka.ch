import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";

export const metadata: Metadata = {
  title: "Now | Mari Miavka",
  description: "What I am reading, building, and living right now.",
};

const NOW_ENTRIES = [
  {
    date: "2026-07-27",
    reading: "Constraint-led design systems and modern editorial sites.",
    building: "A personal writing engine with reusable article primitives.",
    life: "Recovering depth: fewer inputs, longer focus blocks, daily walks.",
  },
  {
    date: "2026-06-17",
    reading: "StoryBrand 2.0 and positioning through decision psychology.",
    building: "Multilingual article architecture with structured metadata.",
    life: "Practicing deliberate boredom to think more clearly.",
  },
] as const;

function formatLongDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NowPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#F4F4F0] px-4 pb-10 pt-22 text-brand-black md:px-8 md:pb-12 md:pt-24 lg:px-12">
        <div className="mx-auto w-full max-w-420 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1
              className="uppercase"
              style={{
                fontFamily: "'TG Girthy', Impact, sans-serif",
                fontSize: "clamp(2rem, 7vw, 8rem)",
                lineHeight: 0.9,
              }}
            >
              [ NOW ]
            </h1>
          </div>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-black/80 md:text-lg">
            Current entries first, then archive snapshots. Updated when real
            direction changes.
          </p>

          <ol className="mt-8 space-y-8">
            {NOW_ENTRIES.map((entry) => (
              <li key={entry.date} className="border-t border-brand-black/25 pt-5">
                <p
                  className="text-[11px] uppercase text-brand-black/75"
                  style={{
                    fontFamily:
                      "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                    letterSpacing: "0.08em",
                  }}
                >
                  LAST UPDATED: {formatLongDate(entry.date)}
                </p>
                <p className="mt-3 text-base leading-relaxed md:text-lg">
                  <strong>Reading:</strong> {entry.reading}
                </p>
                <p className="mt-2 text-base leading-relaxed md:text-lg">
                  <strong>Building:</strong> {entry.building}
                </p>
                <p className="mt-2 text-base leading-relaxed md:text-lg">
                  <strong>Life:</strong> {entry.life}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
