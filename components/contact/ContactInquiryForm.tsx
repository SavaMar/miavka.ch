"use client";

import { useRef, useState } from "react";

import { submitContactInquiry } from "@/app/contact/actions";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-ui-gray-300/55 bg-white px-4 text-sm text-brand-black placeholder:text-ui-gray-500 focus:border-brand-black/35 focus:outline-none";

export default function ContactInquiryForm({ className = "" }: { className?: string }) {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    message: "",
  });
  const honeypotRef = useRef<HTMLInputElement>(null);
  // Fixed at mount so it measures how long the visitor spent on the form.
  const [tsLoaded] = useState(() => Date.now());
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function updateField<K extends keyof ContactPayload>(
    key: K,
    value: ContactPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await submitContactInquiry({
        name,
        email,
        message,
        website: honeypotRef.current?.value ?? "",
        ts_loaded: tsLoaded,
      });

      if (!result.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <p
        className="rounded-[10px] bg-white p-5 text-sm leading-relaxed text-brand-black"
        style={{ fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif" }}
      >
        Thank you. I got your message and will reply soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`flex h-full flex-col justify-between ${className}`}
    >
      {/* Bot trap: off-screen rather than display/visibility hidden, so
          form-filling bots still see it as a real, focusable field. */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
      >
        <label className="sr-only" htmlFor="contact-website">
          Website (leave this field empty)
        </label>
        <input
          id="contact-website"
          ref={honeypotRef}
          type="text"
          name="website"
          defaultValue=""
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input
          type="hidden"
          name="ts_loaded"
          value={tsLoaded}
          readOnly
          suppressHydrationWarning
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="sr-only" htmlFor="contact-name">
              Your name
            </label>
            <input
              id="contact-name"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your name"
              className={INPUT_CLASS}
              required
            />
          </div>
          <div>
            <label className="sr-only" htmlFor="contact-email">
              Your email
            </label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Your email"
              className={INPUT_CLASS}
              required
            />
          </div>
        </div>

        <div className="mt-3 flex-1">
          <label className="sr-only" htmlFor="contact-message">
            Your message
          </label>
          <textarea
            id="contact-message"
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            placeholder="Tell me your question, collaboration idea, or what support you need."
            className="h-full min-h-24 w-full rounded-xl border border-ui-gray-300/55 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-ui-gray-500 focus:border-brand-black/35 focus:outline-none"
            required
          />
        </div>

        {error ? (
          <p
            className="mt-3 text-xs leading-relaxed text-brand-red"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 500,
            }}
          >
            {error}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-brand-black px-6 text-sm font-semibold text-white transition-colors hover:cursor-pointer hover:bg-brand-black/88 disabled:cursor-not-allowed disabled:opacity-70"
        style={{ fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif" }}
      >
        {isSubmitting ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
