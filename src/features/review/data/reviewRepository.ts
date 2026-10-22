import type { SQLiteDatabase } from "expo-sqlite";

import { EMPTY_REVIEW_SUMMARY, nextReviewStep, type ReviewKind, type ReviewSession, type ReviewStep, type ReviewSummary } from "../domain/review";

type SessionRow = { id: string; kind: ReviewKind; state: ReviewSession["state"]; current_step: ReviewStep; started_at: string; finished_at: string | null; summary_json: string };

function id(): string { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`; }
function mapSession(row: SessionRow): ReviewSession {
  let summary = EMPTY_REVIEW_SUMMARY;
  try { summary = { ...EMPTY_REVIEW_SUMMARY, ...(JSON.parse(row.summary_json) as Partial<ReviewSummary>) }; } catch { /* El resumen puede regenerarse desde los datos actuales. */ }
  return { id: row.id, kind: row.kind, state: row.state, currentStep: row.current_step, startedAt: row.started_at, finishedAt: row.finished_at, summary };
}

export class SQLiteReviewRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getSummary(today: string): Promise<ReviewSummary> {
    const [inbox, next, waiting, projectsWithoutNext, scheduledSomeday] = await Promise.all([
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = ?", "INBOX"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = ? AND (available_from IS NULL OR available_from <= ?)", "NEXT", today),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = ?", "WAITING"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM projects p WHERE p.status = 'ACTIVE' AND NOT EXISTS (SELECT 1 FROM items i WHERE i.project_id = p.id AND i.state = 'NEXT') AND p.blocked_reason IS NULL"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state IN ('SCHEDULED', 'SOMEDAY')")
    ]);
    return { inbox: inbox?.count ?? 0, next: next?.count ?? 0, waiting: waiting?.count ?? 0, projectsWithoutNext: projectsWithoutNext?.count ?? 0, scheduledSomeday: scheduledSomeday?.count ?? 0 };
  }

  async listStepItems(step: ReviewStep, today: string): Promise<Array<{ id: string; title: string; state: string }>> {
    const query: [string, string[]] = step === "INBOX"
      ? ["state = 'INBOX'", []]
      : step === "NEXT"
        ? ["state = 'NEXT' AND (available_from IS NULL OR available_from <= ?)", [today]]
        : step === "WAITING"
          ? ["state = 'WAITING'", []]
          : step === "SCHEDULED_SOMEDAY"
            ? ["state IN ('SCHEDULED', 'SOMEDAY')", []]
            : step === "PROJECTS"
              ? ["1 = 0", []]
              : ["1 = 0", []];
    if (step === "PROJECTS") return this.database.getAllAsync<{ id: string; title: string; state: string }>("SELECT id, desired_outcome AS title, status AS state FROM projects WHERE status = 'ACTIVE' AND NOT EXISTS (SELECT 1 FROM items WHERE items.project_id = projects.id AND items.state = 'NEXT') AND blocked_reason IS NULL ORDER BY sort_order, created_at");
    return this.database.getAllAsync<{ id: string; title: string; state: string }>(`SELECT id, title, state FROM items WHERE ${query[0]} ORDER BY sort_order, created_at`, ...query[1]);
  }

  async resumeOrCreate(kind: ReviewKind, summary: ReviewSummary): Promise<ReviewSession> {
    const existing = await this.database.getFirstAsync<SessionRow>("SELECT * FROM review_sessions WHERE kind = ? AND state = 'IN_PROGRESS' ORDER BY started_at DESC LIMIT 1", kind);
    if (existing) return mapSession(existing);
    const startedAt = new Date().toISOString();
    const session: ReviewSession = { id: id(), kind, state: "IN_PROGRESS", currentStep: "INBOX", startedAt, finishedAt: null, summary };
    await this.database.runAsync("INSERT INTO review_sessions (id, kind, state, current_step, started_at, summary_json) VALUES (?, ?, ?, ?, ?, ?)", session.id, session.kind, session.state, session.currentStep, startedAt, JSON.stringify(summary));
    return session;
  }

  async getInProgress(kind: ReviewKind): Promise<ReviewSession | null> {
    const row = await this.database.getFirstAsync<SessionRow>("SELECT * FROM review_sessions WHERE kind = ? AND state = 'IN_PROGRESS' ORDER BY started_at DESC LIMIT 1", kind);
    return row ? mapSession(row) : null;
  }

  async advance(session: ReviewSession, summary: ReviewSummary): Promise<ReviewSession> {
    const currentStep = nextReviewStep(session.currentStep);
    return this.update(session.id, { currentStep, summary, state: "IN_PROGRESS", finishedAt: null });
  }

  async pause(session: ReviewSession): Promise<ReviewSession> { return this.update(session.id, { currentStep: session.currentStep, summary: session.summary, state: "IN_PROGRESS", finishedAt: null }); }
  async cancel(session: ReviewSession): Promise<ReviewSession> { return this.update(session.id, { currentStep: session.currentStep, summary: session.summary, state: "CANCELLED", finishedAt: new Date().toISOString() }); }
  async complete(session: ReviewSession, summary: ReviewSummary): Promise<ReviewSession> { return this.update(session.id, { currentStep: "CLOSURE", summary, state: "COMPLETED", finishedAt: new Date().toISOString() }); }

  private async update(idValue: string, values: { currentStep: ReviewStep; summary: ReviewSummary; state: ReviewSession["state"]; finishedAt: string | null }): Promise<ReviewSession> {
    const result = await this.database.runAsync("UPDATE review_sessions SET current_step = ?, state = ?, finished_at = ?, summary_json = ? WHERE id = ? AND state = 'IN_PROGRESS'", values.currentStep, values.state, values.finishedAt, JSON.stringify(values.summary), idValue);
    if (result.changes !== 1) throw new Error("La sesión ya no está disponible.");
    const row = await this.database.getFirstAsync<SessionRow>("SELECT * FROM review_sessions WHERE id = ?", idValue);
    if (!row) throw new Error("No se pudo leer la sesión actualizada.");
    return mapSession(row);
  }
}
