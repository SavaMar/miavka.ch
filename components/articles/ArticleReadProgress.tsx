"use client";

import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
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
}: {
  articleRootId: string;
}) {
  const [pct, setPct] = useState(0);

  const update = useCallback(() => {
    const el = document.getElementById(articleRootId);
    if (!el) return;

    const isMd =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    const chromeBottom =
      (isMd ? NAV_HEIGHT_MD_PX : NAV_HEIGHT_SM_PX) +
      READING_PROGRESS_BAR_HEIGHT_PX;

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
  }, [articleRootId]);

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

  return (
    <div
      className={`fixed left-0 right-0 top-[72px] z-[45] flex h-9 items-center bg-[#111111] md:top-[76px] md:px-30 ${inter.className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <span
        className="shrink-0 pl-4 text-[10px] font-normal uppercase tracking-wide text-[#EFE7D8]/80"
        style={{ letterSpacing: "0.08em" }}
      >
        READING PROGRESS
      </span>

      <div className="mx-3 min-w-0 flex-1">
        <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-[#EFE7D8]/20">
          <div
            className="absolute inset-y-0 left-0 bg-[#E8320A] transition-[width] duration-100 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <span className="shrink-0 pr-4 text-[11px] font-bold tabular-nums text-[#EFE7D8]">
        {Math.round(pct)}%
      </span>
    </div>
  );
}
