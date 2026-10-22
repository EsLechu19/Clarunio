import { describe, expect, it, vi } from "vitest";

import { initializeDatabase } from "@/src/features/items/data/migrations";
import { SQLiteReviewRepository } from "@/src/features/review/data/reviewRepository";

function database() {
  return {
    execAsync: vi.fn().mockResolvedValue(undefined),
    getFirstAsync: vi.fn(async (query: string) => query.includes("user_version") ? { user_version: 3 } : null),
    getAllAsync: vi.fn().mockResolvedValue([]),
    runAsync: vi.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 0 }),
    withTransactionAsync: vi.fn(async (callback: () => Promise<void>) => callback())
  };
}

describe("Clarunio M5 revisión y recuperación", () => {
  it("crea review_sessions en la migración v4", async () => {
    const db = database();
    await initializeDatabase(db as never);
    expect(db.execAsync).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS review_sessions"));
    expect(db.execAsync).toHaveBeenCalledWith("PRAGMA user_version = 4");
  });

  it("reanuda la única sesión semanal en curso sin crear otra", async () => {
    const db = database();
    db.getFirstAsync.mockImplementation(async (query: string) => query.includes("review_sessions") ? { id: "review-1", kind: "WEEKLY", state: "IN_PROGRESS", current_step: "WAITING", started_at: "2026-10-22T10:00:00.000Z", finished_at: null, summary_json: '{"waiting":2}' } : null);
    const repository = new SQLiteReviewRepository(db as never);
    const session = await repository.resumeOrCreate("WEEKLY", { inbox: 1, next: 2, waiting: 3, projectsWithoutNext: 0, scheduledSomeday: 0 });
    expect(session.currentStep).toBe("WAITING");
    expect(db.runAsync).not.toHaveBeenCalled();
  });

  it("consulta la revisión sin activar programadas ni escribir", async () => {
    const db = database();
    const repository = new SQLiteReviewRepository(db as never);
    await repository.getSummary("2026-10-22");
    await repository.listStepItems("NEXT", "2026-10-22");
    expect(db.runAsync).not.toHaveBeenCalled();
    expect(db.getAllAsync).toHaveBeenCalledWith(expect.stringContaining("state = 'NEXT'"), "2026-10-22");
  });

  it("guarda cancelación y finalización con la marca de tiempo", async () => {
    const db = database();
    db.getFirstAsync.mockResolvedValue({ id: "review-1", kind: "RECOVERY", state: "CANCELLED", current_step: "INBOX", started_at: "2026-10-22T10:00:00.000Z", finished_at: "2026-10-22T11:00:00.000Z", summary_json: "{}" });
    const repository = new SQLiteReviewRepository(db as never);
    await repository.cancel({ id: "review-1", kind: "RECOVERY", state: "IN_PROGRESS", currentStep: "INBOX", startedAt: "2026-10-22T10:00:00.000Z", finishedAt: null, summary: { inbox: 0, next: 0, waiting: 0, projectsWithoutNext: 0, scheduledSomeday: 0 } });
    expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining("finished_at"), "INBOX", "CANCELLED", expect.any(String), expect.stringContaining('"inbox":0'), "review-1");
  });
});
