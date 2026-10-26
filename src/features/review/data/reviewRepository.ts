import type { SQLiteDatabase } from "expo-sqlite";

import { EMPTY_REVIEW_DECISION_SUMMARY, EMPTY_REVIEW_SUMMARY, nextReviewStep, type ReviewDecision, type ReviewDecisionSummary, type ReviewDecisionValue, type ReviewKind, type ReviewSession, type ReviewStepLike, type ReviewSummary } from "../domain/review";

type SessionRow = { id: string; kind: ReviewKind; state: ReviewSession["state"]; current_step: ReviewStepLike; started_at: string; finished_at: string | null; summary_json: string };

function id(): string { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`; }
function mapSession(row: SessionRow): ReviewSession {
  let summary = EMPTY_REVIEW_SUMMARY;
  try { summary = { ...EMPTY_REVIEW_SUMMARY, ...(JSON.parse(row.summary_json) as Partial<ReviewSummary>) }; } catch { /* El resumen puede regenerarse desde los datos actuales. */ }
  return { id: row.id, kind: row.kind, state: row.state, currentStep: row.current_step, startedAt: row.started_at, finishedAt: row.finished_at, summary };
}

export class SQLiteReviewRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async getSummary(today: string): Promise<ReviewSummary> {
    const [inbox, next, waiting, projectsWithoutNext, scheduled, someday] = await Promise.all([
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = ?", "INBOX"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = ? AND (available_from IS NULL OR available_from <= ?)", "NEXT", today),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = ?", "WAITING"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM projects p WHERE p.status = 'ACTIVE' AND NOT EXISTS (SELECT 1 FROM items i WHERE i.project_id = p.id AND i.state = 'NEXT') AND p.blocked_reason IS NULL"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = 'SCHEDULED'"),
      this.database.getFirstAsync<{ count: number }>("SELECT COUNT(*) AS count FROM items WHERE state = 'SOMEDAY'")
    ]);
    return { inbox: inbox?.count ?? 0, next: next?.count ?? 0, waiting: waiting?.count ?? 0, projectsWithoutNext: projectsWithoutNext?.count ?? 0, scheduled: scheduled?.count ?? 0, someday: someday?.count ?? 0 };
  }

  async listStepItems(step: ReviewStepLike, today: string): Promise<Array<{ id: string; title: string; state: string }>> {
    const query: [string, string[]] = step === "INBOX"
      ? ["state = 'INBOX'", []]
      : step === "NEXT"
        ? ["state = 'NEXT' AND (available_from IS NULL OR available_from <= ?)", [today]]
        : step === "WAITING"
          ? ["state = 'WAITING'", []]
          : step === "SCHEDULED"
            ? ["state = 'SCHEDULED'", []]
            : step === "SOMEDAY" || step === "SCHEDULED_SOMEDAY"
              ? [step === "SOMEDAY" ? "state = 'SOMEDAY'" : "state IN ('SCHEDULED', 'SOMEDAY')", []]
            : step === "PROJECTS"
              ? ["1 = 0", []]
              : ["1 = 0", []];
    if (step === "PROJECTS") return this.database.getAllAsync<{ id: string; title: string; state: string }>("SELECT id, desired_outcome AS title, status AS state FROM projects WHERE status = 'ACTIVE' AND NOT EXISTS (SELECT 1 FROM items WHERE items.project_id = projects.id AND items.state = 'NEXT') AND blocked_reason IS NULL ORDER BY sort_order, created_at");
    return this.database.getAllAsync<{ id: string; title: string; state: string }>(`SELECT id, title, state FROM items WHERE ${query[0]} ORDER BY sort_order, created_at`, ...query[1]);
  }

  async listDecisions(sessionId: string, step?: ReviewStepLike): Promise<ReviewDecision[]> {
    const rows = await this.database.getAllAsync<ReviewDecision & { session_id: string; entity_id: string; decided_at: string }>(
      step ? "SELECT session_id, entity_id, step, decision, decided_at FROM review_decisions WHERE session_id = ? AND step = ?" : "SELECT session_id, entity_id, step, decision, decided_at FROM review_decisions WHERE session_id = ?",
      ...(step ? [sessionId, step] : [sessionId])
    );
    return rows.map((row) => ({ sessionId: row.session_id, entityId: row.entity_id, step: row.step, decision: row.decision, decidedAt: row.decided_at }));
  }

  async saveDecision(session: ReviewSession, entityId: string, step: ReviewStepLike, decision: ReviewDecisionValue): Promise<ReviewDecision> {
    const decidedAt = new Date().toISOString();
    await this.database.runAsync("INSERT INTO review_decisions (session_id, entity_id, step, decision, decided_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(session_id, entity_id, step) DO UPDATE SET decision = excluded.decision, decided_at = excluded.decided_at", session.id, entityId, step, decision, decidedAt);
    return { sessionId: session.id, entityId, step, decision, decidedAt };
  }

  async getDecisionSummary(sessionId: string, step: ReviewStepLike, total: number): Promise<ReviewDecisionSummary> {
    const rows = await this.database.getAllAsync<{ decision: ReviewDecisionValue; count: number }>("SELECT decision, COUNT(*) AS count FROM review_decisions WHERE session_id = ? AND step = ? GROUP BY decision", sessionId, step);
    const reviewed = rows.find((row) => row.decision === "REVIEWED")?.count ?? 0;
    const omitted = rows.find((row) => row.decision === "OMITTED")?.count ?? 0;
    return { ...EMPTY_REVIEW_DECISION_SUMMARY, reviewed, omitted, undecided: Math.max(total - reviewed - omitted, 0), total };
  }

  async getSessionDecisionSummary(sessionId: string, today: string): Promise<ReviewDecisionSummary> {
    const steps: ReviewStepLike[] = ["INBOX", "NEXT", "WAITING", "PROJECTS", "SCHEDULED", "SOMEDAY", "SCHEDULED_SOMEDAY"];
    const decisions = await this.listDecisions(sessionId);
    const totals = await Promise.all(steps.map(async (step) => (await this.listStepItems(step, today)).map((item) => `${step}:${item.id}`)));
    const entities = new Set(totals.flat());
    const reviewed = decisions.filter((decision) => decision.decision === "REVIEWED" && entities.has(`${decision.step}:${decision.entityId}`)).length;
    const omitted = decisions.filter((decision) => decision.decision === "OMITTED" && entities.has(`${decision.step}:${decision.entityId}`)).length;
    return { reviewed, omitted, undecided: Math.max(entities.size - reviewed - omitted, 0), total: entities.size };
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

  private async update(idValue: string, values: { currentStep: ReviewStepLike; summary: ReviewSummary; state: ReviewSession["state"]; finishedAt: string | null }): Promise<ReviewSession> {
    await this.database.withTransactionAsync(async () => {
      const result = await this.database.runAsync("UPDATE review_sessions SET current_step = ?, state = ?, finished_at = ?, summary_json = ? WHERE id = ? AND state = 'IN_PROGRESS'", values.currentStep, values.state, values.finishedAt, JSON.stringify(values.summary), idValue);
      if (result.changes !== 1) throw new Error("La sesión ya no está disponible.");
    });
    const row = await this.database.getFirstAsync<SessionRow>("SELECT * FROM review_sessions WHERE id = ?", idValue);
    if (!row) throw new Error("No se pudo leer la sesión actualizada.");
    return mapSession(row);
  }
}
