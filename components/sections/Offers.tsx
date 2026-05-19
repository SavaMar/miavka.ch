/** Pricing / offers landmark between About Me and booking. Anchor: `#offers` (Nav: “Prices”). */
export default function Offers() {
  return (
    <section
      id="offers"
      className="scroll-mt-24 border-t border-white/10 bg-neutral-950 px-6 py-20 md:scroll-mt-28 md:py-28 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          className="mb-10 uppercase leading-none text-brand-cream md:mb-12 text-[clamp(2rem,5vw,3.75rem)]"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          Offers.
        </h2>
        <p
          className="font-body text-sm leading-relaxed text-brand-cream/70 md:text-base"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          Discovery call is always free — 30 minutes, no pitch. The brand audit is
          a fixed fee. Builds are scoped once we know what’s broken.
        </p>
        <p
          className="mt-6 font-body text-sm leading-relaxed text-brand-cream/70 md:text-base"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          Details and numbers are clearer on the call; this section is here so you
          can jump to pricing intent from anywhere on the site.
        </p>
      </div>
    </section>
  );
}
