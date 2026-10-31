import Reveal from "@/components/motion/Reveal";
import {
  DISPLAY_STYLE,
  MONO_STYLE,
  Section,
  visibleText,
} from "@/components/audit/ui";
import {
  AUDIT_STAGES,
  AUDIT_STAGE_COUNT_WORD,
  AUDIT_STAGE_COUNT_WORD_CAPITAL,
  type AuditStage,
} from "@/lib/audit-offer";
import { PROOF, type CaseStudy, type CaseStudyStatus } from "@/content/proof";

type Status = "Leaking" | "Weak" | "Fine";

// Illustrative layout only. These are NOT results from a real business.
const LEAK_MAP_STATUS: Record<AuditStage, Status> = {
  "Found on Google": "Weak",
  "What AI says about you": "Leaking",
  "Social media": "Weak",
  "Website that converts": "Leaking",
  "Lead capture": "Leaking",
  "Follow-up and booking": "Fine",
};

const STATUS_STYLE: Record<Status, { bar: string; width: string }> = {
  Leaking: { bar: "bg-[#D0320E]", width: "w-full" },
  Weak: { bar: "bg-[#C9A24B]", width: "w-2/3" },
  Fine: { bar: "bg-[#4F7A6B]", width: "w-1/3" },
};

const FINDING_GROUPS = [
  {
    group: "Fix first",
    text: "The leak that costs you the most.",
    example: "The headline says what you are, not what the visitor gets.",
  },
  {
    group: "Fix next",
    text: "Real, but it can wait one step.",
    example: "The contact form asks for more than you need to reply.",
  },
  {
    group: "Ignore for now",
    text: "Not worth your money yet.",
    example: "The logo could look more modern. Nobody leaves because of it.",
  },
] as const;

const STATUS_BADGE: Record<CaseStudyStatus, string> = {
  Live: "border-[#4F7A6B] text-[#8FBCAB]",
  "Built, not launched": "border-[#C9A24B] text-[#E0C27A]",
  "In progress": "border-[#F4F4F0]/45 text-[#F4F4F0]/80",
};

type ReadyCaseStudy = {
  client: string;
  status: CaseStudyStatus;
  before: { src: string; alt: string; callouts: { x: number; y: number; label: string }[] };
  findings: string[];
  changes: string[];
  after: { src: string; alt: string };
  result: string;
};

function clampPercent(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}

/** Returns null unless every required field is filled with publishable text. */
function toReadyCaseStudy(study: CaseStudy): ReadyCaseStudy | null {
  const client = visibleText(study.client);
  const beforeSrc = visibleText(study.before?.src);
  const afterSrc = visibleText(study.after?.src);
  if (!client || !study.status || !beforeSrc || !afterSrc) return null;

  return {
    client,
    status: study.status,
    before: {
      src: beforeSrc,
      alt: visibleText(study.before.alt) || `${client}, before`,
      callouts: (study.before.callouts ?? [])
        .map((callout) => ({
          x: clampPercent(callout.x),
          y: clampPercent(callout.y),
          label: visibleText(callout.label),
        }))
        .filter((callout) => callout.label)
        .slice(0, 3),
    },
    findings: (study.findings ?? []).map(visibleText).filter(Boolean).slice(0, 3),
    changes: (study.changes ?? []).map(visibleText).filter(Boolean).slice(0, 2),
    after: {
      src: afterSrc,
      alt: visibleText(study.after.alt) || `${client}, after`,
    },
    result: visibleText(study.result),
  };
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] uppercase text-[#F4F4F0]/75" style={MONO_STYLE}>
      {children}
    </p>
  );
}

