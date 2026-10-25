import type { ReviewStep } from "./domain/review";

export function getReviewItemRoute(step: ReviewStep, id: string): string {
  if (step === "INBOX") return `/clarify/${id}`;
  if (step === "PROJECTS") return `/project/${id}`;
  return `/item/${id}`;
}
