import type { SQLiteDatabase } from "expo-sqlite";

import { clarifyInboxItem, validateCaptureText, type InboxDecision, type Item } from "../../items/domain/item";
import type { Project, ProjectStatus } from "../domain/project";

type ProjectRow = { id: string; desired_outcome: string; notes: string | null; status: ProjectStatus; blocked_reason: string | null; created_at: string; updated_at: string; completed_at: string | null };
type ItemRow = { id: string; title: string; state: Item["state"]; project_id: string | null; waiting_for: string | null; available_from?: string | null; due_at?: string | null; follow_up_at?: string | null; created_at: string; updated_at: string };

function createLocalId(): string { return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`; }
function mapProject(row: ProjectRow): Project { return { id: row.id, desiredOutcome: row.desired_outcome, notes: row.notes, status: row.status, blockedReason: row.blocked_reason, createdAt: row.created_at, updatedAt: row.updated_at, completedAt: row.completed_at }; }
function mapItem(row: ItemRow): Item { return { id: row.id, title: row.title, state: row.state, projectId: row.project_id, waitingFor: row.waiting_for, availableFrom: row.available_from ?? null, dueAt: row.due_at ?? null, followUpAt: row.follow_up_at ?? null, createdAt: row.created_at, updatedAt: row.updated_at }; }

export class SQLiteProjectRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async listProjects(): Promise<Project[]> {
    const rows = await this.database.getAllAsync<ProjectRow>("SELECT id, desired_outcome, notes, status, blocked_reason, created_at, updated_at, completed_at FROM projects WHERE status != ? ORDER BY sort_order, created_at", "ARCHIVED");
    return rows.map(mapProject);
  }

  async getProjectById(id: string): Promise<Project | null> {
    const row = await this.database.getFirstAsync<ProjectRow>("SELECT id, desired_outcome, notes, status, blocked_reason, created_at, updated_at, completed_at FROM projects WHERE id = ?", id);
    return row ? mapProject(row) : null;
  }

  async listProjectItems(projectId: string): Promise<Item[]> {
    const rows = await this.database.getAllAsync<ItemRow>("SELECT id, title, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at FROM items WHERE project_id = ? AND state != ? ORDER BY sort_order, created_at", projectId, "TRASH");
    return rows.map(mapItem);
  }

  async clarifyInboxItemAsProject(id: string, desiredOutcome: string, firstAction: string): Promise<{ project: Project; item: Item }> {
    const outcome = validateCaptureText(desiredOutcome);
    const currentRow = await this.database.getFirstAsync<ItemRow>("SELECT id, title, state, project_id, waiting_for, created_at, updated_at FROM items WHERE id = ?", id);
    if (!currentRow) throw new Error("No se encontró la entrada.");
    const current = mapItem(currentRow);
    const decision: InboxDecision = { destination: "PROJECT", desiredOutcome: outcome, firstAction };
    const next = clarifyInboxItem(current, decision);
    const now = next.updatedAt;
    const project: Project = { id: createLocalId(), desiredOutcome: outcome, status: "ACTIVE", createdAt: now, updatedAt: now };
    await this.database.withTransactionAsync(async () => {
      const projectResult = await this.database.runAsync("INSERT INTO projects (id, desired_outcome, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", project.id, project.desiredOutcome, project.status, project.createdAt, project.updatedAt);
      if (projectResult.changes !== 1) throw new Error("No se pudo crear el proyecto.");
      const itemResult = await this.database.runAsync("UPDATE items SET title = ?, state = ?, project_id = ?, updated_at = ? WHERE id = ? AND state = ?", next.title, "NEXT", project.id, now, id, "INBOX");
      if (itemResult.changes !== 1) throw new Error("La entrada ya no está en la bandeja o ya fue aclarada.");
    });
    return { project, item: { ...next, projectId: project.id, state: "NEXT" } };
  }
}
