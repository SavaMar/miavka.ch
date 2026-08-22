"use client";

import Image from "next/image";
import { useState } from "react";

const PHOTOS = [
  "/images/me/1.jpg",
  "/images/me/2.jpg",
  "/images/me/3.jpg",
  "/images/me/4.jpg",
] as const;

export default function AboutHeroStyleCarousel() {
  const [index, setIndex] = useState(0);
  const total = PHOTOS.length;

  function prev() {
    setIndex((value) => (value === 0 ? total - 1 : value - 1));
  }

  function next() {
    setIndex((value) => (value === total - 1 ? 0 : value + 1));
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[#161515]/8">
      <Image
        key={PHOTOS[index]}
        src={PHOTOS[index]}
        alt={`Mari Miavka portrait ${index + 1}`}
        fill
        sizes="(max-width: 1024px) 100vw, 45vw"
        className="object-cover object-left contrast-110 saturate-105"
        style={{ filter: "contrast(1.08) saturate(1.06) brightness(0.98)" }}
        priority={index === 0}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #161515 0.9px, transparent 0.9px)",
          backgroundSize: "4px 4px",
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-3">
        <button
          type="button"
          onClick={prev}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#161515]/52 text-[26px] text-[#F4F4F0] backdrop-blur-[1px] transition-colors hover:bg-[#161515]/70"
          aria-label="Previous photo"
        >
          ←
        </button>

        <button
          type="button"
          onClick={next}
          className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#161515]/52 text-[26px] text-[#F4F4F0] backdrop-blur-[1px] transition-colors hover:bg-[#161515]/70"
          aria-label="Next photo"
        >
          →
        </button>
      </div>
    </div>
  );
}
