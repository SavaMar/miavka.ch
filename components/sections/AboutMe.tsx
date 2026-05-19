import LiquidButton from "@/components/LiquidButton";
import AboutMeCarousel from "@/components/sections/AboutMeCarousel";

export default function AboutMe() {
  return (
    <section
      id="about-me"
      className="scroll-mt-24 bg-brand-cream px-6 py-20 md:scroll-mt-28 md:px-10 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-stretch md:gap-16 lg:gap-20">
          {/* Left — text; column stretches with carousel height; CTA pinned to bottom */}
          <div className="flex min-h-0 flex-col md:h-full">
            <h2
              className="mb-10 uppercase leading-none text-brand-black md:mb-12 text-[clamp(2rem,5vw,3.75rem)]"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              About Me
            </h2>

            <p
              className="mb-6 max-w-xl text-brand-red md:mb-8 text-xl font-bold leading-snug md:text-[1.625rem]"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              I&apos;m Mari Miavka.
              <br />
              <span style={{ color: "#18181A" }}>Founder of</span> Miavka
              Studio.
            </p>

            <p
              className="max-w-xl text-black text-sm leading-relaxed md:text-base"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              I came to brand-building through software, photography, sport, and
              an obsession with how people are actually seen. I work with
              founder-led businesses across Europe — and I write about the
              brands that taught me everything I know.
            </p>

            <div className="mt-auto pt-10 md:pt-12">
              <LiquidButton
                href="#"
                className="border-2 border-brand-red px-4 py-4 font-body text-sm font-bold uppercase text-brand-black md:px-10 md:py-5 md:text-base"
                style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
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
