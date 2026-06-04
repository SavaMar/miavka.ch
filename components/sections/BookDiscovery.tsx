import Link from "next/link";

function DiscoveryOutlineButton({
  href = "/#contact",
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex rounded-[10px] border-2 border-brand-red bg-transparent px-8 py-3 text-sm font-bold uppercase text-brand-black transition-colors hover:bg-brand-red hover:text-brand-cream"
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

export default function BookDiscovery() {
  const bodyFontStyle = {
    fontFamily:
      "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
    fontWeight: 400,
  } as const;

  return (
    <section className="bg-brand-cream px-6 py-16 md:px-10 md:py-20 lg:px-16">
      <div className="mx-auto grid max-w-[1400px] gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex h-full shadow flex-col rounded-sm   bg-brand-cream p-6 md:p-8">
          <h2
            className="mb-5 text-brand-black uppercase leading-none text-[clamp(1.6rem,3.2vw,2.4rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Sport spaces
          </h2>
          <div
            className="space-y-4 text-[16px] leading-[1.7] text-black"
            style={bodyFontStyle}
          >
            <p>You run a gym, dojo, studio, or fitness space.</p>
            <p>
              You have real culture in the room. Real coaching, real community,
              real results. But online you look like every other gym in the
              city. Your social media is inconsistent. People come for a trial
              and disappear. Members can&apos;t explain what makes you different
              — so they don&apos;t recruit for you.
            </p>
            <p>
              You don&apos;t have a quality problem. You have a visibility
              problem.
            </p>
            <p>
              I audit every touchpoint from first scroll to membership decision,
              find where you&apos;re losing people, and build the brand and
              marketing system that fills your space and keeps people there.
            </p>
          </div>
          <div className="mt-auto pt-7">
            <DiscoveryOutlineButton>Get a Brand Audit</DiscoveryOutlineButton>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-sm  bg-white/80 p-6 md:p-8">
          <h2
            className="mb-5 text-brand-black uppercase leading-none text-[clamp(1.6rem,3.2vw,2.4rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Founders and experts
          </h2>
          <div
            className="space-y-4 text-[16px] leading-[1.7] text-ui-gray-700"
            style={bodyFontStyle}
          >
            <p>
              You&apos;re a founder, coach, or expert with something real to
              say.
            </p>
            <p>
              You have the expertise, the results, the point of view. But
              you&apos;re invisible online. You post without a system, freeze on
              camera, and can&apos;t figure out why the right people aren&apos;t
              finding you. You want clients coming through your content — not
              cold DMs.
            </p>
            <p>
              The problem isn&apos;t what you know. It&apos;s that nobody can
              see it yet.
            </p>
            <p>
              I help you find exactly what you stand for, prepare you to show up
              on camera with conviction, and build the content system that makes
              the right people find you — and trust you before they ever reach
              out.
            </p>
          </div>
          <div className="mt-auto pt-7">
            <DiscoveryOutlineButton>
              Book a Discovery Call
            </DiscoveryOutlineButton>
          </div>
        </div>
      </div>
    </section>
  );
}
