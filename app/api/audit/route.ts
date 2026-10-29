import { NextResponse } from "next/server";
import { isValidQuizAnswers, type QuizAnswers } from "@/lib/audit-quiz";

type AuditPayload = {
  firstName?: string;
  email?: string;
  answers?: unknown;
  /** Honeypot. Real users never see or fill this. */
  website?: string;
  /** Date.now() captured when the quiz mounted in the browser. */
  ts_loaded?: number;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 4000;
const AUDIT_TAG = "digital-leak-audit";

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

  if (!firstName || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }
  if (!isValidQuizAnswers(payload.answers)) {
    return NextResponse.json({ error: "Quiz answers are incomplete." }, { status: 400 });
  }
  const answers: QuizAnswers = payload.answers;

  const apiKey = process.env.LOOP_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Loops API key is not configured." },
      { status: 500 }
    );
  }

  try {
    // userGroup + source tag these contacts so they can be told apart from
    // newsletter-only signups. Quiz answers travel as event properties.
    const loopsRes = await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        eventName: "digitalLeakAudit",
        firstName,
        source: AUDIT_TAG,
        userGroup: AUDIT_TAG,
        eventProperties: answers,
      }),
    });

    if (!loopsRes.ok) {
      return NextResponse.json(
        { error: "Could not save your details. Please try again." },
        { status: 500 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Could not reach the email service. Please try again." },
      { status: 500 }
    );
  }

  // Server-only variable: the link is never shipped in the page's JavaScript,
  // so the quiz can't be skipped by reading the bundle.
  const pdfUrl = process.env.AUDIT_PDF_URL?.trim() || null;
  return NextResponse.json({ ok: true, pdfUrl });
}
