import Link from "next/link";
import AboutHeroStyleCarousel from "@/components/home/AboutHeroStyleCarousel";

export default function AboutTeaserSection() {
  return (
    <section className="border-b border-[#161515]/25 bg-[#161515] px-4 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto w-full max-w-[1680px] pt-2">
        <div className="grid gap-6 lg:grid-cols-[minmax(420px,560px)_minmax(420px,560px)] lg:items-stretch lg:justify-center lg:gap-14">
          <div className="w-full">
            <AboutHeroStyleCarousel />
          </div>

          <div className="w-full">
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
              I work where software development meets marketing, and I think in
              systems. I build websites, sales funnels and automations, and I
              help businesses improve their digital presence with a clear,
              actionable plan.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#F4F4F0]/80">
              Right now I&apos;m building automations and a full marketing system
              for{" "}
              <a
                href="https://www.creaholic.com/en"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#F4F4F0]/55 underline-offset-2 transition-colors hover:text-[#D0320E]"
              >
                Creaholic
              </a>
              , the Swiss innovation company in Biel founded by Elmar Mock,
              co-inventor of the Swatch. I love working there. It uses
              everything I know, from marketing to code. Alongside it, I keep
              growing my own practice, guiding businesses toward a stronger
              presence online.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#F4F4F0]/80">
              My goal is simple: to build a business where strategy and
              execution live together, so the plans I write are plans I can
              also build.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[#F4F4F0]/80">
              This site is my working notebook: AI experiments, productivity
              systems, marketing lessons and what I learn building a business
              in Switzerland as an expat.
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
          </div>
        </div>
      </div>
    </section>
  );
}
