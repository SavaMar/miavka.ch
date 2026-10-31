"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  INTENT_OPTIONS,
  LEAK_SUSPECT_OPTIONS,
  QUIZ_STEPS,
  QUIZ_TITLES,
  WHAT_THEY_SELL_MAX,
  WHAT_THEY_SELL_MIN,
  normalizeProfileUrl,
  normalizeUrl,
  sanitizeText,
  toggleLeakSuspect,
  type Intent,
  type LeakSuspect,
  type QuizAnswers,
  type QuizStep,
} from "@/lib/audit-quiz";
import { SPRING_SMOOTH } from "@/components/motion/springs";
import {
  DISPLAY_STYLE,
  MONO_STYLE,
  PRIMARY_BUTTON_CLASS,
  Section,
} from "@/components/audit/ui";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_QUESTIONS = QUIZ_STEPS.length;
const INPUT_CLASS =
  "h-11 w-full border border-[#161515]/45 bg-transparent px-3 text-[12px] uppercase text-[#161515] placeholder:text-[#161515]/55 focus:border-[#D0320E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]";
// Normal case and 16px text: visitors type sentences and URLs here, and
// anything smaller makes iOS zoom the page on focus.
const FIELD_CLASS =
  "w-full border border-[#161515]/45 bg-transparent px-3 py-2.5 text-base text-[#161515] placeholder:text-[#161515]/45 focus:border-[#D0320E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E] aria-[invalid=true]:border-[#D0320E]";
const OPTION_ROW_CLASS =
  "group flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-base transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#D0320E]";
const QUESTION_HEADING_CLASS = "mb-4 block uppercase focus:outline-none";
const QUESTION_HEADING_STYLE = {
  ...DISPLAY_STYLE,
  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
  lineHeight: 0.98,
} as const;
const LINK_BUTTON_CLASS =
  "min-h-11 text-[11px] uppercase underline underline-offset-2 hover:text-[#D0320E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D0320E]";

type Phase = "questions" | "contact" | "done";

type Draft = {
  leakSuspects: LeakSuspect[];
  intent: Intent | "";
  whatTheySell: string;
  websiteUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
};
type FieldErrors = Partial<Record<keyof Draft, string>>;
type LinkField = "websiteUrl" | "linkedinUrl" | "instagramUrl";

const EMPTY_DRAFT: Draft = {
  leakSuspects: [],
  intent: "",
  whatTheySell: "",
  websiteUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
};

// First focusable control of each field, used to move focus to an error.
const FIELD_FOCUS_ID: Record<keyof Draft, string> = {
  leakSuspects: `quiz-leak-${LEAK_SUSPECT_OPTIONS[0].value}`,
  intent: `quiz-intent-${INTENT_OPTIONS[0].value}`,
  whatTheySell: "quiz-what-they-sell",
  websiteUrl: "quiz-website-url",
  linkedinUrl: "quiz-linkedin-url",
  instagramUrl: "quiz-instagram-url",
};

function sentenceLength(value: string) {
  return sanitizeText(value, Number.POSITIVE_INFINITY).length;
}

function validateStep(stepId: QuizStep, draft: Draft): FieldErrors {
  switch (stepId) {
    case "leakSuspects":
      return draft.leakSuspects.length > 0
        ? {}
        : { leakSuspects: "Pick at least one, or choose \u201cI honestly can\u2019t tell\u201d." };
    case "intent":
      return draft.intent ? {} : { intent: "Pick the answer closest to you." };
    case "whatTheySell": {
      const length = sentenceLength(draft.whatTheySell);
      if (length === 0) return { whatTheySell: "Tell me what you sell, and to whom." };
      if (length < WHAT_THEY_SELL_MIN)
        return { whatTheySell: `A bit more, please: at least ${WHAT_THEY_SELL_MIN} characters.` };
      if (length > WHAT_THEY_SELL_MAX)
        return { whatTheySell: `Keep it to ${WHAT_THEY_SELL_MAX} characters. You\u2019re at ${length}.` };
      return {};
    }
    case "websiteUrl": {
      const errors: FieldErrors = {};
      if (!draft.websiteUrl.trim()) {
        errors.websiteUrl = "Enter your website address, like example.ch.";
      } else if (!normalizeUrl(draft.websiteUrl)) {
        errors.websiteUrl = "That doesn\u2019t look like a website address. Try something like example.ch.";
      }
      if (draft.linkedinUrl.trim() && !normalizeProfileUrl(draft.linkedinUrl, "linkedin")) {
        errors.linkedinUrl =
          "That doesn\u2019t look like a LinkedIn link. Try linkedin.com/in/yourname, or leave it empty.";
      }
      if (draft.instagramUrl.trim() && !normalizeProfileUrl(draft.instagramUrl, "instagram")) {
        errors.instagramUrl =
          "That doesn\u2019t look like an Instagram link. Try instagram.com/yourname or @yourname, or leave it empty.";
      }
      return errors;
    }
  }
}

