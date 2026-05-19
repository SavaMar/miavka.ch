import DiscoveryCallButton from "@/components/sections/DiscoveryCallButton";

const PAIN_POINTS = [
  "Your space feels different in person. Online, you look like every other business in your area.",
  "You spend money getting new clients in — and watch them quietly leave six months later, with no system to bring them back.",
  "You have no idea what happens between someone seeing your ad and walking through your door — or why most of them never do.",
  "You hired an agency. The content looks generic, has no voice, and you're not even sure what it's doing for you.",
  "You're losing money at every step — and you can't see where. The DM that ghosted. The trial that never came back. The member who quietly cancelled. By the time the numbers show you, it's already gone.",
  "Your physical space is intentional. Your website, Instagram, and emails feel like three different businesses.",
];

export default function BrandStatement() {
  return (
    <section className="bg-brand-black px-6 py-16 md:px-10 md:py-24 lg:px-[155px] lg:py-[95px]">
      {/* Headline */}
      <div className="mb-6 text-center md:mb-8">
        <h2
          className="text-brand-cream text-[clamp(1.55rem,8vw,3.2rem)] uppercase leading-[0.98] md:leading-[0.95]"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          You built something <span className="text-brand-red">real.</span>
          <br />
          The internet has <span className="text-brand-red">NO IDEA</span> what
          you are.
        </h2>
      </div>

      {/* Subtitle */}
      <div className="mb-10 text-center md:mb-14">
        <p
          className="text-white text-sm italic leading-relaxed md:text-md"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 400,
          }}
        >
          There&apos;s a gap between what your business is and what people see
          online.
          <br />
          It&apos;s costing you the clients you want, the growth you&apos;ve
          earned, and the next ten years of momentum.
          <br />
        </p>
      </div>

      {/* Pain points — single column mobile; lg: 3 columns (2 readable rows when you have ~6 bullets) */}
      <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 gap-y-8 md:mb-16 md:gap-y-12 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-10">
        {PAIN_POINTS.map((text) => (
          <div key={text} className="flex gap-3">
            <span
              className="mt-0.5 shrink-0 text-sm leading-snug font-bold text-brand-red md:text-base"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              ×
            </span>
            <p
              className="text-white text-sm leading-relaxed md:text-m"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* Sub-tagline */}
      <div className="mb-9 text-center md:mb-10">
        <p
          className="mb-3 text-[clamp(0.95rem,4.5vw,3rem)] text-brand-cream md:text-lg"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          The gap isn&apos;t a content problem. It&apos;s a{" "}
          <span className="text-brand-red">system</span> problem.
        </p>
        <p
          className="mx-auto max-w-3xl text-sm text-white md:text-md"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          When your space, your voice, your visuals, and your marketing finally
          pull in the same direction,{" "}
          <span className="text-brand-red">
            the right people stop scrolling past
          </span>{" "}
          — and the business you actually built starts showing up online.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-4 md:gap-5">
        <DiscoveryCallButton variant="dark" size="large" />
        <p
          className="max-w-md text-center text-xs italic text-brand-cream md:max-w-none md:text-sm"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          *No pitch. No funnel. Just a clear look at your business, with someone
          who knows what to look for.
        </p>
      </div>
    </section>
  );
}
