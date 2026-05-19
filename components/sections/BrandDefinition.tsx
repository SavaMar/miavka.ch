export default function BrandDefinition() {
  return (
    <section className="bg-brand-cream px-6 py-16 md:px-10 md:py-24 lg:px-[155px] lg:py-[95px]">
      {/* ── MOBILE: 3×4 mosaic ───────────────────────────────── */}
      <div className="mb-10 grid grid-cols-3 gap-3 md:hidden">
        {/* Row 1: col 1-2 text, col 3 black */}
        <div className="col-span-2 flex aspect-2/1 flex-col justify-between bg-brand-cream pr-1">
          <p
            className="text-brand-black text-[clamp(0.95rem,5.5vw,1.2rem)] leading-none"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            &ldquo;BRAND&rdquo;
          </p>
          <p
            className="text-brand-black text-[clamp(0.72rem,3.4vw,0.9rem)] italic leading-snug"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            isn&apos;t a logo. It isn&apos;t a colour palette. It isn&apos;t an
            Instagram aesthetic.
          </p>
        </div>
        <div className="aspect-square bg-brand-black" />

        {/* Row 2: all black */}
        <div className="aspect-square bg-brand-black" />
        <div className="aspect-square bg-brand-black" />
        <div className="aspect-square bg-brand-black" />

        {/* Row 3: col 1 black, col 2-3 text */}
        <div className="aspect-square bg-brand-black" />
        <div className="col-span-2 flex aspect-2/1 flex-col justify-between bg-brand-cream pl-1">
          <p
            className="text-brand-red text-[clamp(0.9rem,5.2vw,1.15rem)] leading-none"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            &ldquo;BRAND&rdquo;
          </p>
          <p
            className="text-brand-black text-[clamp(0.64rem,3.1vw,0.82rem)] italic leading-snug"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            is a system that makes people choose you, return to you, and tell
            others about you. It&apos;s the voice, the vision, the customer
            journey, and the cultural gravity that turns a business into
            something people belong to.
          </p>
        </div>

        {/* Row 4: all black */}
        <div className="aspect-square bg-brand-black" />
        <div className="aspect-square bg-brand-black" />
        <div className="aspect-square bg-brand-black" />
      </div>

      {/* ── DESKTOP: 6×3 mosaic ─────────────────────────────── */}
      <div
        className="mb-12 hidden gap-[20px] md:grid"
        style={{
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(3, calc((100vw - 210px) / 5 * 0.75))",
        }}
      >
        {/* Row 1 — cols 1–2: “isn’t a logo…” */}
        <div
          className="bg-brand-cream flex flex-col justify-between p-5"
          style={{ gridColumn: "1 / 3", gridRow: "1 / 2" }}
        >
          <p
            className="text-brand-black  leading-none text-[clamp(1.8rem,4.8vw,6rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            &ldquo;BRAND&rdquo;
          </p>
          <p
            className="text-brand-black text-md italic leading-snug"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            isn&apos;t a logo. It isn&apos;t a colour palette. It isn&apos;t an
            Instagram aesthetic.
          </p>
        </div>

        {/* Row 1 — cols 3–6: black squares */}
        <div
          className="bg-brand-black"
          style={{ gridColumn: "3 / 4", gridRow: "1 / 2" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "4 / 5", gridRow: "1 / 2" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "5 / 6", gridRow: "1 / 2" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "6 / 7", gridRow: "1 / 2" }}
        />

        {/* Row 2 — cols 1–4: black squares */}
        <div
          className="bg-brand-black"
          style={{ gridColumn: "1 / 2", gridRow: "2 / 3" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "2 / 3", gridRow: "2 / 3" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "4 / 5", gridRow: "2 / 3" }}
        />

        {/* Row 2 — cols 5–6: “is a system…” */}
        <div
          className="bg-brand-cream flex flex-col justify-between p-5"
          style={{ gridColumn: "5 / 7", gridRow: "2 / 3" }}
        >
          <p
            className="text-brand-red leading-none text-[clamp(1.5rem,4vw,5rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            &ldquo;BRAND&rdquo;
          </p>
          <p
            className="text-brand-black text-md italic leading-relaxed text-right"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            is a system that makes people choose you, return to you, and tell
            others about you. It&apos;s the voice, the vision, the customer
            journey, and the cultural gravity that turns a business into
            something people belong to.
          </p>
        </div>

        {/* Row 3 — cols 1–5: black squares, col 6: empty */}
        <div
          className="bg-brand-black"
          style={{ gridColumn: "1 / 2", gridRow: "3 / 4" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "2 / 3", gridRow: "3 / 4" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "3 / 4", gridRow: "3 / 4" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "4 / 5", gridRow: "3 / 4" }}
        />
        <div
          className="bg-brand-black"
          style={{ gridColumn: "5 / 6", gridRow: "3 / 4" }}
        />
        <div aria-hidden style={{ gridColumn: "6 / 7", gridRow: "3 / 4" }} />
      </div>

      {/* ── Cult brands tagline ──────────────────────────────── */}
      <p
        className="mb-4 mt-10 text-center text-brand-black text-[clamp(0.95rem,4.7vw,2.4rem)] md:mb-5 md:mt-20"
        style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
      >
        Cult brands aren&apos;t built on luck. They&apos;re built on systems.
      </p>

      {/* ── Body paragraph ──────────────────────────────────── */}
      <p
        className="px-0 text-center text-sm italic text-brand-black md:px-10 md:text-base lg:px-20 lg:text-xl"
        style={{
          fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 300,
        }}
      >
        I study the brands that turned local businesses into cultural magnets —
        and write the kind of breakdown I wish someone had given me when I
        started. Philosophy, sales mechanics, lifecycle architecture, content
        rhythm. Everything that makes them impossible to copy at the surface —
        and possible to learn from underneath.
      </p>
    </section>
  );
}
