import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  isLegacyQuizAnswers,
  parseQuizAnswers,
  type LegacyQuizAnswers,
  type QuizAnswers,
} from "@/lib/audit-quiz";

type AuditPayload = {
  firstName?: string;
  email?: string;
  answers?: unknown;
  /** True if the visitor ticked "I prefer a video call". */
  wantsCall?: unknown;
  /** True if the visitor ticked the Notes newsletter checkbox. */
  subscribeNewsletter?: unknown;
  /** Honeypot. Real users never see or fill this. */
  website?: string;
  /** Date.now() captured when the quiz mounted in the browser. */
  ts_loaded?: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 4000;
const AUDIT_TAG = "digital-leak-audit";
const AUDIT_TABLE = "audit_requests";
const QUIZ_VERSION = 2;
/** Same signup source pattern as the other Notes forms (see /api/loops/subscribe). */
const NEWSLETTER_OFFER = "audit-quiz-notes";

type AuditRequestRow = {
  first_name: string;
  email: string;
  wants_call: boolean;
  subscribed_newsletter: boolean;
  quiz_version: number;
  leak_suspects?: string[];
  intent?: string;
  what_they_sell?: string;
  website_url?: string;
  linkedin_url?: string | null;
  instagram_url?: string | null;
  legacy_answers?: LegacyQuizAnswers;
};

// Loops event properties must be strings, numbers, booleans or dates, so the
// list of leak suspects travels as one comma-separated string.
function toEventProperties(answers: QuizAnswers): Record<string, string | number> {
  return {
    quizVersion: QUIZ_VERSION,
    leakSuspects: answers.leakSuspects.join(", "),
    intent: answers.intent,
    whatTheySell: answers.whatTheySell,
    websiteUrl: answers.websiteUrl,
    ...(answers.linkedinUrl ? { linkedinUrl: answers.linkedinUrl } : {}),
    ...(answers.instagramUrl ? { instagramUrl: answers.instagramUrl } : {}),
  };
}

function toLegacyAnswers(answers: LegacyQuizAnswers): LegacyQuizAnswers {
  const { businessType, biggestLeak, teamSize, readiness } = answers;
  return { businessType, biggestLeak, teamSize, readiness };
}

async function postLoopsEvent(body: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.LOOP_API_KEY;
  if (!apiKey) {
    console.error("[audit] LOOP_API_KEY is not configured.");
    return false;
  }
  try {
    const loopsRes = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!loopsRes.ok) {
      console.error(`[audit] Loops responded ${loopsRes.status} to "${body.eventName}".`);
    }
    return loopsRes.ok;
  } catch (error) {
    console.error(`[audit] Could not reach Loops for "${body.eventName}".`, error);
    return false;
  }
}

function sendAuditEvent(
  email: string,
  firstName: string,
  eventProperties: Record<string, string | number | boolean>
): Promise<boolean> {
  // userGroup + source tag these contacts so they can be told apart from
  // newsletter-only signups. Quiz answers travel as event properties.
  return postLoopsEvent({
    email,
    eventName: "digitalLeakAudit",
    firstName,
    source: AUDIT_TAG,
    userGroup: AUDIT_TAG,
    eventProperties,
  });
}

// Mirrors /api/loops/subscribe: the signup-source event, then
// "newsletterSignup", which starts the Notes welcome sequence.
async function subscribeToNewsletter(email: string, firstName: string): Promise<boolean> {
  const signedUp = await postLoopsEvent({
    email,
    eventName: NEWSLETTER_OFFER,
    firstName,
    source: "miavka.ch",
  });
  return signedUp && (await postLoopsEvent({ email, eventName: "newsletterSignup" }));
}

export async function POST(request: Request) {
  let payload: AuditPayload;

  try {
    payload = (await request.json()) as AuditPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  // Bot checks answer like a success so a bot can't tell it was caught.
  if ((payload.website ?? "").trim()) {
    return NextResponse.json({ ok: true, pdfUrl: null });
  }
  const tsLoaded = Number(payload.ts_loaded);
  if (!Number.isFinite(tsLoaded) || Date.now() - tsLoaded < MIN_FILL_MS) {
    return NextResponse.json({ ok: true, pdfUrl: null });
  }

  const firstName = (payload.firstName ?? "").trim().slice(0, 120);
  const email = (payload.email ?? "").trim().toLowerCase().slice(0, 254);
  const wantsCall = payload.wantsCall === true;
  const subscribeNewsletter = payload.subscribeNewsletter === true;

  if (!firstName || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const contact = {
    first_name: firstName,
    email,
    wants_call: wantsCall,
    subscribed_newsletter: subscribeNewsletter,
  };
  const answers = parseQuizAnswers(payload.answers);
  let row: AuditRequestRow;
  let answerProperties: Record<string, string | number>;
  if (answers) {
    row = {
      ...contact,
      quiz_version: QUIZ_VERSION,
      leak_suspects: answers.leakSuspects,
      intent: answers.intent,
      what_they_sell: answers.whatTheySell,
      website_url: answers.websiteUrl,
      linkedin_url: answers.linkedinUrl ?? null,
      instagram_url: answers.instagramUrl ?? null,
    };
    answerProperties = toEventProperties(answers);
  } else if (isLegacyQuizAnswers(payload.answers)) {
    const legacyAnswers = toLegacyAnswers(payload.answers);
    row = { ...contact, quiz_version: 1, legacy_answers: legacyAnswers };
    answerProperties = legacyAnswers;
  } else {
    return NextResponse.json(
      { error: "Some quiz answers are missing or invalid. Please go back and check them." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.error("[audit] Supabase environment variables are not configured.");
    return NextResponse.json(
      { error: "Could not save your details. Please try again later." },
      { status: 500 }
    );
  }

  // Supabase is the record of every request, so it is written first. If the
  // email step fails afterwards, the row stays with loops_synced = false.
  const { data: saved, error: insertError } = await supabase
    .from(AUDIT_TABLE)
    .insert(row)
    .select("id")
    .single();
  if (insertError || !saved) {
    console.error("[audit] Supabase insert failed.", insertError?.message);
    return NextResponse.json(
      { error: "Could not save your details. Please try again." },
      { status: 500 }
    );
  }

  const loopsSynced = await sendAuditEvent(email, firstName, {
    ...answerProperties,
    wantsCall,
    subscribeNewsletter,
  });
  // A failed newsletter signup is logged but never blocks the audit.
  if (subscribeNewsletter) await subscribeToNewsletter(email, firstName);
  if (loopsSynced) {
    const { error: updateError } = await supabase
      .from(AUDIT_TABLE)
      .update({ loops_synced: true })
      .eq("id", saved.id);
    if (updateError) {
      console.error("[audit] Could not mark the request as synced.", updateError.message);
    }
  }

  // Server-only variable: the link is never shipped in the page's JavaScript,
  // so the quiz can't be skipped by reading the bundle.
  const pdfUrl = process.env.AUDIT_PDF_URL?.trim() || null;
  return NextResponse.json({ ok: true, pdfUrl });
}
