export const REVIEW_STEPS = ["INBOX", "NEXT", "WAITING", "PROJECTS", "SCHEDULED_SOMEDAY", "CLOSURE"] as const;
export type ReviewStep = (typeof REVIEW_STEPS)[number];
export type ReviewKind = "WEEKLY" | "RECOVERY";
export type ReviewState = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type ReviewSession = {
  id: string;
  kind: ReviewKind;
  state: ReviewState;
  currentStep: ReviewStep;
  startedAt: string;
  finishedAt: string | null;
  summary: ReviewSummary;
};

export type ReviewSummary = {
  inbox: number;
  next: number;
  waiting: number;
  projectsWithoutNext: number;
  scheduledSomeday: number;
};

export const EMPTY_REVIEW_SUMMARY: ReviewSummary = {
  inbox: 0,
  next: 0,
  waiting: 0,
  projectsWithoutNext: 0,
  scheduledSomeday: 0
};

export function nextReviewStep(step: ReviewStep): ReviewStep {
  const index = REVIEW_STEPS.indexOf(step);
  return REVIEW_STEPS[Math.min(index + 1, REVIEW_STEPS.length - 1)] ?? "CLOSURE";
}
