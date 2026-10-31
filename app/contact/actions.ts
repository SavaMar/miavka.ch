"use server";

import { createSupabaseAdmin } from "@/lib/supabase-admin";

export type ContactActionInput = {
  name: string;
  email: string;
  message: string;
  /** Honeypot. Real users never see or fill this. */
  website: string;
  /** Date.now() captured when the form mounted in the browser. */
  ts_loaded: number;
};

export type ContactActionResult = { ok: true } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_MS = 2000;

export async function submitContactInquiry(
  input: ContactActionInput
): Promise<ContactActionResult> {
  const name = (input?.name ?? "").trim();
  const email = (input?.email ?? "").trim().toLowerCase();
  const message = (input?.message ?? "").trim();
  const website = (input?.website ?? "").trim();
  const tsLoaded = Number(input?.ts_loaded);

  // Bot checks run before anything else, and always answer like a success so
  // the client can't tell detection from a real submission.
  if (website) {
    return { ok: true };
  }
  if (!Number.isFinite(tsLoaded) || Date.now() - tsLoaded < MIN_FILL_MS) {
    return { ok: true };
  }

  if (!name || !email || !message) {
    return { ok: false, error: "Name, email, and message are required." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Invalid email address." };
  }

  const tableName = process.env.SUPABASE_CONTACT_TABLE ?? "contact_submissions";

  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      error: "Supabase environment variables are not configured.",
    };
  }

  const { error } = await supabase.from(tableName).insert({
    name,
    email,
    message,
  });

  if (error) {
    return { ok: false, error: "Failed to submit contact request." };
  }

  return { ok: true };
}
