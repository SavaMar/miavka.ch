"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/now", label: "[ NOW ]" },
  { href: "/articles", label: "[ ARTICLES ]" },
  { href: "/about", label: "[ ABOUT ]" },
  { href: "/contact", label: "[ CONTACT ]" },
  { href: "/newsletter", label: "[ NOTES ]" },
] as const;

type NavProps = {
  theme?: "light" | "dark";
};

export default function Nav({ theme = "dark" }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === "dark";
  const monoStyle = {
    fontFamily:
      "var(--font-jetbrains-mono), 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
    letterSpacing: "0.08em",
  } as const;

  return (
    <nav
      className={`sticky top-0 z-50 ${
        isDark
          ? "bg-[#0A0A0A] shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          : "bg-[#F4F4F0] shadow-[0_2px_10px_rgba(22,21,21,0.08)]"
      }`}
    >
      <div className="mx-auto w-full max-w-[1680px] px-4 py-3 md:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
            <span
              className={`text-[13px] uppercase ${
                isDark ? "text-[#F4F4F0]" : "text-[#161515]"
              }`}
              style={monoStyle}
            >
              Mari Miavka
            </span>
          </Link>

          <div
            className="hidden flex-wrap items-center justify-end gap-x-4 gap-y-1 md:flex md:gap-x-6"
            style={monoStyle}
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] uppercase transition-colors hover:text-[#D0320E] ${
                  isDark ? "text-[#F4F4F0]" : "text-[#161515]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center border md:hidden ${
              isDark ? "border-[#F4F4F0]/35" : "border-[#161515]/35"
            }`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="flex flex-col gap-1">
              <span
                className={`h-px w-4 transition-transform ${
                  isDark ? "bg-[#F4F4F0]" : "bg-[#161515]"
                } ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`h-px w-4 transition-opacity ${
                  isDark ? "bg-[#F4F4F0]" : "bg-[#161515]"
                } ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-4 transition-transform ${
                  isDark ? "bg-[#F4F4F0]" : "bg-[#161515]"
                } ${menuOpen ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div
            className={`mt-3 grid gap-2 border-t pt-3 md:hidden ${
              isDark ? "border-[#F4F4F0]/20" : "border-[#161515]/20"
            }`}
            style={monoStyle}
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] uppercase transition-colors hover:text-[#D0320E] ${
                  isDark ? "text-[#F4F4F0]" : "text-[#161515]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </nav>
  );
}
