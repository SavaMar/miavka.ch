import LiquidButton from "@/components/LiquidButton";
import AboutMeCarousel from "@/components/sections/AboutMeCarousel";

export default function AboutMe() {
  return (
    <section
      id="about-me"
      className="scroll-mt-24 bg-brand-cream px-6 py-20 md:scroll-mt-28 md:pt-10 md:pb-24 md:py-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-stretch md:gap-16 lg:gap-20">
          {/* Left — text; column stretches with carousel height; CTA pinned to bottom */}
          <div className="flex min-h-0 flex-col md:h-full">
            <h2
              className="mb-10 uppercase leading-none text-brand-black md:mb-5 text-[clamp(2rem,5vw,3.75rem)]"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              About Me
            </h2>

            <p
              className="max-w-xl text-black text-sm leading-relaxed md:text-base"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              Seven years as a software developer — Kyiv, Kraków, Berlin,
              Zurich. Always the one who cared too much about how things
              actually worked and why people stayed. Ex-professional athlete who
              never really left. I started showing up at sport events and
              competitions with a camera — and kept coming back, because that
              world felt like home. That&apos;s where I met them. Founders of
              martial arts gyms, fitness clubs, sport businesses. People with
              real culture, real results, real community — invisible online. I
              recognized the problem immediately. I got obsessed.Learned every
              system I could find. Built things, broke things, built them again.
              Turned out marketing is the most interesting engineering problem
              I&apos;d ever touched. That&apos;s where I live now. And I still
              get excited every single time.
            </p>

            <div className="mt-auto pt-10 md:pt-12">
              <LiquidButton
                href="#"
                className="rounded-[10px] border-2 border-brand-red bg-transparent px-4 py-4 text-sm font-bold uppercase text-brand-black md:px-10 md:py-5 md:text-base"
                labelHoverClassName="group-hover:text-brand-cream"
                style={{
                  fontFamily:
                    "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 700,
                }}
              >
                Read Full Story
              </LiquidButton>
            </div>
          </div>

          {/* Right — carousel */}
          <div>
            <AboutMeCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
