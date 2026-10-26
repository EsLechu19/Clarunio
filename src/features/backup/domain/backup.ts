import { ITEM_STATES, type ItemState } from "@/src/features/items/domain/item";
import { PROJECT_STATUSES, type ProjectStatus } from "@/src/features/projects/domain/project";
import { parseSettings, type AppSettings } from "@/src/features/settings/domain/settings";

export const BACKUP_FORMAT = "gtd-companion-backup" as const;
export const BACKUP_SCHEMA_VERSION = 1;

export type Backup = {
  format: typeof BACKUP_FORMAT;
  schemaVersion: number;
  exportedAt: string;
  data: { projects: BackupProject[]; items: BackupItem[]; focusSelections: BackupFocus[]; reviewSessions: BackupReview[]; reviewDecisions: BackupReviewDecision[]; settings: AppSettings };
};
export type BackupProject = { id: string; desired_outcome: string; notes: string | null; status: ProjectStatus; blocked_reason: string | null; created_at: string; updated_at: string; completed_at: string | null; sort_order: number };
export type BackupItem = { id: string; title: string; notes: string | null; state: ItemState; project_id: string | null; waiting_for: string | null; available_from: string | null; due_at: string | null; follow_up_at: string | null; created_at: string; updated_at: string; completed_at: string | null; deleted_at: string | null; previous_state: ItemState | null; sort_order: number };
export type BackupFocus = { item_id: string; focus_date: string; created_at: string };
export type BackupReview = { id: string; kind: "WEEKLY" | "RECOVERY"; state: "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; current_step: string; started_at: string; finished_at: string | null; summary_json: string };
export type BackupReviewDecision = { session_id: string; entity_id: string; step: string; decision: "REVIEWED" | "OMITTED"; decided_at: string };

function list(value: unknown, name: string): unknown[] { if (!Array.isArray(value)) throw new Error(`El respaldo no contiene una lista válida de ${name}.`); return value; }
function text(value: unknown, name: string): string { if (typeof value !== "string" || !value.trim()) throw new Error(`El campo ${name} es obligatorio.`); return value; }
function nullableText(value: unknown, name: string): string | null { if (value !== null && typeof value !== "string") throw new Error(`El campo ${name} no es válido.`); return value; }
function uniqueIds(rows: Array<{ id: string }>, name: string): Set<string> { const ids = new Set<string>(); rows.forEach((row) => { const id = text(row.id, `${name}.id`); if (ids.has(id)) throw new Error(`El respaldo contiene IDs duplicados en ${name}.`); ids.add(id); }); return ids; }

export function validateBackup(value: unknown): Backup {
  if (!value || typeof value !== "object") throw new Error("El respaldo no es un objeto JSON.");
  const input = value as Record<string, unknown>;
  if (input.format !== BACKUP_FORMAT) throw new Error("El archivo no es un respaldo de Clarunio.");
  if (input.schemaVersion !== BACKUP_SCHEMA_VERSION) throw new Error("La versión del respaldo no es compatible.");
  text(input.exportedAt, "exportedAt");
  const data = input.data as Record<string, unknown> | null;
  if (!data || typeof data !== "object") throw new Error("El respaldo no contiene datos.");
  const projects = list(data.projects, "proyectos") as BackupProject[];
  const items = list(data.items, "elementos") as BackupItem[];
  const focusSelections = list(data.focusSelections, "enfoques") as BackupFocus[];
  const reviewSessions = list(data.reviewSessions, "revisiones") as BackupReview[];
  const reviewDecisions = (data.reviewDecisions === undefined ? [] : list(data.reviewDecisions, "decisiones de revisión")) as BackupReviewDecision[];
  const projectIds = uniqueIds(projects, "proyectos");
  const itemIds = uniqueIds(items, "elementos");
  const reviewIds = uniqueIds(reviewSessions, "revisiones");
  projects.forEach((project) => { text(project.desired_outcome, "projects.desired_outcome"); nullableText(project.notes, "projects.notes"); if (!PROJECT_STATUSES.includes(project.status)) throw new Error("Estado de proyecto inválido."); });
  items.forEach((item) => { text(item.title, "items.title"); nullableText(item.notes, "items.notes"); if (!ITEM_STATES.includes(item.state)) throw new Error("Estado de elemento inválido."); if (item.project_id !== null && !projectIds.has(item.project_id)) throw new Error("El respaldo contiene una referencia de proyecto inválida."); if (item.state === "WAITING" && !item.waiting_for?.trim()) throw new Error("Una espera importada debe indicar qué respuesta espera."); if (item.state === "TRASH" && !item.previous_state) throw new Error("Un elemento en papelera debe conservar su estado anterior."); });
  focusSelections.forEach((focus) => { if (!itemIds.has(focus.item_id)) throw new Error("El respaldo contiene una referencia de enfoque inválida."); if (!text(focus.focus_date, "focusSelections.focus_date")) throw new Error("La fecha de enfoque es obligatoria."); });
  reviewSessions.forEach((review) => { text(review.id, "reviewSessions.id"); if (!["WEEKLY", "RECOVERY"].includes(review.kind) || !["IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(review.state)) throw new Error("Estado de revisión inválido."); });
  reviewDecisions.forEach((decision) => { if (!reviewIds.has(text(decision.session_id, "reviewDecisions.session_id")) || !text(decision.entity_id, "reviewDecisions.entity_id") || !text(decision.step, "reviewDecisions.step") || !["REVIEWED", "OMITTED"].includes(decision.decision) || !text(decision.decided_at, "reviewDecisions.decided_at")) throw new Error("Decisión de revisión inválida."); });
  const settings = parseSettings(data.settings);
  return { format: BACKUP_FORMAT, schemaVersion: BACKUP_SCHEMA_VERSION, exportedAt: input.exportedAt as string, data: { projects, items, focusSelections, reviewSessions, reviewDecisions, settings } };
}

export function previewBackup(backup: Backup) { return { projects: backup.data.projects.length, items: backup.data.items.length, focusSelections: backup.data.focusSelections.length, reviewSessions: backup.data.reviewSessions.length, reviewDecisions: backup.data.reviewDecisions.length }; }