function SampleAuditPage() {
  const src = visibleText(PROOF.sampleAuditPage.src);
  if (!src) return null;
  const caption = visibleText(PROOF.sampleAuditPage.caption);

  return (
    <Reveal>
      <figure className="grid gap-5 border border-[#F4F4F0]/25 p-5 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:items-start md:gap-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={visibleText(PROOF.sampleAuditPage.alt) || "A redacted page from a real Digital Leak Audit"}
          loading="lazy"
          className="block h-auto w-full border border-[#F4F4F0]/15 bg-[#F4F4F0]"
        />
        <figcaption>
          <Eyebrow>[ SAMPLE AUDIT PAGE ]</Eyebrow>
          {caption ? (
            <p className="mt-3 text-base leading-relaxed text-[#F4F4F0]/82">{caption}</p>
          ) : null}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function CaseStudyCard({ study, index }: { study: ReadyCaseStudy; index: number }) {
  return (
    <article className="border border-[#F4F4F0]/25 p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase text-[#D0320E]" style={MONO_STYLE}>
            CASE STUDY {String(index + 1).padStart(2, "0")}
          </p>
          <h3
            className="mt-1 uppercase"
            style={{ ...DISPLAY_STYLE, fontSize: "1.6rem", lineHeight: 0.95 }}
          >
            {study.client}
          </h3>
        </div>
        <span
          className={`border px-2 py-1 text-[11px] uppercase ${STATUS_BADGE[study.status]}`}
          style={MONO_STYLE}
        >
          {study.status}
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <Eyebrow>Before</Eyebrow>
          <div className="relative mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={study.before.src}
              alt={study.before.alt}
              loading="lazy"
              className="block h-auto w-full border border-[#F4F4F0]/15"
            />
            {study.before.callouts.map((callout, calloutIndex) => (
              <span
                key={`${callout.label}-${calloutIndex}`}
                aria-hidden
                className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#F4F4F0] bg-[#D0320E] text-[12px] font-bold text-[#F4F4F0] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                style={{ left: `${callout.x}%`, top: `${callout.y}%`, ...MONO_STYLE, letterSpacing: 0 }}
              >
                {calloutIndex + 1}
              </span>
            ))}
          </div>
          {study.before.callouts.length > 0 ? (
            <ol className="mt-3 space-y-1.5 text-sm leading-relaxed text-[#F4F4F0]/82">
              {study.before.callouts.map((callout, calloutIndex) => (
                <li key={`${callout.label}-${calloutIndex}`} className="flex gap-2">
                  <span className="text-[#D0320E]" style={MONO_STYLE}>
                    {calloutIndex + 1}
                  </span>
                  {callout.label}
                </li>
              ))}
            </ol>
          ) : null}

          {study.findings.length > 0 ? (
            <div className="mt-5">
              <Eyebrow>What the audit found</Eyebrow>
              <ul className="mt-2 space-y-2 text-base leading-relaxed text-[#F4F4F0]/85">
                {study.findings.map((finding) => (
                  <li key={finding}>— {finding}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div>
          {study.changes.length > 0 ? (
            <div className="mb-5">
              <Eyebrow>What changed</Eyebrow>
              <ul className="mt-2 space-y-2 text-base leading-relaxed text-[#F4F4F0]/85">
                {study.changes.map((change) => (
                  <li key={change}>— {change}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <Eyebrow>After</Eyebrow>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={study.after.src}
            alt={study.after.alt}
            loading="lazy"
            className="mt-2 block h-auto w-full border border-[#F4F4F0]/15"
          />

          {study.result ? (
            <div className="mt-5 border-t-2 border-[#D0320E] pt-3">
              <Eyebrow>Result</Eyebrow>
              <p className="mt-2 text-base leading-relaxed text-[#F4F4F0]">{study.result}</p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProofSection() {
  const caseStudies = PROOF.caseStudies
    .map(toReadyCaseStudy)
    .filter((study): study is ReadyCaseStudy => study !== null);
  const hasSample = Boolean(visibleText(PROOF.sampleAuditPage.src));
  const hasProof = hasSample || caseStudies.length > 0;

  return (
    <Section
      id="proof"
      tone="dark"
      label="PROOF"
      title="What an audit looks like when it's done."
      intro={
        <p>
          Every audit checks the same {AUDIT_STAGE_COUNT_WORD} stages, gives
          each one an honest status, and sorts the fixes by what matters first.
        </p>
      }
    >
      {hasProof ? (
        <div className="mb-12 grid gap-6">
          <SampleAuditPage />
          {caseStudies.map((study, index) => (
            <Reveal key={`${study.client}-${index}`} delay={index * 0.06}>
              <CaseStudyCard study={study} index={index} />
            </Reveal>
          ))}
        </div>
      ) : null}

      <Reveal>
        <p className="text-[11px] uppercase text-[#F4F4F0]/75" style={MONO_STYLE}>
          [ THE LEAK MAP ]
        </p>
        <h3
          className="mt-2 uppercase"
          style={{ ...DISPLAY_STYLE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 0.95 }}
        >
          {AUDIT_STAGE_COUNT_WORD_CAPITAL} stages. One honest status each.
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#F4F4F0]/78">
          Example layout, not a real business. Your audit marks every stage as
          Leaking, Weak or Fine, then sorts what to do about it.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ul className="space-y-3" aria-label={`Example leak map, ${AUDIT_STAGE_COUNT_WORD} stages`}>
          {AUDIT_STAGES.map((stage, index) => {
            const status = LEAK_MAP_STATUS[stage];
            return (
              <li key={stage}>
                <Reveal delay={index * 0.05}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-base text-[#F4F4F0]">{stage}</span>
                    <span className="text-[11px] uppercase text-[#F4F4F0]" style={MONO_STYLE}>
                      {status}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full bg-[#F4F4F0]/12" aria-hidden>
                    <div
                      className={`h-full ${STATUS_STYLE[status].bar} ${STATUS_STYLE[status].width}`}
                    />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <ul className="grid gap-3" aria-label="Example findings, grouped by priority">
          {FINDING_GROUPS.map((item, index) => (
            <li key={item.group}>
              <Reveal delay={index * 0.07}>
                <div className="border border-[#F4F4F0]/25 p-4">
                  <h4
                    className="uppercase"
                    style={{ ...DISPLAY_STYLE, fontSize: "1.45rem", lineHeight: 0.95 }}
                  >
                    {item.group}
                  </h4>
                  <p className="mt-2 text-base text-[#F4F4F0]/78">{item.text}</p>
                  <p className="mt-3 text-base leading-relaxed text-[#F4F4F0]">
                    <span
                      className="mr-2 border border-[#D0320E] px-1.5 py-0.5 text-[10px] uppercase text-[#D0320E]"
                      style={MONO_STYLE}
                    >
                      Example
                    </span>
                    {item.example}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
