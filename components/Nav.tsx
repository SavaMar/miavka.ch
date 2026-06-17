"use client";

import { useState } from "react";
import Link from "next/link";
import LiquidButton from "@/components/LiquidButton";

const NAV_LINKS = [
  { label: "How I Work", href: "/#how-i-work" },
  { label: "About Me", href: "/#about-me" },
  { label: "Prices", href: "/#offers" },
  { label: "Articles", href: "/articles" },
  {
    label: "Books",
    href: "https://links.miavka.ch/books.html",
    external: true,
  },
] as const satisfies ReadonlyArray<{
  label: string;
  href: string;
  external?: boolean;
}>;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const linkFontStyle = {
    fontFamily:
      "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
  } as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black pt-3">
      <div className="flex h-14 items-center justify-between px-6 lg:h-16 lg:px-8 xl:px-[135px]">
        {/* Wordmark */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span
            className="font-display relative bottom-[-1] text-3xl uppercase text-brand-red sm:text-3xl lg:text-[1.65rem] xl:text-3xl"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Miavka Studio
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-8">
          <div className="flex items-center justify-end gap-3 xl:gap-6">
            {NAV_LINKS.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-brand-cream/70 transition-colors hover:text-brand-cream xl:text-xs"
                  style={linkFontStyle}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wide text-brand-cream/70 transition-colors hover:text-brand-cream xl:text-xs"
                  style={linkFontStyle}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <LiquidButton
            href="/#contact"
            className="whitespace-nowrap rounded-[10px] border border-brand-red bg-brand-red px-4 py-2 text-[11px] font-bold uppercase text-white xl:px-5 xl:text-xs"
            labelHoverClassName="group-hover:text-white"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              Let&apos;s Talk
            </span>
          </LiquidButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="text-brand-cream p-1 lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-6 bg-brand-cream transition-all ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-brand-cream transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-brand-cream transition-all ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col gap-6 border-t border-white/10 bg-brand-black px-6 py-6 lg:hidden">
          {NAV_LINKS.map((item) =>
            "external" in item && item.external ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-bold uppercase text-brand-cream"
                style={linkFontStyle}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-bold uppercase text-brand-cream"
                style={linkFontStyle}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <LiquidButton
            href="/#contact"
            className="w-full rounded-[10px] border border-brand-red bg-brand-red px-5 py-3 text-center text-xs font-bold uppercase text-white"
            labelHoverClassName="group-hover:text-white"
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 700,
            }}
          >
            <span
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              Let&apos;s Talk
            </span>
          </LiquidButton>
        </div>
      )}
    </nav>
  );
}
