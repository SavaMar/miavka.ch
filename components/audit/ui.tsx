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

const SECTION_TITLE_STYLE = {
  ...DISPLAY_STYLE,
  fontSize: "clamp(1.9rem, 4.6vw, 4.2rem)",
  lineHeight: 0.95,
} as const;

/** Full-width homepage section that follows the existing cream/black rhythm. */
export function Section({
  id,
  tone,
  label,
  title,
  intro,
  lead,
  aside,
  animateTitle = true,
  children,
}: {
  id?: string;
  tone: Tone;
  label: string;
  title: string;
  intro?: ReactNode;
  /** Rendered above the section heading, without animation. */
  lead?: ReactNode;
  /** Right of the heading from md up; between the title and the intro on phones. */
  aside?: ReactNode;
  /** Anchor targets should stay static so the heading is never mid-reveal on arrival. */
  animateTitle?: boolean;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-b px-4 py-12 md:px-8 md:py-16 lg:px-12 ${
        dark
          ? "border-[#F4F4F0]/12 bg-[#161515] text-[#F4F4F0]"
          : "border-[#161515]/25 bg-[#F4F4F0] text-[#161515]"
      }`}
    >
      <div className="mx-auto w-full max-w-[1680px]">
        {lead ? <div className="mb-10 md:mb-12">{lead}</div> : null}
        <div
          className={`border-t-4 border-[#D0320E] pt-5 ${
            aside
              ? "grid md:grid-cols-[minmax(0,1fr)_minmax(260px,38%)] md:grid-rows-[auto_auto_1fr] md:gap-x-10 lg:gap-x-14"
              : ""
          }`}
        >
          {animateTitle ? (
            <Reveal className="md:col-start-1">
              <p
                className={`text-[11px] uppercase ${
                  dark ? "text-[#F4F4F0]/75" : "text-[#161515]/75"
                }`}
                style={MONO_STYLE}
              >
                [ {label} ]
              </p>
            </Reveal>
          ) : (
            <p
              className={`text-[11px] uppercase md:col-start-1 ${
                dark ? "text-[#F4F4F0]/75" : "text-[#161515]/75"
              }`}
              style={MONO_STYLE}
            >
              [ {label} ]
            </p>
          )}
          {animateTitle ? (
            <RevealText
              text={title}
              as="h2"
              className="mt-2 max-w-5xl uppercase md:col-start-1"
              style={SECTION_TITLE_STYLE}
            />
          ) : (
            <h2 className="mt-2 max-w-5xl uppercase md:col-start-1" style={SECTION_TITLE_STYLE}>
              {title}
            </h2>
          )}
          {aside ? (
            <Reveal
              delay={0.1}
              className="mt-6 md:col-start-2 md:row-span-3 md:row-start-1 md:mt-0"
            >
              {aside}
            </Reveal>
          ) : null}
          {intro ? (
            <Reveal delay={0.1} className="md:col-start-1">
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

/** Text that is safe to show publicly: empty and placeholder values become "". */
export function visibleText(value: string | null | undefined): string {
  const text = (value ?? "").trim();
  return /placeholder/i.test(text) ? "" : text;
}

export const PRIMARY_BUTTON_CLASS =
  "inline-flex min-h-11 items-center justify-center rounded-[5px] border border-[#D0320E] bg-[#D0320E] px-5 py-2.5 text-[12px] uppercase text-[#F4F4F0] transition-colors hover:bg-[#161515] hover:border-[#161515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";
