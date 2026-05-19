"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArticleSection } from "@/lib/articles";
import { stickyChromeBottomPx } from "@/lib/article-chrome";

type Props = {
  sections: ArticleSection[];
};

export default function ArticleTableOfContents({ sections }: Props) {
  const ids = useMemo(
    () => sections.map((s) => s.id).filter(Boolean),
    [sections]
  );

  const [linePx, setLinePx] = useState(108);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setLinePx(stickyChromeBottomPx(mq.matches));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");
  const [sheetOpen, setSheetOpen] = useState(false);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setSheetOpen(false);
  }, []);

  const computeActive = useCallback(() => {
    if (ids.length === 0) return;
    const offset = linePx;
    let current = ids[0];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= offset) current = id;
      else break;
    }
    setActiveId(current);
  }, [ids, linePx]);

  useEffect(() => {
    if (ids.length === 0) return;

    const raf = requestAnimationFrame(() => {
      computeActive();
    });

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null);

    const observer = new IntersectionObserver(
      () => {
        computeActive();
      },
      {
        root: null,
        rootMargin: `-${linePx}px 0px -45% 0px`,
        threshold: [0, 0.05, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids, computeActive, linePx]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  if (sections.length === 0) return null;

  const linkClass = (id: string) =>
    `block w-full text-left text-xs font-medium leading-snug transition-colors ${
      activeId === id
        ? "text-brand-red"
        : "text-brand-black hover:text-brand-red"
    }`;

  return (
    <>
      {/* Desktop: sticky below nav + reading progress (lg+ only shows sidebar) */}
      <nav
        aria-label="On this page"
        className="hidden h-full min-h-0 w-[220px] shrink-0 lg:block"
      >
        <div className="sticky top-[106px] max-h-[calc(100svh-116px-1.5rem)] overflow-y-auto overscroll-contain pb-8">
          <p className="mb-4 mt-10 text-[10px] font-bold uppercase tracking-widest text-ui-gray-700">
            On this page
          </p>
          <ol className="flex flex-col gap-3 border-l-2 border-ui-gray-300 pl-4">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className={`${linkClass(section.id)} text-left`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Mobile FAB + sheet */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="fixed bottom-6 right-5 z-40 rounded-full border-2 border-brand-red bg-brand-black px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-cream shadow-lg"
        >
          Contents
        </button>

        {sheetOpen ? (
          <>
            <button
              type="button"
              aria-label="Close table of contents"
              className="fixed inset-0 z-40 bg-brand-black/50"
              onClick={() => setSheetOpen(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[min(70vh,480px)] overflow-y-auto rounded-t-2xl border-t border-ui-gray-300 bg-brand-cream px-6 pb-10 pt-4 shadow-2xl">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ui-gray-300" />
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-ui-gray-700">
                Contents
              </p>
              <ol className="flex flex-col gap-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(section.id)}
                      className={`${linkClass(section.id)} py-1`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