function hasErrors(errors: FieldErrors) {
  return Object.values(errors).some(Boolean);
}

function CheckboxIndicator({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors ${
        checked
          ? "border-[#D0320E] bg-[#D0320E]"
          : "border-[#161515]/55 group-hover:border-[#D0320E]"
      }`}
    >
      <svg
        viewBox="0 0 12 12"
        className={`h-3 w-3 text-[#F4F4F0] transition-transform duration-150 motion-reduce:transition-none ${
          checked ? "scale-100" : "scale-0"
        }`}
      >
        <path d="M2 6.5 5 9.5 10 3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role="alert" className="mt-2 min-h-4 text-xs leading-relaxed text-[#D0320E]">
      {message ?? ""}
    </p>
  );
}

export default function AuditQuiz() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("questions");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [wantsCall, setWantsCall] = useState(false);
  const [wantsNewsletter, setWantsNewsletter] = useState(false);
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

  const stepId = QUIZ_STEPS[step];
  const isStepValid = !hasErrors(validateStep(stepId, draft));
  const sellLength = sentenceLength(draft.whatTheySell);
  const sellTooLong = sellLength > WHAT_THEY_SELL_MAX;
  // Going over the limit is shown while typing; other errors wait for Next.
  const sellError =
    fieldErrors.whatTheySell ??
    (sellTooLong ? validateStep("whatTheySell", draft).whatTheySell : undefined);

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function checkUrlOnBlur(key: LinkField) {
    if (!draft[key].trim()) return;
    const message = validateStep("websiteUrl", draft)[key];
    if (message) setFieldErrors((prev) => ({ ...prev, [key]: message }));
  }

  function goNext(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    hasInteracted.current = true;
    const errors = validateStep(stepId, draft);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      const firstInvalid = (Object.keys(errors) as (keyof Draft)[]).find((key) => errors[key]);
      if (firstInvalid) document.getElementById(FIELD_FOCUS_ID[firstInvalid])?.focus();
      return;
    }
    setFieldErrors({});
    if (step < TOTAL_QUESTIONS - 1) {
      setStep(step + 1);
    } else {
      setPhase("contact");
    }
  }

  // Enter submits the current step. Text inputs do this natively; checkboxes,
  // radios and the textarea need a nudge (Shift+Enter still adds a line).
  function onStepKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    const target = event.target;
    const isChoice =
      target instanceof HTMLInputElement && (target.type === "checkbox" || target.type === "radio");
    if (isChoice || target instanceof HTMLTextAreaElement) {
      event.preventDefault();
      event.currentTarget.requestSubmit();
    }
  }

  function buildAnswers(): QuizAnswers {
    const linkedinUrl = normalizeProfileUrl(draft.linkedinUrl, "linkedin");
    const instagramUrl = normalizeProfileUrl(draft.instagramUrl, "instagram");
    return {
      leakSuspects: draft.leakSuspects,
      intent: draft.intent as Intent,
      whatTheySell: sanitizeText(draft.whatTheySell, WHAT_THEY_SELL_MAX),
      websiteUrl: normalizeUrl(draft.websiteUrl) ?? draft.websiteUrl.trim(),
      ...(linkedinUrl ? { linkedinUrl } : {}),
      ...(instagramUrl ? { instagramUrl } : {}),
    };
  }

  function goBack() {
    hasInteracted.current = true;
    setError("");
    setFieldErrors({});
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
          answers: buildAnswers(),
          wantsCall,
          subscribeNewsletter: wantsNewsletter,
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
      animateTitle={false}
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
            <motion.form
              key={`q-${step}`}
              {...screenMotion}
              onSubmit={goNext}
              onKeyDown={onStepKeyDown}
              noValidate
              className="min-w-0"
            >
              {stepId === "leakSuspects" ? (
                <fieldset
                  className="min-w-0 border-0"
                  aria-describedby="quiz-leak-hint quiz-leak-error"
                >
                  <legend
                    ref={headingRef}
                    tabIndex={-1}
                    className={QUESTION_HEADING_CLASS}
                    style={QUESTION_HEADING_STYLE}
                  >
                    {QUIZ_TITLES.leakSuspects}
                  </legend>
                  <p
                    id="quiz-leak-hint"
                    className="-mt-1 mb-4 text-[11px] uppercase text-[#161515]/70"
                    style={MONO_STYLE}
                  >
                    Pick all that apply
                  </p>
                  <div className="grid gap-2.5">
                    {LEAK_SUSPECT_OPTIONS.map((option) => {
                      const checked = draft.leakSuspects.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={`${OPTION_ROW_CLASS} ${
                            checked
                              ? "border-[#D0320E] bg-[#D0320E]/8"
                              : "border-[#161515]/35 hover:border-[#D0320E]"
                          }`}
                        >
                          <input
                            id={`quiz-leak-${option.value}`}
                            type="checkbox"
                            name="leakSuspects"
                            value={option.value}
                            checked={checked}
                            onChange={() =>
                              updateDraft(
                                "leakSuspects",
                                toggleLeakSuspect(draft.leakSuspects, option.value)
                              )
                            }
                            className="sr-only"
                          />
                          <CheckboxIndicator checked={checked} />
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="quiz-leak-error" message={fieldErrors.leakSuspects} />
                </fieldset>
              ) : null}

              {stepId === "intent" ? (
                <fieldset className="min-w-0 border-0" aria-describedby="quiz-intent-error">
                  <legend
                    ref={headingRef}
                    tabIndex={-1}
                    className={QUESTION_HEADING_CLASS}
                    style={QUESTION_HEADING_STYLE}
                  >
                    {QUIZ_TITLES.intent}
                  </legend>
                  <div className="grid gap-2.5">
                    {INTENT_OPTIONS.map((option) => {
                      const checked = draft.intent === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`${OPTION_ROW_CLASS} ${
                            checked
                              ? "border-[#D0320E] bg-[#D0320E]/8"
                              : "border-[#161515]/35 hover:border-[#D0320E]"
                          }`}
                        >
                          <input
                            id={`quiz-intent-${option.value}`}
                            type="radio"
                            name="intent"
                            value={option.value}
                            checked={checked}
                            onChange={() => updateDraft("intent", option.value)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              checked
                                ? "border-[#D0320E]"
                                : "border-[#161515]/55 group-hover:border-[#D0320E]"
                            }`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full bg-[#D0320E] transition-transform duration-150 motion-reduce:transition-none ${
                                checked ? "scale-100" : "scale-0"
                              }`}
                            />
                          </span>
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="quiz-intent-error" message={fieldErrors.intent} />
                </fieldset>
              ) : null}

              {stepId === "whatTheySell" ? (
                <div>
                  <label
                    ref={headingRef}
                    tabIndex={-1}
                    htmlFor="quiz-what-they-sell"
                    className={QUESTION_HEADING_CLASS}
                    style={QUESTION_HEADING_STYLE}
                  >
                    {QUIZ_TITLES.whatTheySell}
                  </label>
                  <textarea
                    id="quiz-what-they-sell"
                    name="whatTheySell"
                    rows={3}
                    value={draft.whatTheySell}
                    onChange={(event) => updateDraft("whatTheySell", event.target.value)}
                    placeholder="Coaching for first-time managers at Swiss tech startups."
                    aria-invalid={Boolean(sellError)}
                    aria-describedby="quiz-what-they-sell-count quiz-what-they-sell-error"
                    className={`${FIELD_CLASS} resize-none leading-relaxed`}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <FieldError id="quiz-what-they-sell-error" message={sellError} />
                    <p
                      id="quiz-what-they-sell-count"
                      className={`mt-2 shrink-0 text-[11px] ${
                        sellTooLong ? "text-[#D0320E]" : "text-[#161515]/70"
                      }`}
                      style={MONO_STYLE}
                    >
                      <span className="sr-only">Characters used: </span>
                      {sellLength}/{WHAT_THEY_SELL_MAX}
                    </p>
                  </div>
                </div>
              ) : null}

              {stepId === "websiteUrl" ? (
                <div>
                  <label
                    ref={headingRef}
                    tabIndex={-1}
                    htmlFor="quiz-website-url"
                    className={QUESTION_HEADING_CLASS}
                    style={QUESTION_HEADING_STYLE}
                  >
                    {QUIZ_TITLES.websiteUrl}
                  </label>
                  <input
                    id="quiz-website-url"
                    name="websiteUrl"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={draft.websiteUrl}
                    onChange={(event) => updateDraft("websiteUrl", event.target.value)}
                    onBlur={() => checkUrlOnBlur("websiteUrl")}
                    placeholder="example.ch"
                    aria-invalid={Boolean(fieldErrors.websiteUrl)}
                    aria-describedby="quiz-website-url-error"
                    className={FIELD_CLASS}
                  />
                  <FieldError id="quiz-website-url-error" message={fieldErrors.websiteUrl} />

                  {(
                    [
                      { key: "linkedinUrl", label: "LinkedIn link (optional)", placeholder: "linkedin.com/in/yourname" },
                      { key: "instagramUrl", label: "Instagram link (optional)", placeholder: "instagram.com/yourname" },
                    ] as const
                  ).map((field) => {
                    const id = FIELD_FOCUS_ID[field.key];
                    return (
                      <div key={field.key}>
                        <label
                          htmlFor={id}
                          className="mt-3 block text-[11px] uppercase text-[#161515]/75"
                          style={MONO_STYLE}
                        >
                          {field.label}
                        </label>
                        <input
                          id={id}
                          name={field.key}
                          type="text"
                          inputMode="url"
                          autoCapitalize="none"
                          spellCheck={false}
                          value={draft[field.key]}
                          onChange={(event) => updateDraft(field.key, event.target.value)}
                          onBlur={() => checkUrlOnBlur(field.key)}
                          placeholder={field.placeholder}
                          aria-invalid={Boolean(fieldErrors[field.key])}
                          aria-describedby={`${id}-error`}
                          className={`${FIELD_CLASS} mt-2`}
                        />
                        <FieldError id={`${id}-error`} message={fieldErrors[field.key]} />
                      </div>
                    );
                  })}
                </div>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  aria-disabled={!isStepValid}
                  className={`${PRIMARY_BUTTON_CLASS} aria-disabled:cursor-not-allowed aria-disabled:opacity-50`}
                  style={MONO_STYLE}
                >
                  [ NEXT → ]
                </button>
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className={LINK_BUTTON_CLASS}
                    style={MONO_STYLE}
                  >
                    ← Back
                  </button>
                ) : null}
              </div>
            </motion.form>
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
                  <label
                    className={`${OPTION_ROW_CLASS} mt-3 ${
                      wantsCall
                        ? "border-[#D0320E] bg-[#D0320E]/8"
                        : "border-[#161515]/35 hover:border-[#D0320E]"
                    }`}
                  >
                    <input
                      id="audit-wants-call"
                      type="checkbox"
                      name="wantsCall"
                      checked={wantsCall}
                      onChange={(event) => setWantsCall(event.target.checked)}
                      className="sr-only"
                    />
                    <CheckboxIndicator checked={wantsCall} />
                    I prefer a video call to go through my audit
                  </label>
                  <label
                    className={`${OPTION_ROW_CLASS} mt-3 ${
                      wantsNewsletter
                        ? "border-[#D0320E] bg-[#D0320E]/8"
                        : "border-[#161515]/35 hover:border-[#D0320E]"
                    }`}
                  >
                    <input
                      id="audit-wants-newsletter"
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={wantsNewsletter}
                      onChange={(event) => setWantsNewsletter(event.target.checked)}
                      className="sr-only"
                    />
                    <CheckboxIndicator checked={wantsNewsletter} />
                    Also subscribe me to Notes, Mari&apos;s newsletter
                  </label>
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
