// Quiz definition shared by the client (UI) and the API route (validation).

export const LEAK_SUSPECT_OPTIONS = [
  // Labels match AUDIT_STAGES. "website-message" keeps its old stored value
  // so earlier submissions stay comparable; its label is "Website that converts".
  { value: "found-on-google", label: "Found on Google" },
  { value: "ai-recommendation", label: "What AI says about you" },
  { value: "social-media", label: "Social media" },
  { value: "website-message", label: "Website that converts" },
  { value: "lead-capture", label: "Lead capture" },
  { value: "follow-up-and-booking", label: "Follow-up and booking" },
  { value: "cant-tell", label: "I honestly can't tell" },
] as const;
export type LeakSuspect = (typeof LEAK_SUSPECT_OPTIONS)[number]["value"];
/** Exclusive option: it can't be combined with any other leak suspect. */
export const CANT_TELL: LeakSuspect = "cant-tell";

export const INTENT_OPTIONS = [
  { value: "fix-30-days", label: "Fix it in the next 30 days" },
  { value: "understand-first", label: "Understand it first, then decide" },
  { value: "just-curious", label: "Just curious" },
] as const;
export type Intent = (typeof INTENT_OPTIONS)[number]["value"];

export const QUIZ_STEPS = ["leakSuspects", "intent", "whatTheySell", "websiteUrl"] as const;
export type QuizStep = (typeof QUIZ_STEPS)[number];

export const QUIZ_TITLES: Record<QuizStep, string> = {
  leakSuspects: "Where do you think you're losing people?",
  intent: "What would you do if the audit shows a clear problem?",
  whatTheySell: "In one sentence: what do you sell, and to whom?",
  websiteUrl: "Your website address",
};

export const WHAT_THEY_SELL_MIN = 10;
export const WHAT_THEY_SELL_MAX = 140;
const URL_MAX = 300;

export type QuizAnswers = {
  leakSuspects: LeakSuspect[];
  intent: Intent;
  whatTheySell: string;
  websiteUrl: string;
  linkedinUrl?: string;
  instagramUrl?: string;
};

export function toggleLeakSuspect(
  current: readonly LeakSuspect[],
  value: LeakSuspect
): LeakSuspect[] {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (value === CANT_TELL) return [CANT_TELL];
  return [...current.filter((item) => item !== CANT_TELL), value];
}

/** Strips HTML tags, control and invisible characters and stray angle brackets, collapses whitespace, caps length. */
export function sanitizeText(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  return input
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

const HOST_LABEL_RE = /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i;
const TLD_RE = /^(?:[a-z]{2,63}|xn--[a-z\d-]{2,59})$/i;

/**
 * Accepts "example.ch", "www.example.com" or a full http(s) URL.
 * Returns the URL with https:// added when missing, or null if it isn't a usable web address.
 */
export function normalizeUrl(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  if (!raw || raw.length > URL_MAX || /\s/.test(raw)) return null;

  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(raw)
    ? raw
    : `https://${raw.replace(/^\/+/, "")}`;

  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.username || url.password) return null;

  const labels = url.hostname.split(".");
  if (labels.length < 2) return null;
  if (!labels.every((label) => HOST_LABEL_RE.test(label))) return null;
  if (!TLD_RE.test(labels[labels.length - 1])) return null;

  const isBareHost = url.pathname === "/" && !url.search && !url.hash;
  return isBareHost ? `${url.protocol}//${url.host}` : url.href;
}

export type ProfileNetwork = "linkedin" | "instagram";

const PROFILE_HOSTS: Record<ProfileNetwork, string> = {
  linkedin: "linkedin.com",
  instagram: "instagram.com",
};

/**
 * A link to a LinkedIn or Instagram page (not just the home page).
 * Instagram also accepts "@handle". Returns null if it isn't one.
 */
export function normalizeProfileUrl(input: unknown, network: ProfileNetwork): string | null {
  if (typeof input !== "string") return null;
  const raw = input.trim();
  const handle = network === "instagram" ? /^@([a-z\d._]{1,30})$/i.exec(raw) : null;
  const url = normalizeUrl(handle ? `www.instagram.com/${handle[1]}` : raw);
  if (!url) return null;
  const { hostname, pathname } = new URL(url);
  const host = PROFILE_HOSTS[network];
  const onNetwork = hostname === host || hostname.endsWith(`.${host}`);
  return onNetwork && pathname.length > 1 ? url : null;
}

/** "" when left empty, null when filled in but invalid. */
function parseOptionalProfile(input: unknown, network: ProfileNetwork): string | null {
  if (input === undefined || (typeof input === "string" && input.trim() === "")) return "";
  return normalizeProfileUrl(input, network);
}

/** Validates and cleans quiz answers. Returns null if anything required is missing or invalid. */
export function parseQuizAnswers(input: unknown): QuizAnswers | null {
  if (!input || typeof input !== "object") return null;
  const record = input as Record<string, unknown>;

  if (!Array.isArray(record.leakSuspects)) return null;
  const knownSuspects = LEAK_SUSPECT_OPTIONS.map((option) => option.value) as string[];
  const leakSuspects = [...new Set(record.leakSuspects)].filter(
    (value): value is LeakSuspect => typeof value === "string" && knownSuspects.includes(value)
  );
  if (leakSuspects.length === 0 || leakSuspects.length !== record.leakSuspects.length) return null;
  if (leakSuspects.includes(CANT_TELL) && leakSuspects.length > 1) return null;

  const intent = INTENT_OPTIONS.find((option) => option.value === record.intent)?.value;
  if (!intent) return null;

  const whatTheySell = sanitizeText(record.whatTheySell, WHAT_THEY_SELL_MAX);
  if (whatTheySell.length < WHAT_THEY_SELL_MIN) return null;

  const websiteUrl = normalizeUrl(record.websiteUrl);
  if (!websiteUrl) return null;

  const linkedinUrl = parseOptionalProfile(record.linkedinUrl, "linkedin");
  const instagramUrl = parseOptionalProfile(record.instagramUrl, "instagram");
  if (linkedinUrl === null || instagramUrl === null) return null;

  return {
    leakSuspects,
    intent,
    whatTheySell,
    websiteUrl,
    ...(linkedinUrl ? { linkedinUrl } : {}),
    ...(instagramUrl ? { instagramUrl } : {}),
  };
}

// The first version of the quiz. A visitor with the old page still open can
// submit these answers, so the API keeps accepting them.
const LEGACY_QUIZ_VALUES = {
  businessType: ["local-service", "b2b-services", "product-innovation", "other"],
  biggestLeak: ["find-me", "website", "lead-flow", "no-idea"],
  teamSize: ["solo", "2-10", "11-50", "50-plus"],
  readiness: ["yes", "maybe", "just-looking"],
} as const;

export type LegacyQuizAnswers = Record<keyof typeof LEGACY_QUIZ_VALUES, string>;

export function isLegacyQuizAnswers(input: unknown): input is LegacyQuizAnswers {
  if (!input || typeof input !== "object") return false;
  const record = input as Record<string, unknown>;
  return Object.entries(LEGACY_QUIZ_VALUES).every(([key, values]) =>
    (values as readonly unknown[]).includes(record[key])
  );
}
