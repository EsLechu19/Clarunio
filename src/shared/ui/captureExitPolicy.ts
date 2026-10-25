export type CaptureExitDecision = "allow" | "confirm" | "blocked";

export function captureExitDecision(text: string, status: "idle" | "saving" | "success"): CaptureExitDecision {
  if (status !== "idle") return "blocked";
  return text.trim() ? "confirm" : "allow";
}
