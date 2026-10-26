import type { SQLiteDatabase } from "expo-sqlite";

import { BACKUP_FORMAT, BACKUP_SCHEMA_VERSION, validateBackup, type Backup } from "../domain/backup";
import { SQLiteSettingsRepository } from "@/src/features/settings/data/settingsRepository";

export class SQLiteBackupRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async exportBackup(): Promise<Backup> {
    const [projects, items, focusSelections, reviewSessions, reviewDecisions] = await Promise.all([
      this.database.getAllAsync("SELECT id, desired_outcome, notes, status, blocked_reason, created_at, updated_at, completed_at, sort_order FROM projects"),
      this.database.getAllAsync("SELECT id, title, notes, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at, completed_at, deleted_at, previous_state, sort_order FROM items"),
      this.database.getAllAsync("SELECT item_id, focus_date, created_at FROM focus_selections"),
      this.database.getAllAsync("SELECT id, kind, state, current_step, started_at, finished_at, summary_json FROM review_sessions"),
      this.database.getAllAsync("SELECT session_id, entity_id, step, decision, decided_at FROM review_decisions")
    ]);
    return { format: BACKUP_FORMAT, schemaVersion: BACKUP_SCHEMA_VERSION, exportedAt: new Date().toISOString(), data: { projects: projects as Backup["data"]["projects"], items: items as Backup["data"]["items"], focusSelections: focusSelections as Backup["data"]["focusSelections"], reviewSessions: reviewSessions as Backup["data"]["reviewSessions"], reviewDecisions: reviewDecisions as Backup["data"]["reviewDecisions"], settings: await new SQLiteSettingsRepository(this.database).get() } };
  }

  async replaceFromJson(json: string): Promise<Backup> {
    let parsed: unknown;
    try { parsed = JSON.parse(json); } catch { throw new Error("El archivo no contiene JSON válido."); }
    const backup = validateBackup(parsed);
    await this.database.withTransactionAsync(async () => {
      await this.database.runAsync("DELETE FROM focus_selections");
      await this.database.runAsync("DELETE FROM items");
      await this.database.runAsync("DELETE FROM projects");
      await this.database.runAsync("DELETE FROM review_decisions");
      await this.database.runAsync("DELETE FROM review_sessions");
      await this.database.runAsync("DELETE FROM settings");
      for (const project of backup.data.projects) await this.database.runAsync("INSERT INTO projects (id, desired_outcome, notes, status, blocked_reason, created_at, updated_at, completed_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", project.id, project.desired_outcome, project.notes, project.status, project.blocked_reason, project.created_at, project.updated_at, project.completed_at, project.sort_order);
      for (const item of backup.data.items) await this.database.runAsync("INSERT INTO items (id, title, notes, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at, completed_at, deleted_at, previous_state, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", item.id, item.title, item.notes, item.state, item.project_id, item.waiting_for, item.available_from, item.due_at, item.follow_up_at, item.created_at, item.updated_at, item.completed_at, item.deleted_at, item.previous_state, item.sort_order);
      for (const focus of backup.data.focusSelections) await this.database.runAsync("INSERT INTO focus_selections (item_id, focus_date, created_at) VALUES (?, ?, ?)", focus.item_id, focus.focus_date, focus.created_at);
      for (const review of backup.data.reviewSessions) await this.database.runAsync("INSERT INTO review_sessions (id, kind, state, current_step, started_at, finished_at, summary_json) VALUES (?, ?, ?, ?, ?, ?, ?)", review.id, review.kind, review.state, review.current_step, review.started_at, review.finished_at, review.summary_json);
      for (const decision of backup.data.reviewDecisions) await this.database.runAsync("INSERT INTO review_decisions (session_id, entity_id, step, decision, decided_at) VALUES (?, ?, ?, ?, ?)", decision.session_id, decision.entity_id, decision.step, decision.decision, decision.decided_at);
      await new SQLiteSettingsRepository(this.database).save(backup.data.settings);
    });
    return backup;
  }
}
