"use client";

import { useState } from "react";

type NotesSubscribeFormProps = {
  offer: string;
  layout?: "stacked" | "inline";
  buttonLabel?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
  className?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NotesSubscribeForm({
  offer,
  layout = "stacked",
  buttonLabel = "Subscribe",
  namePlaceholder = "Your name",
  emailPlaceholder = "Your email",
  inputClassName = "",
  buttonClassName = "",
  className = "",
}: NotesSubscribeFormProps) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setError("Please fill in your name and email.");
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
          firstName: trimmedName,
          email: trimmedEmail,
          offer,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(payload?.error ?? "Something went wrong. Please try again.");
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <p
        className="text-sm leading-relaxed text-ui-gray-700"
        style={{
          fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 300,
        }}
      >
        You&apos;re in. Check your inbox.
      </p>
    );
  }

  const wrapperClass =
    layout === "inline"
      ? "grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center"
      : "space-y-3";
  const stackedButtonWidthClass = layout === "stacked" ? "w-full" : "";

  return (
    <form className={`${className}`} onSubmit={onSubmit} noValidate>
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

      <div className={wrapperClass}>
        <label className="sr-only" htmlFor={`${offer}-name`}>
          Your name
        </label>
        <input
          id={`${offer}-name`}
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={namePlaceholder}
          required
          className={`h-11 w-full rounded-full border border-ui-gray-300 bg-brand-cream px-4 text-sm text-brand-black placeholder:text-ui-gray-500 focus:border-brand-red focus:outline-none ${inputClassName}`}
        />
        <label className="sr-only" htmlFor={`${offer}-email`}>
          Your email
        </label>
        <input
          id={`${offer}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          required
          className={`h-11 w-full rounded-full border border-ui-gray-300 bg-brand-cream px-4 text-sm text-brand-black placeholder:text-ui-gray-500 focus:border-brand-red focus:outline-none ${inputClassName}`}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`h-11 rounded-full bg-brand-red px-7 text-sm font-bold text-brand-cream transition-colors hover:cursor-pointer hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-70 ${stackedButtonWidthClass} ${buttonClassName}`}
        >
          {isSubmitting ? "Subscribing..." : buttonLabel}
        </button>
      </div>
    </form>
  );
}
