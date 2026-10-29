import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";

export const MONO_STYLE = {
  fontFamily:
    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
  letterSpacing: "0.08em",
} as const;

export const DISPLAY_STYLE = {
  fontFamily: "'TG Girthy', Impact, sans-serif",
} as const;

type Tone = "light" | "dark";

/** Full-width homepage section that follows the existing cream/black rhythm. */
export function Section({
  id,
  tone,
  label,
  title,
  intro,
  children,
}: {
  id?: string;
  tone: Tone;
  label: string;
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      className={`scroll-mt-14 border-b px-4 py-12 md:px-8 md:py-16 lg:px-12 ${
        dark
          ? "border-[#F4F4F0]/12 bg-[#161515] text-[#F4F4F0]"
          : "border-[#161515]/25 bg-[#F4F4F0] text-[#161515]"
      }`}
    >
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="border-t-4 border-[#D0320E] pt-5">
          <Reveal>
            <p
              className={`text-[11px] uppercase ${
                dark ? "text-[#F4F4F0]/75" : "text-[#161515]/75"
              }`}
              style={MONO_STYLE}
            >
              [ {label} ]
            </p>
          </Reveal>
          <RevealText
            text={title}
            as="h2"
            className="mt-2 max-w-5xl uppercase"
            style={{
              ...DISPLAY_STYLE,
              fontSize: "clamp(1.9rem, 4.6vw, 4.2rem)",
              lineHeight: 0.95,
            }}
          />
          {intro ? (
            <Reveal delay={0.1}>
              <div
                className={`mt-5 max-w-3xl space-y-3 text-lg leading-relaxed ${
                  dark ? "text-[#F4F4F0]/82" : "text-[#161515]/80"
                }`}
              >
                {intro}
              </div>
            </Reveal>
          ) : null}
        </div>
        {children ? <div className="mt-8 md:mt-10">{children}</div> : null}
      </div>
    </section>
  );
}

/** Visibly marked gap for proof the owner still has to supply. */
export function Placeholder({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block border border-dashed border-[#D0320E] px-2 py-1 text-[11px] uppercase text-[#D0320E] ${className}`}
      style={MONO_STYLE}
    >
      [PLACEHOLDER: {children}]
    </span>
  );
}

export const PRIMARY_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-[5px] border border-[#D0320E] bg-[#D0320E] px-5 py-2.5 text-[12px] uppercase text-[#F4F4F0] transition-colors hover:bg-[#161515] hover:border-[#161515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";
