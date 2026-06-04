"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarDays } from "lucide-react";

/** Section anchor — use `/#contact` from subpages so the fixed Nav offset still works. */
const FALLBACK_CAL_URL =
  process.env.NEXT_PUBLIC_CAL_BOOK_FALLBACK_URL ||
  "https://cal.com/mari-miavka/business-call";

function DiscoveryOutlineButton({
  href = "/discovery-call",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-[10px] border-2 border-brand-red bg-transparent px-8 py-3 text-sm font-bold uppercase text-brand-cream transition-colors hover:bg-brand-red hover:text-brand-cream"
      style={{
        fontFamily:
          "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
        fontWeight: 700,
      }}
    >
      {children}
    </Link>
  );
}

export default function BookCall() {
  const namespace = process.env.NEXT_PUBLIC_CAL_NAMESPACE || "business-call";
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK || "mari-miavka/business-call";

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-brand-black px-6 py-20 md:scroll-mt-28 md:px-10 md:py-28 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-brand-red/15 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <CalendarDays className="size-7 shrink-0 text-brand-red" />
            <span className="font-body text-sm font-black uppercase tracking-[0.3em] text-brand-red">
              Free Consultation
            </span>
          </div>
          <h2 className="mb-4 font-display text-3xl font-bold uppercase text-brand-cream md:text-5xl">
            Book a Free 30 Min Call
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-brand-cream/65">
            Let&apos;s talk about your goals, your brand, and how I can help you
            grow. Pick a date and time that works for you.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-950 p-8 shadow-2xl md:p-10">
          {calLink ? (
            <BookCalEmbed namespace={namespace} calLink={calLink} />
          ) : (
            <div className="space-y-4 py-10 text-center">
              <p className="font-body text-sm font-black uppercase tracking-[0.2em] text-brand-red">
                Calendar Setup Needed
              </p>
              <p className="mx-auto max-w-xl font-body text-ui-gray-300">
                Add `NEXT_PUBLIC_CAL_LINK` to your env file and restart the dev
                server.
              </p>
              <p className="font-body text-xs text-brand-cream/45">
                Example: `NEXT_PUBLIC_CAL_LINK=mari-miavka/business-call`
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <DiscoveryOutlineButton href="/discovery-call">
            Not sure yet? Watch this first
          </DiscoveryOutlineButton>
        </div>
      </div>
    </section>
  );
}

function BookCalEmbed({
  namespace,
  calLink,
}: {
  namespace: string;
  calLink: string;
}) {
  const [embedBroken, setEmbedBroken] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedBroken) return;

    let cancelled = false;

    getCalApi({ namespace })
      .then((cal) => {
        if (cancelled) return;
        cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      })
      .catch(() => {
        if (!cancelled) setEmbedBroken(true);
      });

    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      const root = containerRef.current;
      if (!root) return;
      const iframe = root.querySelector("iframe");
      if (!iframe || iframe.offsetHeight < 120) setEmbedBroken(true);
    }, 22000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [namespace, embedBroken]);

  if (embedBroken) {
    return (
      <div className="flex flex-col items-center gap-8 py-16 text-center md:py-24">
        <p className="max-w-md font-body text-brand-cream/70">
          The calendar preview couldn&apos;t load here — you can still book the
          same slot on Cal.com.
        </p>
        <a
          href={FALLBACK_CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex border-2 border-brand-red bg-transparent px-10 py-4 font-display text-base font-bold uppercase tracking-wide text-brand-cream transition-colors hover:bg-brand-red/10"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          Book a call
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[760px] overflow-hidden rounded-xl border border-white/10"
    >
      <Cal
        namespace={namespace}
        calLink={calLink}
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{
          layout: "month_view",
          useSlotsViewOnSmallScreen: "true",
          theme: "dark",
        }}
      />
    </div>
  );
}
