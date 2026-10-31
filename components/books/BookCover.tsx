"use client";

import { useState } from "react";

function coverProxyUrl(url: string): string {
  if (!url) return "";
  return `https://images.weserv.nl/?url=${encodeURIComponent(
    url.replace(/^https?:\/\//, "")
  )}`;
}

/** Book cover from an external host. Retries once through an image proxy, then shows the title. */
export default function BookCover({ title, cover }: { title: string; cover: string }) {
  const [src, setSrc] = useState(cover);
  const [didRetryViaProxy, setDidRetryViaProxy] = useState(false);
  const [showFallback, setShowFallback] = useState(!cover);

  if (showFallback) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#201f1c] p-3 text-center text-sm font-semibold leading-tight text-[#F4F4F0]/75">
        {title}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${title} cover`}
      loading="lazy"
      referrerPolicy="no-referrer"
      className="h-full w-full object-contain"
      onError={() => {
        if (!didRetryViaProxy && cover) {
          setDidRetryViaProxy(true);
          setSrc(coverProxyUrl(cover));
          return;
        }
        setShowFallback(true);
      }}
    />
  );
}
