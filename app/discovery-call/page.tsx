import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookCall from "@/components/sections/BookCall";

export const metadata: Metadata = {
  title: "Discovery Call | Miavka Studio",
  description:
    "Book a discovery call with Mari Miavka to diagnose your visibility and build a focused brand + marketing system.",
};

export default function DiscoveryCallPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-brand-cream pt-[108px] md:pt-[116px]">
        <section className="px-6 pb-14 pt-12 md:px-10 md:pb-16 md:pt-16 lg:px-16">
          <div className="mx-auto max-w-[1200px]">
            <p
              className="text-sm uppercase tracking-[0.22em] text-brand-red"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Discovery Call
            </p>
            <h1
              className="mt-4 text-brand-black uppercase leading-[0.94] text-[clamp(2rem,5vw,4.2rem)]"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              What the call is about
            </h1>
            <p
              className="mt-5 max-w-3xl text-[18px] leading-[1.7] text-ui-gray-700"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              This is a strategic conversation, not a sales script. We look at
              your current positioning, social presence, and conversion path to
              identify the exact points where visibility and trust are breaking.
            </p>
          </div>
        </section>

        <section className="px-6 pb-8 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-[1200px] gap-8 rounded-2xl bg-white/80 p-6 md:p-8 lg:grid-cols-2 lg:gap-10">
            <div>
              <h2
                className="text-brand-black uppercase text-[clamp(1.45rem,3vw,2.2rem)] leading-[0.95]"
                style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
              >
                What to expect
              </h2>
              <ul
                className="mt-5 space-y-3 text-[16px] leading-relaxed text-ui-gray-700"
                style={{
                  fontFamily:
                    "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                  fontWeight: 300,
                }}
              >
                <li>• 30 minutes focused on your current reality</li>
                <li>• Honest diagnosis of what is working and what is not</li>
                <li>• Clear next steps you can apply immediately</li>
                <li>• If there is a fit, we discuss the best path forward</li>
              </ul>
            </div>

            <div>
              <h2
                className="text-brand-black uppercase text-[clamp(1.45rem,3vw,2.2rem)] leading-[0.95]"
                style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
              >
                Short video before booking
              </h2>
              <div className="mt-5 overflow-hidden rounded-[10px] border border-brand-black/15 bg-brand-black shadow-[0_12px_34px_rgba(17,17,17,0.2)]">
                <div className="aspect-video w-full">
                  <div className="flex h-full w-full items-center justify-center bg-brand-black/95">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-cream/35 text-brand-cream/80">
                        ▶
                      </div>
                      <p
                        className="text-sm uppercase tracking-[0.18em] text-brand-cream/65"
                        style={{
                          fontFamily:
                            "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                        }}
                      >
                        Video coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BookCall />
      </main>
      <Footer />
    </>
  );
}
