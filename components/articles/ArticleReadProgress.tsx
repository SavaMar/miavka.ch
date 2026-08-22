"use client";

import { Inter } from "next/font/google";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NAV_HEIGHT_MD_PX,
  NAV_HEIGHT_SM_PX,
  READING_PROGRESS_BAR_HEIGHT_PX,
} from "@/lib/article-chrome";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function ArticleReadProgress({
  articleRootId,
  mode = "fixed",
}: {
  articleRootId: string;
  mode?: "fixed" | "sticky" | "inline";
}) {
  const [pct, setPct] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [navOffset, setNavOffset] = useState(NAV_HEIGHT_SM_PX);
  const anchorRef = useRef<HTMLDivElement | null>(null);

  const update = useCallback(() => {
    const el = document.getElementById(articleRootId);
    if (!el) return;

    const isMd =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    const navHeight = isMd ? NAV_HEIGHT_MD_PX : NAV_HEIGHT_SM_PX;
    setNavOffset((prev) => (prev === navHeight ? prev : navHeight));
    const chromeBottom =
      mode === "fixed" || mode === "sticky"
        ? navHeight + READING_PROGRESS_BAR_HEIGHT_PX
        : 0;

    const rect = el.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = el.offsetHeight;

    const viewportRemainder = window.innerHeight - chromeBottom;
    const scrollRange = articleHeight - viewportRemainder;
    const scrolledPastTop = window.scrollY - articleTop + chromeBottom;

    if (scrollRange <= 0) {
      setPct(window.scrollY >= articleTop - chromeBottom ? 100 : 0);
      return;
    }
    const p = (scrolledPastTop / scrollRange) * 100;
    setPct(Math.min(100, Math.max(0, p)));

    if (mode === "sticky") {
      const anchorTop =
        (anchorRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
      const articleBottom = articleTop + articleHeight;
      const shouldPin =
        window.scrollY + navHeight >= anchorTop &&
        window.scrollY + navHeight < articleBottom;
      setIsPinned((prev) => (prev === shouldPin ? prev : shouldPin));
    } else {
      setIsPinned(false);
    }
  }, [articleRootId, mode]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      update();
    });
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const barClass = `flex h-9 items-center border-b border-[#0A0A0A]/10 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] ${inter.className}`;
  const inner = (
    <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6 md:px-10 lg:px-16">
      <span
        className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-[#111111]/88"
        style={{ letterSpacing: "0.08em" }}
      >
        READING PROGRESS
      </span>

      <div className="mx-3 min-w-0 flex-1">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#111111]/15">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-[#D0320E] to-[#E54A25] transition-[width] duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <span className="shrink-0 text-[11px] font-bold tabular-nums text-[#111111]">
        {Math.round(pct)}%
      </span>
    </div>
  );

  if (mode === "sticky") {
    return (
      <div ref={anchorRef} className="relative z-30 h-9 w-full">
        <div
          className={`${
            isPinned ? "fixed left-0 right-0 z-48" : "relative z-30 w-full"
          } ${barClass}`}
          style={isPinned ? { top: `${navOffset}px` } : undefined}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reading progress"
        >
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        mode === "fixed"
          ? "fixed left-0 right-0 z-45"
          : "relative z-10 w-full"
      } ${barClass}`}
      style={mode === "fixed" ? { top: `${navOffset}px` } : undefined}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      {inner}
    </div>
  );
}
