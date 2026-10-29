"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  QUIZ_QUESTIONS,
  type QuizAnswers,
} from "@/lib/audit-quiz";
import { SPRING_SMOOTH } from "@/components/motion/springs";
import {
  DISPLAY_STYLE,
  MONO_STYLE,
  PRIMARY_BUTTON_CLASS,
  Section,
} from "@/components/audit/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_QUESTIONS = QUIZ_QUESTIONS.length;
const INPUT_CLASS =
  "h-11 w-full border border-[#161515]/45 bg-transparent px-3 text-[12px] uppercase text-[#161515] placeholder:text-[#161515]/55 focus:border-[#D0320E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]";

type Phase = "questions" | "contact" | "done";

export default function AuditQuiz() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("questions");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const hasInteracted = useRef(false);
  // Fixed at mount so the API can tell a human fill-time from a bot.
  const [tsLoaded] = useState(() => Date.now());

  // Moving focus to the new screen's heading lets keyboard and screen reader
  // users follow the quiz. Skipped until the first interaction so the page
  // doesn't jump on load.
  // Callback ref: focus lands on each new screen's heading as it mounts.
  const headingRef = useCallback((node: HTMLElement | null) => {
    if (node && hasInteracted.current) node.focus({ preventScroll: true });
  }, []);

  const question = QUIZ_QUESTIONS[step];

  function choose(value: string) {
    hasInteracted.current = true;
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (step < TOTAL_QUESTIONS - 1) {
      setStep(step + 1);
    } else {
      setPhase("contact");
    }
  }

  function goBack() {
    hasInteracted.current = true;
    setError("");
    if (phase === "contact") {
      setPhase("questions");
      setStep(TOTAL_QUESTIONS - 1);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: trimmedName,
          email: trimmedEmail,
          answers,
          website: honeypotRef.current?.value ?? "",
          ts_loaded: tsLoaded,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        pdfUrl?: string | null;
      } | null;
      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      hasInteracted.current = true;
      setPdfUrl(data?.pdfUrl ?? null);
      setPhase("done");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progress =
    phase === "questions" ? step : phase === "contact" ? TOTAL_QUESTIONS : TOTAL_QUESTIONS;

  const screenMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: SPRING_SMOOTH,
      };

  return (
    <Section
      id="quiz"
      tone="light"
      label="FREE AUDIT"
      title="Four questions. Then your audit unlocks."
    >
      <div className="max-w-3xl border border-[#161515] bg-[#F4F4F0] p-5 md:p-8">
        {phase !== "done" ? (
          <div className="mb-6">
            <p
              className="text-[11px] uppercase text-[#161515]/75"
              style={MONO_STYLE}
              aria-live="polite"
            >
              {phase === "questions"
                ? `Question ${step + 1} of ${TOTAL_QUESTIONS}`
                : "Last step"}
            </p>
            <div className="mt-2 h-1 w-full bg-[#161515]/12" aria-hidden>
              <motion.div
                className="h-full origin-left bg-[#D0320E]"
                animate={{ width: `${((progress + (phase === "contact" ? 0 : 1)) / (TOTAL_QUESTIONS + 1)) * 100}%` }}
                transition={reduce ? { duration: 0 } : SPRING_SMOOTH}
              />
            </div>
          </div>
        ) : null}

        <AnimatePresence mode="wait" initial={false}>
          {phase === "questions" ? (
            <motion.fieldset
              key={`q-${step}`}
              {...screenMotion}
              className="min-w-0 border-0"
            >
              <legend
                ref={headingRef}
                tabIndex={-1}
                className="mb-4 uppercase focus:outline-none"
                style={{ ...DISPLAY_STYLE, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 0.98 }}
              >
                {question.title}
              </legend>
              <div className="grid gap-2.5">
                {question.options.map((option) => {
                  const checked = answers[question.id] === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`group flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-base transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#D0320E] ${
                        checked
                          ? "border-[#D0320E] bg-[#D0320E]/8"
                          : "border-[#161515]/35 hover:border-[#D0320E]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={checked}
                        onChange={() => choose(option.value)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`h-3 w-3 shrink-0 border ${
                          checked ? "border-[#D0320E] bg-[#D0320E]" : "border-[#161515]/55"
                        }`}
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="mt-4 min-h-11 text-[11px] uppercase underline underline-offset-2 hover:text-[#D0320E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]"
                  style={MONO_STYLE}
                >
                  ← Back
                </button>
              ) : null}
            </motion.fieldset>
          ) : null}

          {phase === "contact" ? (
            <motion.form
              key="contact"
              {...screenMotion}
              onSubmit={onSubmit}
              noValidate
              aria-labelledby="quiz-contact-title"
            >
              <h3
                id="quiz-contact-title"
                ref={headingRef}
                tabIndex={-1}
                className="uppercase focus:outline-none"
                style={{ ...DISPLAY_STYLE, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 0.98 }}
              >
                Where should I send your audit?
              </h3>

              {/* Bot trap: off-screen so form-filling bots still see a field. */}
              <div
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", top: "-9999px" }}
              >
                <label htmlFor="audit-website">Website (leave this field empty)</label>
                <input
                  id="audit-website"
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  defaultValue=""
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="mt-5 grid gap-3">
                <div>
                  <label className="sr-only" htmlFor="audit-name">
                    Your name
                  </label>
                  <input
                    id="audit-name"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="YOUR NAME"
                    className={INPUT_CLASS}
                    style={MONO_STYLE}
                    required
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="audit-email">
                    Your email
                  </label>
                  <input
                    id="audit-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="YOUR EMAIL"
                    className={INPUT_CLASS}
                    style={MONO_STYLE}
                    required
                  />
                  <p className="mt-2 text-xs leading-relaxed text-[#161515]/75">
                    By submitting this form, I&apos;ll save your name, email and
                    answers to send you the audit and follow up about it. You can
                    opt out at any time. Here&apos;s the{" "}
                    <Link
                      href="/privacy-policy"
                      className="underline underline-offset-2 hover:text-[#D0320E]"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <p role="alert" className="mt-3 min-h-4 text-xs text-[#D0320E]">
                {error}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${PRIMARY_BUTTON_CLASS} disabled:opacity-60`}
                  style={MONO_STYLE}
                >
                  {isSubmitting ? "SENDING..." : "[ UNLOCK MY AUDIT → ]"}
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  className="min-h-11 text-[11px] uppercase underline underline-offset-2 hover:text-[#D0320E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]"
                  style={MONO_STYLE}
                >
                  ← Back
                </button>
              </div>
            </motion.form>
          ) : null}

          {phase === "done" ? (
            <motion.div key="done" {...screenMotion} aria-live="polite">
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="uppercase focus:outline-none"
                style={{ ...DISPLAY_STYLE, fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)", lineHeight: 0.98 }}
              >
                You&apos;re in, {firstName.trim() || "friend"}.
              </h3>
              {pdfUrl ? (
                <>
                  <p className="mt-3 text-lg leading-relaxed text-[#161515]/85">
                    Your Digital Leak Audit is ready. The last page tells you how
                    to reach me if you want to act on it.
                  </p>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${PRIMARY_BUTTON_CLASS} mt-5`}
                    style={MONO_STYLE}
                  >
                    [ DOWNLOAD THE PDF ↓ ]
                  </a>
                </>
              ) : (
                <p className="mt-3 text-lg leading-relaxed text-[#161515]/85">
                  Thanks. Your audit is on its way to your inbox.
                </p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </Section>
  );
}
