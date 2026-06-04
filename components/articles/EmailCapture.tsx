"use client";

import type { ReactNode } from "react";
import { isValidElement, useMemo, useState } from "react";

type EmailCaptureProps = {
  offer: string;
  title: string;
  description?: ReactNode;
  buttonLabel?: string;
  children?: ReactNode;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function toPlainText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props.children != null) return toPlainText(props.children);
  }
  return "";
}

export default function EmailCapture({
  offer,
  title,
  description,
  buttonLabel = "GET THE CHECKLIST",
  children,
}: EmailCaptureProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const descriptionText = useMemo(() => {
    const fromProp = toPlainText(description).trim();
    const fromChildren = toPlainText(children).trim();
    return fromProp.length > 0 ? fromProp : fromChildren;
  }, [description, children]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedFirstName || !trimmedEmail) {
      setError("Please fill in first name and email.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/loops/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          firstName: trimmedFirstName,
          offer,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(payload?.error || "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      data-offer={offer}
      className="my-8 rounded-2xl border border-ui-gray-300 bg-brand-cream p-6 shadow-[0_18px_40px_rgba(17,17,17,0.06)] md:p-6"
    >
      <h3
        className="whitespace-pre-line text-[2.05rem] uppercase leading-[0.95] text-brand-black"
        style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
      >
        {title}
      </h3>

      <div
        className="mt-3 text-sm leading-relaxed text-brand-black md:text-base"
        style={{
          fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 400,
        }}
      >
        {descriptionText
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line, idx) => (
            <span key={`${offer}-line-${idx}`} className="block">
              {line}
            </span>
          ))}
      </div>

      {isSuccess ? (
        <p
          className="mt-5 text-sm leading-relaxed text-brand-black md:text-base"
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
            fontWeight: 400,
          }}
        >
          Check your inbox. The checklist is on its way.
        </p>
      ) : (
        <form className="mt-5" onSubmit={onSubmit} noValidate>
          {error ? (
            <p
              className="mb-3 text-xs leading-relaxed text-brand-red"
              style={{
                fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor={`${offer}-first-name`}>
              Your name
            </label>
            <input
              id={`${offer}-first-name`}
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Your name"
              className="h-11 w-full rounded-full border border-ui-gray-300 bg-brand-cream px-4 text-sm text-brand-black placeholder:text-ui-gray-500 focus:border-brand-red focus:outline-none"
            />

            <label className="sr-only" htmlFor={`${offer}-email`}>
              Your email
            </label>
            <input
              id={`${offer}-email`}
              type="email"
              placeholder="Your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 w-full rounded-full border border-ui-gray-300 bg-brand-cream px-4 text-sm text-brand-black placeholder:text-ui-gray-500 focus:border-brand-red focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 h-11 w-full rounded-full bg-brand-red px-4 text-sm font-bold text-brand-cream transition-colors hover:cursor-pointer hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            {isSubmitting ? "SENDING..." : buttonLabel}
          </button>
        </form>
      )}
    </section>
  );
}
