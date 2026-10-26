import { describe, expect, it } from "vitest";

import { BACKUP_FORMAT, validateBackup } from "@/src/features/backup/domain/backup";
import { DEFAULT_SETTINGS, parseSettings } from "@/src/features/settings/domain/settings";

const valid = { format: BACKUP_FORMAT, schemaVersion: 1, exportedAt: "2026-10-22T00:00:00.000Z", data: { projects: [], items: [], focusSelections: [], reviewSessions: [], settings: DEFAULT_SETTINGS } };

describe("M6 validación de backups", () => {
  it("acepta el contrato versionado vacío", () => expect(validateBackup(valid).format).toBe(BACKUP_FORMAT));
  it("rechaza versiones futuras y referencias rotas antes de mutar", () => {
    expect(() => validateBackup({ ...valid, schemaVersion: 2 })).toThrow("versión");
    expect(() => validateBackup({ ...valid, data: { ...valid.data, items: [{ id: "item-1", title: "Acción", notes: null, state: "NEXT", project_id: "missing", waiting_for: null }] } })).toThrow("referencia");
  });

  it("conserva decisiones y acepta respaldos v1 sin decisiones", () => {
    const decision = { session_id: "review-1", entity_id: "item-1", step: "INBOX", decision: "REVIEWED", decided_at: "2026-10-22T11:00:00.000Z" };
    expect(validateBackup({ ...valid, data: { ...valid.data, reviewSessions: [{ id: "review-1", kind: "WEEKLY", state: "IN_PROGRESS", current_step: "INBOX", started_at: "2026-10-22T10:00:00.000Z", finished_at: null, summary_json: "{}" }], reviewDecisions: [decision] }}).data.reviewDecisions).toEqual([decision]);
    expect(validateBackup(valid).data.reviewDecisions).toEqual([]);
  });
});

describe("M6 ajustes", () => {
  it("mantiene valores seguros y rechaza preferencias inválidas", () => {
    expect(parseSettings(DEFAULT_SETTINGS)).toEqual(DEFAULT_SETTINGS);
    expect(() => parseSettings({ ...DEFAULT_SETTINGS, theme: "blue" })).toThrow("valores válidos");
  });
});
