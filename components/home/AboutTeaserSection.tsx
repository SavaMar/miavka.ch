import Link from "next/link";
import AboutHeroStyleCarousel from "@/components/home/AboutHeroStyleCarousel";

export default function AboutTeaserSection() {
  return (
    <section className="border-b border-[#161515]/25 bg-[#161515] px-4 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto w-full max-w-[1680px] pt-2">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
          <div className="lg:mx-auto lg:max-w-[620px] lg:text-right">
            <h2
              className="uppercase text-[#F4F4F0]"
              style={{
                fontFamily: "'TG Girthy', Impact, sans-serif",
                fontSize: "clamp(2.2rem, 5vw, 4.8rem)",
                lineHeight: 0.9,
              }}
            >
              About Me
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#F4F4F0]">
              I am a writer, builder, and magician of frameworks. I study how
              people decide, how messages travel, and how identity can be
              rebuilt in public without losing depth.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#F4F4F0]/80">
              This site is a working notebook: ideas in motion, experiments in
              structure, and documents from the edge between clarity and chaos.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block rounded-[5px] border border-[#F4F4F0] px-4 py-2 text-[11px] uppercase text-[#F4F4F0] transition-colors hover:bg-[#D0320E] hover:text-[#161515]"
              style={{
                fontFamily:
                  "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                letterSpacing: "0.08em",
              }}
            >
              [ FULL STORY → ]
            </Link>

            <div className="mt-6 rounded-[5px] bg-[#F4F4F0] p-5 text-left md:p-6">
              <h3
                className="uppercase text-[#161515]"
                style={{
                  fontFamily: "'TG Girthy', Impact, sans-serif",
                  fontSize: "clamp(1.6rem, 3vw, 2.3rem)",
                  lineHeight: 0.95,
                }}
              >
                My art
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[#161515]/75">
                A light block for visual experiments and selected projects.
              </p>
            </div>
          </div>

          <div className="w-full lg:justify-self-start">
            <AboutHeroStyleCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
