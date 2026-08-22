"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function HomeNewsletterSignup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail) {
      setError("PLEASE FILL IN YOUR NAME AND EMAIL.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("PLEASE ENTER A VALID EMAIL ADDRESS.");
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
          offer: "article-bottom-notes",
        }),
      });
      if (!response.ok) {
        setError("COULD NOT SUBSCRIBE. TRY AGAIN.");
        return;
      }
      setIsSuccess(true);
      setFirstName("");
      setEmail("");
    } catch {
      setError("COULD NOT SUBSCRIBE. TRY AGAIN.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[#161515] px-4 py-10 md:px-8 md:py-14 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-6 border-t-4 border-[#D0320E] pt-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p
            className="text-[11px] uppercase text-[#F4F4F0]/75"
            style={{
              fontFamily:
                "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.08em",
            }}
          >
            [ NEWSLETTER ]
          </p>
          <h2
            className="mt-2 uppercase text-[#F4F4F0]"
            style={{
              fontFamily: "'TG Girthy', Impact, sans-serif",
              fontSize: "clamp(2rem, 4.6vw, 4.5rem)",
              lineHeight: 0.92,
            }}
          >
            Subscribe
            <br />
            to Notes
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#F4F4F0]/80">
            I share notes from real experience: what I learn, what I test, book
            notes, marketing insights, and materials that are truly useful. I
            try to{" "}
            <span className="text-[1.08em] font-extrabold text-[#F4F4F0]">
              educate myself
            </span>
            , find blind spots, and feed my curiosity.
          </p>
        </div>

        {isSuccess ? (
          <p
            className="text-[12px] uppercase text-[#D0320E]"
            style={{
              fontFamily:
                "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
              letterSpacing: "0.08em",
            }}
          >
            &gt;&gt;&gt; CHECK YOUR INBOX
          </p>
        ) : (
          <form onSubmit={onSubmit} className="w-full max-w-[560px]">
            <label className="sr-only" htmlFor="home-newsletter-name">
              Your name
            </label>
            <input
              id="home-newsletter-name"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="YOUR NAME"
              className="mb-2 h-11 w-full border border-[#F4F4F0]/45 bg-transparent px-3 text-[12px] uppercase text-[#F4F4F0] placeholder:text-[#F4F4F0]/45 focus:border-[#D0320E] focus:outline-none"
              style={{
                fontFamily:
                  "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                letterSpacing: "0.08em",
              }}
              required
            />
            <label className="sr-only" htmlFor="home-newsletter-email">
              Your email
            </label>
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <input
                id="home-newsletter-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="YOUR EMAIL"
                className="h-11 flex-1 border border-[#F4F4F0]/45 bg-transparent px-3 text-[12px] uppercase text-[#F4F4F0] placeholder:text-[#F4F4F0]/45 focus:border-[#D0320E] focus:outline-none"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.08em",
                }}
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 border border-[#F4F4F0] bg-[#161515] px-5 text-[12px] uppercase text-[#F4F4F0] transition-colors hover:cursor-pointer hover:bg-[#D0320E] hover:text-[#161515] disabled:opacity-60"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.08em",
                }}
              >
                {isSubmitting ? "SENDING..." : "SEND"}
              </button>
            </div>
            {error ? (
              <p
                className="mt-2 text-[11px] uppercase text-[#D0320E]"
                style={{
                  fontFamily:
                    "'JetBrains Mono', 'SFMono-Regular', Menlo, Monaco, Consolas, monospace",
                  letterSpacing: "0.08em",
                }}
              >
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
