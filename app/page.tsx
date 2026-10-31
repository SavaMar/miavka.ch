import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PersonalHero from "@/components/home/PersonalHero";
import HomeNewsletterSignup from "@/components/home/HomeNewsletterSignup";
import PersonalFooter from "@/components/home/PersonalFooter";
import HomeArticlesSection from "@/components/home/HomeArticlesSection";
import {
  GuideSection,
  NotForSection,
  StakesSection,
  PlanSection,
  ProblemSection,
  StackSection,
} from "@/components/audit/AuditSections";
import { ProofSection } from "@/components/audit/AuditProof";
import AuditQuiz from "@/components/audit/AuditQuiz";
import { DEFAULT_LANG, getAllArticles } from "@/lib/articles";

const HOME_DESCRIPTION =
  "Mari Miavka is a marketer, software developer and AI and automation strategist. Get a free Digital Leak Audit and see where your business loses customers online.";

export const metadata: Metadata = {
  title: "Mari Miavka — Free Digital Leak Audit for Swiss businesses",
  description: HOME_DESCRIPTION,
};

export default async function Home() {
  const articles = (await getAllArticles(DEFAULT_LANG)).slice(0, 3);

  return (
    <>
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
          <ProblemSection />
          <GuideSection />
          <StackSection />
          <PlanSection />
          <ProofSection />
          <NotForSection />
          <StakesSection />
          <AuditQuiz />
          <HomeNewsletterSignup />
          <HomeArticlesSection articles={articles} />
        </div>
      </main>
      <PersonalFooter />
    </>
  );
}
