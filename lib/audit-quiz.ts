// Quiz definition shared by the client (UI) and the API route (validation).

export type QuizOption = { value: string; label: string };
export type QuizQuestion = {
  id: "businessType" | "biggestLeak" | "teamSize" | "readiness";
  title: string;
  options: readonly QuizOption[];
};

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "businessType",
    title: "What kind of business do you run?",
    options: [
      { value: "local-service", label: "Local service or studio" },
      { value: "b2b-services", label: "B2B services" },
      { value: "product-innovation", label: "Product or innovation company" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "biggestLeak",
    title: "Where do you think you lose the most people?",
    options: [
      { value: "find-me", label: "They never find me on Google" },
      { value: "website", label: "They land on my website and leave" },
      { value: "lead-flow", label: "They ask, then I lose them in follow-up" },
      { value: "no-idea", label: "I have no idea" },
    ],
  },
  {
    id: "teamSize",
    title: "How big is your team?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "2-10", label: "2 to 10 people" },
      { value: "11-50", label: "11 to 50 people" },
      { value: "50-plus", label: "More than 50" },
    ],
  },
  {
    id: "readiness",
    title: "If the audit shows a clear fix, will you act within 30 days?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "maybe", label: "Maybe, depends on the fix" },
      { value: "just-looking", label: "No, I'm just looking" },
    ],
  },
];

export type QuizAnswers = Record<QuizQuestion["id"], string>;

export function isValidQuizAnswers(input: unknown): input is QuizAnswers {
  if (!input || typeof input !== "object") return false;
  const record = input as Record<string, unknown>;
  return QUIZ_QUESTIONS.every((question) =>
    question.options.some((option) => option.value === record[question.id])
  );
}
