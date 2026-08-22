"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ArticleSection } from "@/lib/articles";
import { NAV_HEIGHT_MD_PX, READING_PROGRESS_BAR_HEIGHT_PX } from "@/lib/article-chrome";
import ArticleTableOfContents from "@/components/articles/ArticleTableOfContents";

type Props = {
  sections: ArticleSection[];
  articleRootId: string;
};

export default function ArticleTocPinned({ sections, articleRootId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [pinMode, setPinMode] = useState<"normal" | "fixed" | "bottom">(
    "normal"
  );
  const [cardHeight, setCardHeight] = useState(0);
  const [bottomTop, setBottomTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [width, setWidth] = useState(0);

  const topOffset = NAV_HEIGHT_MD_PX + READING_PROGRESS_BAR_HEIGHT_PX + 20;

  const update = useCallback(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;
    const articleRoot = document.getElementById(articleRootId);
    if (!articleRoot) return;

    const isDesktopOrTablet =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;

    if (!isDesktopOrTablet) {
      setPinMode("normal");
      setCardHeight(0);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top + window.scrollY;
    const articleRect = articleRoot.getBoundingClientRect();
    const articleBottom = articleRect.top + window.scrollY + articleRoot.offsetHeight;
    const nextCardHeight = card.offsetHeight;
    const maxTopInsideContainer = articleBottom - containerTop - nextCardHeight;
    const fixedTopInsideContainer = window.scrollY + topOffset - containerTop;
    const shouldPin = window.scrollY + topOffset >= containerTop;

    if (!shouldPin) {
      setPinMode("normal");
    } else if (fixedTopInsideContainer >= maxTopInsideContainer) {
      setPinMode("bottom");
      setBottomTop(Math.max(0, maxTopInsideContainer));
    } else {
      setPinMode("fixed");
    }

    setCardHeight(nextCardHeight);
    setLeft(containerRect.left);
    setWidth(containerRect.width);
  }, [articleRootId, topOffset]);

  useEffect(() => {
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div ref={containerRef} className="relative mt-5">
      <div style={pinMode !== "normal" ? { height: `${cardHeight}px` } : undefined}>
        <div
          ref={cardRef}
          className="rounded-[10px] bg-white p-6 shadow-[0_8px_22px_rgba(17,17,17,0.06)]"
          style={
            pinMode === "fixed"
              ? {
                  position: "fixed",
                  top: `${topOffset}px`,
                  left: `${left}px`,
                  width: `${width}px`,
                  zIndex: 40,
                }
              : pinMode === "bottom"
                ? {
                    position: "absolute",
                    top: `${bottomTop}px`,
                    left: 0,
                    width: "100%",
                    zIndex: 30,
                  }
              : undefined
          }
        >
          <ArticleTableOfContents
            sections={sections}
            showDesktop
            showMobileInline
            showMobileFab={false}
          />
        </div>
      </div>
    </div>
  );
}
