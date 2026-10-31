import type { ReactNode } from "react";

const labelFont = {
  fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
};
const monoFont = {
  fontFamily:
    "var(--font-jetbrains-mono), 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
};

function Node({
  children,
  note,
  accent = false,
}: {
  children: ReactNode;
  note?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center rounded-xl border px-4 py-3 text-center text-sm font-medium leading-snug ${
        accent
          ? "border-brand-red bg-brand-red text-white"
          : "border-brand-black/15 bg-white text-brand-black"
      }`}
      style={labelFont}
    >
      {children}
      {note ? (
        <span
          className={`mt-1 block text-[11px] font-normal ${
            accent ? "text-white/80" : "text-ui-gray-700"
          }`}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}

function Arrow({ direction = "responsive" }: { direction?: "down" | "responsive" }) {
  return (
    <span
      aria-hidden
      className={`flex items-center justify-center text-lg leading-none text-brand-red ${
        direction === "responsive" ? "rotate-90 md:rotate-0" : "rotate-90"
      }`}
    >
      →
    </span>
  );
}

function LoopBack({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-5 text-center text-[11px] uppercase text-ui-gray-700"
      style={{ ...monoFont, letterSpacing: "0.08em" }}
    >
      <span aria-hidden className="mr-1.5 text-brand-red">
        ↺
      </span>
      {children}
    </p>
  );
}

const DECISION_STEPS: { label: string; note?: string }[] = [
  { label: "Decision" },
  { label: "Action" },
  { label: "Result", note: "after a delay" },
  { label: "New information" },
  { label: "Understanding of the pattern" },
];

export function DecisionLoop() {
  return (
    <figure className="my-10 rounded-2xl bg-brand-cream p-5 md:p-7">
      <figcaption className="sr-only">
        A loop: a decision leads to action, action leads to a result after a
        delay, the result brings new information, new information builds
        understanding of the pattern, and that understanding feeds the next
        decision. The result also affects the environment, and the environment
        shapes the next decision.
      </figcaption>

      <ol className="flex flex-col items-stretch gap-2 md:flex-row">
        {DECISION_STEPS.map((step, index) => (
          <li key={step.label} className="flex flex-col gap-2 md:flex-1 md:flex-row">
            <div className="md:flex-1">
              <Node accent={index === 0} note={step.note}>
                {step.label}
              </Node>
            </div>
            {index < DECISION_STEPS.length - 1 ? <Arrow /> : null}
          </li>
        ))}
      </ol>

      <LoopBack>Understanding feeds your next decision</LoopBack>

      <div
        className="mt-6 rounded-xl border border-dashed border-brand-black/35 px-4 py-4 text-center text-sm leading-relaxed text-brand-black"
        style={labelFont}
      >
        <span className="font-medium">Result</span>
        <span className="mx-2 text-ui-gray-700">affects</span>
        <span className="font-medium">
          Environment: people, business, health, relationships
        </span>
        <span className="mx-2 text-ui-gray-700">shapes</span>
        <span className="font-medium">your next decision</span>
      </div>
    </figure>
  );
}

const GARDEN_PATHS: { feed: string; environment: string; outcome: string }[] = [
  {
    feed: "Care, clarity, boundaries",
    environment: "Environment that supports growth",
    outcome: "More options, more energy",
  },
  {
    feed: "Neglect, noise, avoidance",
    environment: "Environment that drains",
    outcome: "Fewer options, less energy",
  },
  {
    feed: "No direction at all",
    environment: "Randomness decides for you",
    outcome: "Unpredictable outcomes",
  },
];

export function GardenLoop() {
  return (
    <figure className="my-10 rounded-2xl bg-brand-cream p-5 md:p-7">
      <figcaption className="sr-only">
        Your daily decisions lead to one question: what are you feeding? Care,
        clarity and boundaries build an environment that supports growth, with
        more options and more energy. Neglect, noise and avoidance build an
        environment that drains, with fewer options and less energy. No
        direction at all lets randomness decide, with unpredictable outcomes.
        Every path loops back to your daily decisions.
      </figcaption>

      <div className="mx-auto flex max-w-xs flex-col gap-2">
        <Node>Your daily decisions</Node>
        <Arrow direction="down" />
        <Node accent>What are you feeding?</Node>
      </div>

      <ul className="mt-5 grid gap-4 md:grid-cols-3 md:grid-rows-[auto_1fr_auto_1fr]">
        {GARDEN_PATHS.map((path) => (
          <li key={path.feed} className="flex flex-col gap-2 md:row-span-4 md:grid md:grid-rows-subgrid">
            <p
              className="text-center text-[11px] uppercase text-brand-red"
              style={{ ...monoFont, letterSpacing: "0.08em" }}
            >
              {path.feed}
            </p>
            <Node>{path.environment}</Node>
            <Arrow direction="down" />
            <Node>{path.outcome}</Node>
          </li>
        ))}
      </ul>

      <LoopBack>Every path loops back to your daily decisions</LoopBack>
    </figure>
  );
}
