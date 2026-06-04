"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

const PHOTOS = [
  "/images/me/1.jpg?v=2",
  "/images/me/2.jpg",
  "/images/me/3.jpg",
  "/images/me/4.jpg",
] as const;

export default function AboutMeCarousel() {
  const [index, setIndex] = useState(0);
  const count = PHOTOS.length;

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i === count - 1 ? 0 : i + 1));
  }, [count]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden bg-neutral-200 lg:mx-0 lg:max-w-none">
      <Image
        key={PHOTOS[index]}
        src={PHOTOS[index]}
        alt={`Mari Miavka — photo ${index + 1} of ${count}`}
        fill
        className="object-cover object-center"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={index === 0}
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-[22%] max-w-15 items-center justify-start pl-1 md:pl-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red md:size-11"
          aria-label="Previous photo"
        >
          <ChevronLeft className="size-5 shrink-0" />
        </button>
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[22%] max-w-15 items-center justify-end pr-1 md:pr-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-black/45 text-white shadow-sm backdrop-blur-[2px] transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red md:size-11"
          aria-label="Next photo"
        >
          <ChevronRight className="size-5 shrink-0" />
        </button>
      </div>
    </div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M14 18 8 12l6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="m10 18 6-6-6-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
