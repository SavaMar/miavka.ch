import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";
import Reveal from "@/components/motion/Reveal";
import { AtSign, Instagram, Linkedin, Youtube } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Mari Miavka",
  description: "About Mari Miavka — marketer, software developer and AI and automation strategist.",
};

const ABOUT_BG_COLOR = "#FFFFFF";
const ABOUT_PATTERN_COLOR = "#BAB7B7";
const ABOUT_PATTERN_OPACITY = 0.3;
const ABOUT_GALLERY_IMAGES = [
  "/images/about/1.png",
  "/images/about/2.png",
  "/images/about/3.png",
  "/images/about/4.png",
  "/images/about/5.png",
  "/images/about/6.png",
] as const;

export default function AboutPage() {
  return (
    <>
      <Nav theme="dark" />
      <main
        className="relative min-h-screen overflow-hidden pb-20 pt-8 md:pb-28 md:pt-10"
        style={{ backgroundColor: ABOUT_BG_COLOR }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundColor: ABOUT_PATTERN_COLOR,
            opacity: ABOUT_PATTERN_OPACITY,
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

        <section className="relative z-10 mt-10 px-6 md:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl rounded-[10px] bg-[#0A0A0A] p-6 md:p-8 lg:p-10">
            <div className="grid gap-6 md:grid-cols-[320px_minmax(0,1fr)] md:items-center lg:grid-cols-[360px_minmax(0,1fr)]">
              <Reveal
                fade={false}
                y={20}
                className="relative mx-auto aspect-4/5 w-full max-w-80 overflow-hidden rounded-md md:mx-0 lg:max-w-90"
              >
                <Image
                  src="/images/about/main.jpeg"
                  alt="Mari Miavka portrait"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                  priority
                />
              </Reveal>
              <Reveal fade={false} y={20} delay={0.08}>
                <h1
                  className="text-brand-red"
                  style={{
                    fontFamily: "'TG Girthy', Impact, sans-serif",
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    lineHeight: 0.95,
                  }}
                >
                  MARI MIAVKA
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/45">
                    <Instagram className="h-4 w-4" aria-hidden />
                  </span>
                  <Link
                    href="https://www.linkedin.com/in/mari-miavka/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/55 transition-colors hover:border-[#0A66C2] hover:text-[#0A66C2]"
                  >
                    <Linkedin className="h-4 w-4" aria-hidden />
                  </Link>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/45">
                    <Youtube className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/45">
                    <AtSign className="h-4 w-4" aria-hidden />
                  </span>
                </div>
                <p
                  className="max-w-3xl text-base leading-relaxed text-[#F4F4F0]"
                  style={{
                    fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 700,
                    marginTop: "45px",
                  }}
                >
                  Educate yourself. Nobody else will.
                </p>
                <p
                  className="mt-2 max-w-3xl text-base leading-relaxed text-[#F4F4F0]/72 italic"
                  style={{
                    fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                    fontWeight: 300,
                  }}
                >
                  Watching someone I love die taught me the life I have is now,
                  not later.
                </p>
              </Reveal>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {ABOUT_GALLERY_IMAGES.map((src, index) => (
                <Reveal
                  key={src}
                  delay={(index % 3) * 0.05}
                  className="relative aspect-4/3 overflow-hidden rounded-lg bg-white/10"
                >
                  <Image
                    src={src}
                    alt={`About photo ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 16vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 mt-8 px-6 md:px-10 lg:px-16">
          <Reveal className="mx-auto max-w-7xl rounded-[10px] bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,0.07)] md:p-8 lg:p-10"
          >
            <h1
              className="mb-5 text-brand-red"
              style={{
                fontFamily: "'TG Girthy', Impact, sans-serif",
                fontSize: "clamp(1.85rem, 4vw, 2.6rem)",
                lineHeight: 0.95,
              }}
            >
              About Me
            </h1>
            <div className="grid gap-6 text-brand-black">
              <p
                className="max-w-4xl text-lg leading-relaxed"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                I work where software development meets marketing. I think in
                systems and I have strong pattern recognition: I see how the
                parts of a business connect and where they break. I build brand
                and marketing systems for businesses that move fast:
                positioning, customer language, websites, funnels and
                automations, the full presence that makes the right people
                choose you.
              </p>
              <p
                className="max-w-4xl text-lg leading-relaxed text-brand-black/80"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                I&apos;m self-taught. No degree, no bootcamp: pet projects and
                stubbornness built my software career, and it took me from
                Ukraine to Krakow, Berlin and Zurich. Along the way I competed
                in downhill cycling at national level and turned a camera into
                a way into companies. I learned how to learn anything, and
                that&apos;s the most useful thing I own.
              </p>
              <p
                className="max-w-4xl text-lg leading-relaxed text-brand-black/80"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                Right now I&apos;m at Creaholic, the Swiss invention studio in
                Biel founded by Elmar Mock, co-inventor of the Swatch. I came
                in and told them what was wrong with their digital presence,
                what I could fix, and in what timeline. They saw the value,
                gave me a chance to prove it, and now trust me to build a
                better presence for them: the automations and the full
                marketing system. It uses everything I know, code and marketing
                together.
              </p>
              <p
                className="max-w-4xl text-lg leading-relaxed text-brand-black/80"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                Alongside Creaholic, I guide other businesses with a clear,
                actionable plan to strengthen how they show up online. My
                method is the same every time: decide what you actually want,
                find the gap, fill it with knowledge, move. I work with
                builders: curious, self-taught, decisive, allergic to average.
              </p>
              <p
                className="max-w-4xl text-lg leading-relaxed text-brand-black/80"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                I&apos;m sharp because vague help is useless. I&apos;m transparent
                because I say what I see.
              </p>
              <p
                className="max-w-4xl text-lg leading-relaxed text-brand-black/80"
                style={{
                  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                This site is my working notebook: AI experiments, productivity
                systems, marketing lessons and what I learn building a business
                in Switzerland as an expat.
              </p>
            </div>
          </Reveal>
        </section>
      </main>
      <PersonalFooter />
    </>
  );
}
