import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalFooter from "@/components/home/PersonalFooter";
import ContactInquiryForm from "@/components/contact/ContactInquiryForm";
import NotesSubscribeForm from "@/components/articles/NotesSubscribeForm";
import Link from "next/link";
import { AtSign, Instagram, Linkedin, Youtube } from "lucide-react";

const CONTACT_BG_COLOR = "#FFFFFF";
const CONTACT_PATTERN_COLOR = "#BAB7B7";
const CONTACT_PATTERN_OPACITY = 0.3;

export const metadata: Metadata = {
  title: "Contact | Mari Miavka",
  description:
    "Contact Mari Miavka for collaboration, support, and online presence strategy.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main
        className="relative min-h-screen overflow-x-hidden pt-8 md:pt-10"
        style={{ backgroundColor: CONTACT_BG_COLOR }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundColor: CONTACT_PATTERN_COLOR,
            opacity: CONTACT_PATTERN_OPACITY,
            WebkitMaskImage: "url('/bg_1.svg')",
            WebkitMaskRepeat: "repeat",
            WebkitMaskSize: "520px auto",
            WebkitMaskPosition: "top left",
            maskImage: "url('/bg_1.svg')",
            maskRepeat: "repeat",
            maskSize: "520px auto",
            maskPosition: "top left",
          }}
          aria-hidden
        />

        <section className="relative z-10 w-full bg-[#0A0A0A] px-6 pb-10 pt-12 md:px-10 md:pt-16 lg:px-16">
          <div className="mx-auto max-w-300">
            <p
              className="text-sm uppercase tracking-[0.22em] text-brand-red"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              }}
            >
              Discovery
            </p>
            <h1
              className="mt-4 text-[clamp(2rem,5vw,4.2rem)] uppercase leading-[0.94] text-white"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              Contact me
            </h1>
            <p
              className="mt-5 max-w-3xl text-[18px] leading-[1.7] text-white/82"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              Tell me if you have questions, want to work together, collaborate,
              or want my help with your online presence.
            </p>
          </div>
        </section>

        <section className="relative z-10 mt-8 px-6 pb-8 md:mt-10 md:px-10 lg:px-16">
          <div className="mx-auto grid max-w-300 gap-8 rounded-2xl bg-white/80 p-6 md:p-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
            <div className="flex flex-col">
              <div className="flex-1 overflow-hidden rounded-[10px] border border-brand-black/15 bg-brand-black shadow-[0_12px_34px_rgba(17,17,17,0.2)]">
                <div className="aspect-video h-full w-full">
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

            <div className="flex flex-col">
              <h2
                className="text-[clamp(1.45rem,3vw,2.2rem)] uppercase leading-[0.95] text-brand-black"
                style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
              >
                Send your message
              </h2>
              <div className="mt-3 flex-1">
                <ContactInquiryForm className="h-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-8 md:px-10 lg:px-16">
          <div className="mx-auto max-w-300 rounded-[10px] bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,0.07)] md:p-8">
            <h2
              className="text-[clamp(1.35rem,3vw,2.35rem)] uppercase leading-[0.95] text-brand-black"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              Let&apos;s stay connected
            </h2>
            <p
              className="mt-3 max-w-3xl text-sm leading-relaxed text-ui-gray-700"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              Follow me for notes on brand systems, experiments, and ideas worth
              testing in real life.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://instagram.com/marimiavka"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-brand-black/15 text-brand-black transition-colors hover:bg-brand-black hover:text-white"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://www.linkedin.com/in/mari-miavka/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-brand-black/15 text-brand-black transition-colors hover:bg-brand-black hover:text-white"
              >
                <Linkedin className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-brand-black/15 text-brand-black transition-colors hover:bg-brand-black hover:text-white"
              >
                <Youtube className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://www.threads.net/@marimiavka"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-brand-black/15 text-brand-black transition-colors hover:bg-brand-black hover:text-white"
              >
                <AtSign className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6 pb-20 md:px-10 md:pb-24 lg:px-16">
          <div className="mx-auto max-w-300 rounded-[10px] bg-white p-6 shadow-[0_10px_30px_rgba(17,17,17,0.07)] md:p-8">
            <h2
              className="text-[2.05rem] uppercase leading-[0.95] text-brand-black"
              style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
            >
              Subscribe
              <br />
              to Notes
            </h2>
            <p
              className="mt-4 text-sm leading-relaxed text-ui-gray-700"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              Notes from the middle of the work: what I&apos;m watching, reading,
              testing and building. The AI tools and prompts I actually use,
              marketing insights that worked, and what it&apos;s really like
              starting a business in Switzerland as an expat. Short, honest, and
              ready for you to steal.
            </p>
            <NotesSubscribeForm
              offer="contact-page-notes"
              className="mt-5"
              layout="inline"
              inputClassName="rounded-[10px] border-ui-gray-300/55"
              buttonClassName="!rounded-[10px] !bg-brand-black !text-white hover:!bg-brand-black/88 hover:!text-white"
            />
            <p
              className="mt-5 text-xs leading-relaxed text-ui-gray-700"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 300,
              }}
            >
              By submitting this form, you&apos;ll be signed up to my free
              newsletter, which sometimes includes mentions of my books, apps
              and courses. You can opt-out at any time with no hard feelings 😉
              Here&apos;s our{" "}
              <Link
                href="/privacy-policy"
                className="underline decoration-ui-gray-500 underline-offset-2 hover:text-brand-black"
              >
                privacy policy
              </Link>{" "}
              if you like reading.
            </p>
          </div>
        </section>
      </main>
      <PersonalFooter />
    </>
  );
}
