// Shared facts about the Digital Leak Audit offer, used across the homepage.

/** DRAFT: confirm before launch. */
export const AUDIT_DELIVERY_TIME = "5 working days";

/**
 * The stages every audit checks, in this order, everywhere on the site.
 * They follow the customer's path: found, checked by AI, seen on social,
 * lands on the website, gets in touch, gets an answer.
 */
export const AUDIT_STAGES = [
  "Found on Google",
  "What AI says about you",
  "Social media",
  "Website that converts",
  "Lead capture",
  "Follow-up and booking",
] as const;

export type AuditStage = (typeof AUDIT_STAGES)[number];

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** "six", "five"... so copy never drifts from the real list. */
export const AUDIT_STAGE_COUNT_WORD = NUMBER_WORDS[AUDIT_STAGES.length] ?? String(AUDIT_STAGES.length);

/** "Six" for sentence starts. */
export const AUDIT_STAGE_COUNT_WORD_CAPITAL =
  AUDIT_STAGE_COUNT_WORD.charAt(0).toUpperCase() + AUDIT_STAGE_COUNT_WORD.slice(1);

/** "found on Google, what AI says about you, ..., and follow-up and booking" */
export function auditStagesSentence(): string {
  const names = AUDIT_STAGES.map((stage) => stage.charAt(0).toLowerCase() + stage.slice(1));
  // Keep proper nouns capitalised.
  const fixed = names.map((name) => name.replace(/\bgoogle\b/i, "Google").replace(/\bai\b/i, "AI"));
  return `${fixed.slice(0, -1).join(", ")}, and ${fixed[fixed.length - 1]}`;
}
