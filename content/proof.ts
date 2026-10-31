// Proof shown on the homepage (#proof section and the Guide section).
// Edit this file, not the components. Leave a field as "" to hide it.
// A case study only shows when client, status and both screenshots are set.
// Screenshots and images go in /public, e.g. "/images/proof/acme-before.jpg".
// Never put anything you can't back up in here: no invented numbers or quotes.

export type CaseStudyStatus = "Live" | "Built, not launched" | "In progress";

export type Callout = {
  /** Position of the numbered marker on the Before screenshot, in percent. */
  x: number;
  y: number;
  /** What the marker points at. */
  label: string;
};

export type CaseStudy = {
  /** Who it was for, e.g. "Martial arts academy, Zurich". Required. */
  client: string;
  /** Required. */
  status: CaseStudyStatus | "";
  /** Required. Add 2-3 callouts. */
  before: { src: string; alt: string; callouts: Callout[] };
  /** Three short lines: the leak, and what the visitor experienced. */
  findings: string[];
  /** One or two lines. */
  changes: string[];
  /** Required. */
  after: { src: string; alt: string };
  /** Free text. Only what is true. */
  result: string;
};

export type ProofContent = {
  /** One redacted page of a real audit PDF. Shown above the case studies. */
  sampleAuditPage: { src: string; alt: string; caption: string };
  caseStudies: CaseStudy[];
  /** Shown under "My own site" in the Guide section, e.g. text "12 enquiries", period "in the first month". */
  ownSiteMetric: { text: string; period: string };
};

export const PROOF: ProofContent = {
  sampleAuditPage: {
    src: "",
    alt: "",
    caption: "",
  },
  caseStudies: [
    // {
    //   client: "",
    //   status: "Live",
    //   before: {
    //     src: "",
    //     alt: "",
    //     callouts: [
    //       { x: 20, y: 15, label: "" },
    //       { x: 60, y: 40, label: "" },
    //     ],
    //   },
    //   findings: ["", "", ""],
    //   changes: [""],
    //   after: { src: "", alt: "" },
    //   result: "",
    // },
  ],
  ownSiteMetric: {
    text: "",
    period: "",
  },
};
