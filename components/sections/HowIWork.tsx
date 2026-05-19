import Image from "next/image";
import DiscoveryCallButton from "@/components/sections/DiscoveryCallButton";

/** Set to your embed URL or `NEXT_PUBLIC_HOW_I_WORK_YOUTUBE_VIDEO_ID` below. */
const HOW_I_WORK_YOUTUBE_EMBED_SRC =
  process.env.NEXT_PUBLIC_HOW_I_WORK_YOUTUBE_EMBED_URL ?? "";

/** If embed URL unset, iframe uses `youtube-nocookie.com/embed/${id}`. */
const HOW_I_WORK_YOUTUBE_VIDEO_ID =
  process.env.NEXT_PUBLIC_HOW_I_WORK_YOUTUBE_VIDEO_ID ?? "";

const STEPS = [
  {
    num: "1.",
    title: "Free call. I come in already working.",
    body: "30 minutes. Before we speak, I already looked at your website, your social presence, your customer journey. On the call I tell you everything I found — where you're losing people, where you're losing money, what's broken and what's just missing. No pitch. This is already the work.",
  },
  {
    num: "2.",
    title: "Audit. Every leak, named.",
    body: "I go deep into your business — how people find you, what they see, where they leave, and why they don't come back. Website, tone of voice, customer journey, online presence vs. what you actually are in person. You get a written document: every gap identified, every leak named, three immediate priorities. This is yours whether we work together or not.",
  },
  {
    num: "3.",
    title: "The plan. Built for your business specifically.",
    body: "Based on everything I found, we build your individual roadmap. Customer journey, content system, voice, email infrastructure, lifecycle architecture. Visual identity is part of this — but it follows the strategy, it doesn't lead it.",
  },
  {
    num: "4.",
    title: "We shape the way. Together.",
    body: "I stay close for three months — enough time for the system to take root and start working in practice, not just on paper. At the end of month one, you get a full document: everything we fixed, how it's performing, what's next. And if month one doesn't deliver — month two is free. No conditions. No fine print.",
  },
];

function YoutubePlayGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 90 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="90" height="64" rx="14" fill="#FF0000" />
      <path d="M38 21v22l22-11z" fill="white" />
    </svg>
  );
}

function HowIWorkVideo() {
  const src =
    HOW_I_WORK_YOUTUBE_EMBED_SRC ||
    (HOW_I_WORK_YOUTUBE_VIDEO_ID
      ? `https://www.youtube-nocookie.com/embed/${HOW_I_WORK_YOUTUBE_VIDEO_ID}?rel=0`
      : "");

  return (
    <div className="mt-14 w-full md:mt-16 lg:mt-20">
      <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-lg">
        {src ? (
          <iframe
            title="How I work — video"
            className="absolute inset-0 size-full"
            src={src}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black"
            aria-hidden
          >
            <YoutubePlayGlyph className="h-14 w-20 shrink-0 md:h-19 md:w-[6.65rem]" />
          </div>
        )}
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded border border-white/25 bg-neutral-950/95 px-3 py-1.5 font-body text-[10px] font-black uppercase tracking-widest text-brand-cream md:bottom-6 md:text-xs">
          How I Work
        </div>
      </div>

      <div className="mt-10 flex justify-center md:mt-14">
        <DiscoveryCallButton>
          Book discovery call.
        </DiscoveryCallButton>
      </div>
    </div>
  );
}

export default function HowIWork() {
  return (
    <section
      id="how-i-work"
      className="relative scroll-mt-24 overflow-hidden bg-brand-black px-6 py-20 md:scroll-mt-28 md:px-10 md:py-28 lg:px-16"
    >

      {/* Oversized watermark logo */}
      <div className="pointer-events-none absolute right-0 top-1/2 w-[60vw] max-w-xl -translate-y-1/2 opacity-5">
        <Image
          src="/images/logo.png"
          alt=""
          width={600}
          height={600}
          className="size-full object-contain"
        />
      </div>

      <div className="relative mx-auto max-w-5xl xl:max-w-6xl">

        {/* Section heading — centered */}
        <h2
          className="mx-auto mb-10 text-center uppercase leading-none text-brand-cream md:mb-12 text-[clamp(2.5rem,7vw,6rem)]"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          How I Work
        </h2>

        {/* STEPS label */}
        <p
          className="mx-auto mb-10 text-center text-xs font-body font-black uppercase tracking-[0.35em] text-brand-cream md:mb-12 md:text-sm"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          }}
        >
          Steps
        </p>

        {/* Steps grid: 1|2 · 3|4 on md+ */}
        <ol className="grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12 lg:gap-x-14 lg:gap-y-14">
          {STEPS.map((step) => (
            <li key={step.num} className="border-t border-white/15 pt-8">
              <div className="flex gap-5 md:gap-8">
                <span className="mt-0.5 w-6 shrink-0 font-body text-sm font-black text-brand-red">
                  {step.num}
                </span>
                <div>
                  <h3 className="mb-2 font-body text-sm font-bold uppercase tracking-wide text-brand-cream">
                    {step.title}
                  </h3>
                  <p
                    className="font-body text-sm leading-relaxed text-brand-cream/60"
                    style={{ fontWeight: 300 }}
                  >
                    {step.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <HowIWorkVideo />
      </div>
    </section>
  );
}
