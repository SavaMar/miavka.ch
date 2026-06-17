"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/marimiavka",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M21 8.6a3 3 0 0 0-2.1-2.1C17.2 6 12 6 12 6s-5.2 0-6.9.5A3 3 0 0 0 3 8.6 31 31 0 0 0 3 12a31 31 0 0 0 .1 3.4 3 3 0 0 0 2.1 2.1C6.8 18 12 18 12 18s5.2 0 6.9-.5a3 3 0 0 0 2.1-2.1c.1-1.1.1-2.3.1-3.4s0-2.3-.1-3.4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="m10 9.2 5 2.8-5 2.8V9.2Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <rect x="7" y="10" width="2.4" height="7" fill="currentColor" />
        <circle cx="8.2" cy="7.5" r="1.4" fill="currentColor" />
        <path d="M12 10h2.3v1.1h.1c.4-.8 1.4-1.4 2.8-1.4 2.5 0 3.1 1.6 3.1 3.9V17h-2.4v-3c0-1.4 0-2.5-1.5-2.5-1.5 0-1.7 1.1-1.7 2.4V17H12v-7Z" fill="currentColor" />
      </svg>
    ),
  },
];

const MOBILE_LINK_COLUMNS = [
  {
    title: "More",
    links: [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" },
      { label: "Prices", href: "/#offers" },
    ],
  },
  {
    title: "Free Content",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Book Notes", href: "https://links.miavka.ch/books.html" },
      { label: "Newsletter", href: "/newsletter" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "Brand Audit", href: "/discovery-call" },
    ],
  },
];

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

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
      className="overflow-hidden bg-brand-cream pt-12 md:bg-brand-black md:pt-20"
    >
      <div className="md:hidden">
        <div className="border-t border-brand-black/12 px-5 pb-10 pt-8">
          <div className="mx-auto max-w-sm text-center">
            <p
              className="text-brand-black uppercase text-[2.2rem] leading-[0.95]"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              Miavka Studio
            </p>
            <p className="mt-2 text-sm text-ui-gray-700">
              © 2026 Miavka Studio. All rights reserved.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-black/8 text-brand-black transition-colors hover:bg-brand-black hover:text-brand-cream"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="mt-8 space-y-7">
              {MOBILE_LINK_COLUMNS.map((column) => (
                <div key={column.title}>
                  <p className="text-xl text-brand-black" style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}>
                    {column.title}
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {column.links.map((link) => (
                      isExternalHref(link.href) ? (
                        <a
                          key={link.label}
                          href={link.href}
                          className="block text-[1rem] text-ui-gray-700 underline underline-offset-2 hover:text-brand-red"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="block text-[1rem] text-ui-gray-700 underline underline-offset-2 hover:text-brand-red"
                        >
                          {link.label}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-brand-black/12 pt-5 text-sm text-ui-gray-700">
              <a href="#" className="underline underline-offset-2 hover:text-brand-red">
                Privacy Policy
              </a>
              <span className="mx-2">/</span>
              <a href="#" className="underline underline-offset-2 hover:text-brand-red">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="px-6 pb-12 md:px-10 lg:px-16">
          <div className="mx-auto max-w-[1200px] border-b border-brand-cream/12 pb-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(180px,220px)_1fr] lg:items-start lg:gap-16">
              <div>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-cream/8 text-brand-cream transition-colors hover:bg-brand-red hover:text-brand-black"
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {MOBILE_LINK_COLUMNS.map((column) => (
                  <div key={column.title}>
                    <p
                      className="text-brand-cream text-[1.7rem] leading-[0.95]"
                      style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                    >
                      {column.title}
                    </p>
                    <div className="mt-4 space-y-2.5">
                      {column.links.map((link) => (
                        isExternalHref(link.href) ? (
                          <a
                            key={link.label}
                            href={link.href}
                            className="block text-[0.98rem] text-brand-cream/75 underline underline-offset-2 transition-colors hover:text-brand-red"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            key={link.label}
                            href={link.href}
                            className="block text-[0.98rem] text-brand-cream/75 underline underline-offset-2 transition-colors hover:text-brand-red"
                          >
                            {link.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hidden items-start justify-between gap-8 px-6 pb-10 md:flex md:flex-row md:items-end md:px-10 md:pb-14 lg:px-16">
        {/* Logo mark */}
        <div className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="Miavka Studio"
            width={48}
            height={48}
            className="object-contain opacity-80"
            style={{ width: "auto", height: "auto" }}
          />
        </div>

        {/* Wordmark — full bleed display */}
        <div className="flex flex-1 justify-center">
          <p
            className="whitespace-nowrap text-brand-red text-[clamp(2.1rem,7vw,6.2rem)] uppercase leading-none"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Miavka Studio
          </p>
        </div>
      </div>

      {/* Copyright strip */}
      <div className="hidden items-center justify-between border-t border-white/10 px-6 py-4 md:flex md:px-10 lg:px-16">
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
