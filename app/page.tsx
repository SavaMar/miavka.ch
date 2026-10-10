import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalHero from "@/components/home/PersonalHero";
import HomeNewsletterSignup from "@/components/home/HomeNewsletterSignup";
import PersonalFooter from "@/components/home/PersonalFooter";
import HomeArticlesSection from "@/components/home/HomeArticlesSection";
import AboutTeaserSection from "@/components/home/AboutTeaserSection";
import { DEFAULT_LANG, getAllArticles } from "@/lib/articles";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const SITE_ORIGIN = SITE_URL.startsWith("http")
  ? SITE_URL
  : `https://${SITE_URL}`;

const HOME_DESCRIPTION =
  "Mari Miavka writes about clarity, systems, and reinvention for people building meaningful work.";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mari Miavka",
  url: SITE_ORIGIN,
  description: HOME_DESCRIPTION,
  jobTitle: "Writer and builder",
  worksFor: {
    "@type": "Organization",
    name: "Miavka Studio",
  },
  keywords:
    "writing, systems thinking, reinvention, branding, marketing philosophy",
};

export const metadata: Metadata = {
  title: "Mari Miavka — Writing, Systems, Reinvention",
  description: HOME_DESCRIPTION,
};

export default async function Home() {
  const articles = (await getAllArticles(DEFAULT_LANG)).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <main className="relative min-h-screen bg-[#F4F4F0] text-[#161515]">
        <div
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #161515 0.8px, transparent 0.8px)",
            backgroundSize: "3px 3px",
          }}
          aria-hidden
        />

        <div className="relative z-10">
          <Nav />
          <PersonalHero />
          <HomeNewsletterSignup />
          <HomeArticlesSection articles={articles} />
          <AboutTeaserSection />
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
