import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import PressableCard from "@/components/motion/PressableCard";
import AboutHeroStyleCarousel from "@/components/home/AboutHeroStyleCarousel";
import { DISPLAY_STYLE, MONO_STYLE, Section, visibleText } from "@/components/audit/ui";
import { AUDIT_DELIVERY_TIME, AUDIT_STAGES, type AuditStage } from "@/lib/audit-offer";
import { PROOF } from "@/content/proof";

const LEAK_STORIES: Record<AuditStage, string> = {
  "Found on Google":
    "Someone searches for what you do. A competitor shows up. You don't, or your listing looks half done.",
  "What AI says about you":
    "Someone asks an AI tool who to hire. It names your competitor, gets your details wrong, or knows nothing about you.",
  "Social media":
    "You post, but nobody ends up on your website. Or your accounts look and sound different from your site, so people don't recognise you.",
  "Website that converts":
    "They arrive, from an ad or on their own. They have questions nobody answers, so they look around and leave without applying.",
  "Lead capture":
    "They want to ask something. The form wants too much, so they give up.",
  "Follow-up and booking":
    "They do ask. The answer comes late, or never. Booking a time is a chore. They go somewhere else.",
};

export function ProblemSection() {
  return (
    <Section
      tone="dark"
      label="THE PROBLEM"
      title="Your business is good. Online, it looks like everyone else's."
      intro={
        <>
          <p>
            You pay for marketing. You can&apos;t see where people drop off, so
            you can&apos;t fix it. That&apos;s frustrating, and it&apos;s rarely
            anyone&apos;s fault.
          </p>
          <p>
            An owner should understand their own funnel. If you can&apos;t see
            it, you can&apos;t judge anyone who says they fixed it. And the gap
            costs you clients every month.
          </p>
        </>
      }
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AUDIT_STAGES.map((stage, index) => (
          <li key={stage}>
            <Reveal delay={index * 0.06} className="h-full">
              <div className="h-full border border-[#F4F4F0]/25 p-5">
                <p
                  className="text-[11px] uppercase text-[#D0320E]"
                  style={MONO_STYLE}
                >
                  LEAK {String(index + 1).padStart(2, "0")}
                </p>
                <h3
                  className="mt-2 uppercase"
                  style={{ ...DISPLAY_STYLE, fontSize: "1.6rem", lineHeight: 0.95 }}
                >
                  {stage}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#F4F4F0]/80">
                  {LEAK_STORIES[stage]}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function GuideSection() {
  const metricText = visibleText(PROOF.ownSiteMetric.text);
  const metricPeriod = visibleText(PROOF.ownSiteMetric.period);
  const ownSiteMetric = metricText
    ? [metricText, metricPeriod].filter(Boolean).join(" ")
    : "";

  const facts: { title: string; text: string; metric?: string }[] = [
    {
      title: "Creaholic",
      text: "I rebuilt the website of this Swiss invention studio in Biel, and I'm building its marketing system.",
    },
    {
      title: "My own site",
      text: "I rebuilt my own website, and it started converting. I use my own advice first.",
      metric: ownSiteMetric,
    },
    {
      title: "Audits already written",
      text: "I've written full digital-presence audits for two more Swiss companies, so the format is tested.",
    },
  ];

  return (
    <Section
      tone="light"
      label="YOUR GUIDE"
      title="I'm Mari Miavka. I look at a business the way a developer looks at a product."
      aside={<AboutHeroStyleCarousel />}
      intro={
        <>
          <p>
            Where does it break, and which fix matters most? That&apos;s the
            only question I care about.
          </p>
          <p>
            I work where software development meets marketing. I started in
            software and I think in systems. I build marketing systems for Swiss
            businesses: positioning, website, funnels and automations.
          </p>
        </>
      }
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {facts.map((fact, index) => (
          <li key={fact.title}>
            <Reveal delay={index * 0.06} className="h-full">
              <div className="h-full border border-[#161515]/25 p-5">
                <h3
                  className="uppercase"
                  style={{ ...DISPLAY_STYLE, fontSize: "1.6rem", lineHeight: 0.95 }}
                >
                  {fact.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#161515]/80">
                  {fact.text}
                </p>
                {fact.metric ? (
                  <p
                    className="mt-3 border-t-2 border-[#D0320E] pt-2 text-[12px] uppercase text-[#161515]"
                    style={MONO_STYLE}
                  >
                    {fact.metric}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
      <Reveal className="mt-6">
        <Link
          href="/about"
          className="inline-flex min-h-11 items-center rounded-[5px] border border-[#161515] px-4 py-2 text-[11px] uppercase transition-colors hover:bg-[#D0320E] hover:text-[#161515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]"
          style={MONO_STYLE}
        >
          [ FULL STORY → ]
        </Link>
      </Reveal>
    </Section>
  );
}

const STAGE_CHECKS: Record<AuditStage, string> = {
  "Found on Google":
    "Why people find you, and why they can't. What comes up when someone searches for what you do, and where your listing is missing, half done or wrong.",
  "What AI says about you":
    "What AI tools say about you, and why. Whether they recommend you, get facts wrong, or know nothing.",
  "Social media":
    "Whether your posts bring people to your website, and whether you look and sound the same everywhere.",
  "Website that converts":
    "Where visitors leave, from ads or on their own, which questions go unanswered, and what stops them from acting.",
  "Lead capture": "Contact options and form friction.",
  "Follow-up and booking": "How fast you answer, and booking friction.",
};

const STACK = [
  ...AUDIT_STAGES.map((stage) => ({ name: stage, detail: STAGE_CHECKS[stage] })),
  {
    name: "Your status and how I rated it",
    detail:
      "Each stage gets an honest status: Leaking, Weak or Fine. I explain how I checked it, where I looked and what my criteria were. I also look at your language, who you speak to and who your customers are.",
  },
  {
    name: "Your top three fixes",
    detail: "Ranked, so you know what to do first.",
  },
  {
    name: "A short video walkthrough",
    detail: "I show you each leak on screen, in your own data.",
  },
];

const VALUE_EQUATION = [
  {
    lever: "Outcome",
    text: "You see exactly where you lose customers, and which three fixes come first.",
  },
  {
    lever: "Likelihood",
    text: "It's built from your real pages and numbers, not a generic checklist.",
  },
  {
    lever: "Time",
    text: `You get your audit within ${AUDIT_DELIVERY_TIME}, before you spend on any fix.`,
  },
  {
    lever: "Effort",
    text: "Read-only analytics access plus a 10-minute intake. That's all I need from you.",
  },
] as const;

export function StackSection() {
  return (
    <Section
      tone="dark"
      label="WHAT YOU GET"
      title="A Digital Leak Audit: a PDF and a short video, free."
      intro={
        <p>
          Know where you&apos;re losing customers before you pay anyone to fix
          it. Here is everything inside.
        </p>
      }
    >
      <ul className="grid gap-3">
        {STACK.map((item, index) => (
          <li key={item.name}>
            <Reveal delay={index * 0.05}>
              <div className="grid gap-1 border border-[#F4F4F0]/25 p-4 md:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.2fr)] md:items-baseline md:gap-6 md:p-5">
                <p
                  className="text-[11px] uppercase text-[#D0320E]"
                  style={MONO_STYLE}
                >
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3
                  className="uppercase"
                  style={{ ...DISPLAY_STYLE, fontSize: "1.45rem", lineHeight: 0.95 }}
                >
                  {item.name}
                </h3>
                <p className="text-base leading-relaxed text-[#F4F4F0]/78">
                  {item.detail}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-10">
        <p className="text-[11px] uppercase text-[#F4F4F0]/75" style={MONO_STYLE}>
          [ WHY IT&apos;S AN EASY YES ]
        </p>
      </Reveal>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {VALUE_EQUATION.map((row, index) => (
          <Reveal key={row.lever} delay={index * 0.06}>
            <PressableCard className="h-full">
              <div className="h-full border-t-2 border-[#D0320E] pt-3">
                <dt
                  className="uppercase"
                  style={{ ...DISPLAY_STYLE, fontSize: "1.5rem", lineHeight: 0.95 }}
                >
                  {row.lever}
                </dt>
                <dd className="mt-2 text-base leading-relaxed text-[#F4F4F0]/78">
                  {row.text}
                </dd>
              </div>
            </PressableCard>
          </Reveal>
        ))}
      </dl>

      <Reveal className="mt-12">
        <div className="max-w-3xl border-l-4 border-[#D0320E] pl-5">
          <p className="text-[11px] uppercase text-[#F4F4F0]/75" style={MONO_STYLE}>
            [ WHY IT&apos;S FREE ]
          </p>
          <h3
            className="mt-2 uppercase"
            style={{ ...DISPLAY_STYLE, fontSize: "1.9rem", lineHeight: 0.95 }}
          >
            Why is it free?
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-[#F4F4F0]/82">
            I&apos;m building my case studies, so the first audits are free. You
            get a real diagnostic of your business. If it helps, I&apos;ll ask
            for an honest review. If it doesn&apos;t, you owe me nothing.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

const STEPS = [
  {
    title: "Answer a short quiz",
    text: "Four questions. One screen each. About a minute.",
  },
  {
    title: "Get your PDF",
    text: "Enter your name and email. The Digital Leak Audit unlocks right away.",
  },
  {
    title: "Talk to me if it fits",
    text: "If the audit shows work worth doing, the PDF tells you how to reach me. If not, you keep the audit.",
  },
] as const;

export function PlanSection() {
  return (
    <Section
      tone="light"
      label="THE PLAN"
      title="Three steps. No sales call to start."
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <li key={step.title}>
            <Reveal delay={index * 0.08} className="h-full">
              <div className="h-full border border-[#161515]/25 p-5">
                <p
                  className="text-[#D0320E]"
                  style={{ ...DISPLAY_STYLE, fontSize: "3.2rem", lineHeight: 0.9 }}
                >
                  {index + 1}
                </p>
                <h3
                  className="mt-3 uppercase"
                  style={{ ...DISPLAY_STYLE, fontSize: "1.6rem", lineHeight: 0.95 }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#161515]/80">
                  {step.text}
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** A black band between "who it's not for" and the quiz: what waiting costs. */
export function StakesSection() {
  return (
    <div className="bg-[#161515] px-4 py-7 text-center text-[#F4F4F0] md:px-8 md:py-9 lg:px-12">
      <Reveal className="mx-auto w-full max-w-3xl">
        <p
          className="uppercase"
          style={{ ...DISPLAY_STYLE, fontSize: "clamp(1.1rem, 2vw, 1.6rem)", lineHeight: 1 }}
        >
          Every month you can&apos;t see the leak, you pay for traffic that
          goes nowhere.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#F4F4F0]/80 md:text-base">
          Once you can see it, you decide what to fix, what to ignore, and who
          to trust.
        </p>
      </Reveal>
    </div>
  );
}

export function NotForSection() {
  return (
    <Section
      tone="light"
      label="BE HONEST WITH ME"
      title="Who this is not for."
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Reveal>
          <ul className="space-y-3 text-lg leading-relaxed text-[#161515]/85">
            <li>— You want a logo or a visual refresh. This isn&apos;t that.</li>
            <li>— You want guaranteed results. I don&apos;t promise numbers.</li>
            <li>— You won&apos;t act on what the audit shows.</li>
            <li>— You don&apos;t have a business with real customers yet.</li>
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="border-l-4 border-[#D0320E] pl-5">
            <h3
              className="uppercase"
              style={{ ...DISPLAY_STYLE, fontSize: "1.9rem", lineHeight: 0.95 }}
            >
              Limited, on purpose
            </h3>
            <p className="mt-3 text-lg leading-relaxed text-[#161515]/85">
              I do each audit by hand, so I take a limited number per month.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
