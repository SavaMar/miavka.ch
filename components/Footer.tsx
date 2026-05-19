"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const target = footerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBackToTop(entry.isIntersecting);
      },
      { threshold: 0.08 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer
      ref={footerRef}
      className="overflow-hidden bg-brand-black pt-16 md:pt-20"
    >
      {/* Tile grid */}
      <div
        className="mb-10 grid gap-[25px] bg-brand-black px-6 md:mb-14 md:px-10 lg:p-46"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-brand-cream" />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-start justify-between gap-8 px-6 pb-10 md:flex-row md:items-end md:px-10 md:pb-14 lg:px-16">
        {/* Logo mark */}
        <div className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Miavka Studio"
            width={48}
            height={48}
            className="object-contain opacity-80"
          />
        </div>

        {/* Wordmark — full bleed display */}
        <div className="flex flex-1 justify-center">
          <p
            className="text-brand-red text-[clamp(3rem,10vw,8rem)] uppercase leading-none"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Miavka Studio
          </p>
        </div>
      </div>

      {/* Copyright strip */}
      <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 md:px-10 lg:px-16">
        <p className="font-body text-[10px] uppercase text-brand-cream/30">
          © 2026 Mari Yemko Miavka · Miavka Studio · All rights reserved.
        </p>
        <p className="font-body text-[10px] uppercase text-brand-cream/30">
          Vol. 01 · 2026
        </p>
      </div>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-brand-red bg-brand-black/95 px-4 font-body text-xs font-bold uppercase tracking-wide text-brand-cream shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:bg-brand-red hover:text-brand-black hover:shadow-[0_10px_28px_rgba(232,50,10,0.35)] cursor-pointer md:bottom-10 md:left-12 md:right-auto md:h-13 md:px-5 md:text-sm ${
          showBackToTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <span aria-hidden>↑</span>
        <span>Go Up</span>
      </button>
    </footer>
  );
}
