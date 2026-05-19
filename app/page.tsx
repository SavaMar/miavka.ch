import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import BookDiscovery from "@/components/sections/BookDiscovery";
import BrandStatement from "@/components/sections/BrandStatement";
import BrandDefinition from "@/components/sections/BrandDefinition";
import Articles from "@/components/sections/Articles";
import HowIWork from "@/components/sections/HowIWork";
import FoundersWorkedWith from "@/components/sections/FoundersWorkedWith";
import AboutMe from "@/components/sections/AboutMe";
import Offers from "@/components/sections/Offers";
import BookCall from "@/components/sections/BookCall";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <BookDiscovery />
        <BrandStatement />
        <BrandDefinition />
        <Articles />
        <HowIWork />
        <FoundersWorkedWith />
        <AboutMe />
        <Offers />
        <BookCall />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
