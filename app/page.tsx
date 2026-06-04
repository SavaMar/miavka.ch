import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import BookDiscovery from "@/components/sections/BookDiscovery";
import BrandStatement from "@/components/sections/BrandStatement";
import Articles from "@/components/sections/Articles";
import HowIWork from "@/components/sections/HowIWork";
import FoundersWorkedWith from "@/components/sections/FoundersWorkedWith";
import AboutMe from "@/components/sections/AboutMe";
import Offers from "@/components/sections/Offers";
import BookCall from "@/components/sections/BookCall";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
const SITE_ORIGIN = SITE_URL.startsWith("http")
  ? SITE_URL
  : `https://${SITE_URL}`;

const HOME_DESCRIPTION =
  "Mari Miavka helps sport spaces, gyms, and fitness studios close the gap between who they are and how they appear online. Based in Switzerland, working across Europe.";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Miavka Studio",
  url: SITE_ORIGIN,
  description: HOME_DESCRIPTION,
  areaServed: ["Switzerland", "Europe"],
  founder: {
    "@type": "Person",
    name: "Mari Miavka",
  },
  keywords:
    "brand strategist Switzerland, sport business branding, gym marketing Europe, Markenstrategie Schweiz, fitness studio brand strategy, martial arts academy marketing, brand consultant Geneva, stratège de marque en Suisse, stratège marketing",
};

export const metadata: Metadata = {
  title: "Miavka Studio — Brand Strategy for Sport Businesses | Switzerland",
  description: HOME_DESCRIPTION,
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD) }}
      />
      <Nav />
      <main>
        <Hero />
        <BookDiscovery />
        <BrandStatement />
        {/* <BrandDefinition /> */}
        <HowIWork />
        <FoundersWorkedWith />
        <Articles />
        <AboutMe />
        <Offers />
        <BookCall />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
