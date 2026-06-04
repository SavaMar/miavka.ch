import Image from "next/image";

const HERO = "/images/hero-photo.jpg";

/* ── Photo cell ─────────────────────────────────────────── */
function PhotoCell({
  position = "center",
  className = "",
  style,
}: {
  position?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-brand-black ${className}`}
      style={style}
    >
      <Image
        src={HERO}
        alt="Miavka Studio editorial"
        fill
        className="object-cover"
        style={{ objectPosition: position }}
        sizes="(max-width: 768px) 50vw, 20vw"
        priority
      />
      <div className="absolute inset-0 bg-brand-black/1" />
    </div>
  );
}

/* ── Logo cell ──────────────────────────────────────────── */
function LogoCell({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center bg-brand-black ${className}`}
    >
      <div className="relative w-full h-full aspect-square">
        <Image
          src="/images/logo.png"
          alt="Miavka Studio"
          fill
          sizes="20vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="bg-brand-black px-6 pb-[95px] pt-[72px] md:px-[135px] md:pt-[80px]">
      {/* ══════════════════════════════════════════════════
          DESKTOP — 5-col × 3-row full-width mosaic grid
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden md:grid gap-[20px] bg-brand-black"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(3, calc((100vw - 290px) / 5 * 0.62))",
        }}
      >
        {/* ── Row 1 — 5 photos ── */}
        <PhotoCell position="20% 10%" />
        <PhotoCell position="40% 25%" />
        <PhotoCell position="60% 15%" />
        <PhotoCell position="80% 35%" />
        <PhotoCell position="50% 5%" />

        {/* ── Row 2, cols 1–2 — Tagline cell ── */}
        <div
          className="bg-brand-black flex flex-col justify-center"
          style={{ gridColumn: "1 / 3", gridRow: "2 / 3" }}
        >
          <h1
            className="leading-[0.9] text-[clamp(0.85rem,2.1vw,3rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            <span>
              <span className="text-brand-cream">From good to </span>
              <span className="text-brand-red">great.</span>
            </span>

            <br />
            <span>
              <span className="text-brand-cream">From business to </span>
              <span className="text-brand-red">brand.</span>
            </span>

            <br />
            <span>
              <span className="text-brand-cream">From client to </span>
              <span className="text-brand-red">community.</span>
            </span>
          </h1>
        </div>

        {/* ── Row 2, col 3 ── */}
        <PhotoCell position="30% 60%" />

        {/* ── Row 2, col 4 ── */}
        <PhotoCell position="70% 55%" />

        {/* ── Row 2, col 5 — Logo ── */}
        <LogoCell />

        {/* ── Row 3, cols 1–2 — Photos ── */}
        <PhotoCell position="15% 90%" />
        <PhotoCell position="45% 85%" />

        {/* ── Row 3, col 3 ── */}
        <PhotoCell position="50% 80%" />

        {/* ── Row 3, cols 4–5 — Description ── */}
        <div
          className="bg-brand-black flex items-center"
          style={{ gridColumn: "4 / 6", gridRow: "3 / 4" }}
        >
          <p
            className="text-white text-[clamp(0.85rem,1.95vw,1.3rem)] leading-relaxed text-left"
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 500,
            }}
          >
            I work with people
            <br />
            who change other people&apos;s lives.
            <br />
            They just don&apos;t look like it online —{" "}
            <span className="text-brand-red">yet.</span>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE — 3 columns × 4 rows layout
      ══════════════════════════════════════════════════ */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 gap-3 bg-brand-black">
          {/* Row 1 — col 1,2,3 pictures */}
          <PhotoCell position="18% 8%" className="aspect-square" />
          <PhotoCell position="25% 50%" className="aspect-square" />
          <PhotoCell position="83% 14%" className="aspect-square" />

          {/* Row 2 — col 1,2 pictures / col 3 logo */}
          <PhotoCell position="22% 56%" className="aspect-square" />
          <PhotoCell position="62% 64%" className="aspect-square" />
          <LogoCell className="aspect-square p-3" />

          {/* Row 3 — col 1 picture / col 2-3 text */}
          <PhotoCell position="18% 88%" className="aspect-square" />
          <div className="col-span-2 flex aspect-2/1 items-center px-3">
            <h1
              className="text-left text-[clamp(1.1rem,3.8vw,1.3rem)] leading-[1.05] text-brand-cream"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              From good to <span className="text-brand-red">great</span>.
              <br />
              From business to <span className="text-brand-red">brand</span>.
              <br />
              From client to <span className="text-brand-red">community</span>.
            </h1>
          </div>

          {/* Row 4 — col 1-2 text / col 3 picture */}
          <div className="col-span-2 flex aspect-2/1 items-center pr-2">
            <p
              className="text-left text-[clamp(0.78rem,3.8vw,0.98rem)] leading-[1.28] text-brand-cream italic"
              style={{
                fontFamily:
                  "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 400,
              }}
            >
              I work with founder-led businesses
              <br />
              — sport spaces, independent
              <br />
              brands, expert practices across
              <br />
              Europe — and rebuild them as
              <br />
              brands people want to belong to.
            </p>
          </div>
          <PhotoCell position="72% 92%" className="aspect-square" />
        </div>
      </div>
    </section>
  );
}
