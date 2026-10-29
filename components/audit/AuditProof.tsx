import Reveal from "@/components/motion/Reveal";
import {
  DISPLAY_STYLE,
  MONO_STYLE,
  Placeholder,
  Section,
} from "@/components/audit/ui";

type Status = "Leaking" | "Weak" | "Fine";

// Illustrative layout only. These are NOT results from a real business.
const LEAK_MAP: readonly { stage: string; status: Status }[] = [
  { stage: "Found on Google", status: "Weak" },
  { stage: "Website message", status: "Leaking" },
  { stage: "Mobile and speed", status: "Weak" },
  { stage: "Lead capture", status: "Leaking" },
  { stage: "Follow-up and booking", status: "Fine" },
];

const STATUS_STYLE: Record<Status, { bar: string; width: string }> = {
  Leaking: { bar: "bg-[#D0320E]", width: "w-full" },
  Weak: { bar: "bg-[#C9A24B]", width: "w-2/3" },
  Fine: { bar: "bg-[#4F7A6B]", width: "w-1/3" },
};

const FINDING_GROUPS = [
  { group: "Fix first", text: "The leak that costs you the most." },
  { group: "Fix next", text: "Real, but it can wait one step." },
  { group: "Ignore for now", text: "Not worth your money yet." },
] as const;

export function ProofSection() {
  return (
    <Section
      id="proof"
      tone="dark"
      label="PROOF"
      title="What an audit looks like when it's done."
      intro={
        <p>
          Real case studies and before/after screenshots go here. Until they
          are in, this section only shows the shape of the work.
        </p>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((n, index) => (
          <Reveal key={n} delay={index * 0.08} className="h-full">
            <article className="h-full border border-[#F4F4F0]/25 p-5">
              <p className="text-[11px] uppercase text-[#D0320E]" style={MONO_STYLE}>
                CASE STUDY {String(n).padStart(2, "0")}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {["Before", "After"].map((side) => (
                  <div
                    key={side}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-2 border border-dashed border-[#F4F4F0]/35 p-2 text-center"
                  >
                    <span
                      className="text-[11px] uppercase text-[#F4F4F0]/75"
                      style={MONO_STYLE}
                    >
                      {side}
                    </span>
                    <Placeholder>screenshot</Placeholder>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p>
                  <Placeholder>real client, or anonymized descriptor</Placeholder>
                </p>
                <p>
                  <Placeholder>real before/after metric</Placeholder>
                </p>
                <p>
                  <Placeholder>one-line client quote, with permission</Placeholder>
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <p className="text-[11px] uppercase text-[#F4F4F0]/75" style={MONO_STYLE}>
          [ THE LEAK MAP ]
        </p>
        <h3
          className="mt-2 uppercase"
          style={{ ...DISPLAY_STYLE, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 0.95 }}
        >
          Five stages. One honest status each.
        </h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#F4F4F0]/78">
          Example layout, not a real business. Your audit marks every stage as
          Leaking, Weak or Fine, then sorts what to do about it.
        </p>
      </Reveal>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <ul className="space-y-3" aria-label="Example leak map, five stages">
          {LEAK_MAP.map((row, index) => (
            <li key={row.stage}>
              <Reveal delay={index * 0.05}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-base text-[#F4F4F0]">{row.stage}</span>
                  <span
                    className="text-[11px] uppercase text-[#F4F4F0]"
                    style={MONO_STYLE}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-[#F4F4F0]/12" aria-hidden>
                  <div
                    className={`h-full ${STATUS_STYLE[row.status].bar} ${STATUS_STYLE[row.status].width}`}
                  />
                </div>
              </Reveal>
            </li>
          ))}
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
                  <p className="mt-2">
                    <Placeholder>real finding from a real audit</Placeholder>
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
