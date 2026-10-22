import { describe, expect, it, vi } from "vitest";

import { SQLiteItemRepository } from "@/src/features/items/data/itemRepository";
import { SQLiteProjectRepository } from "@/src/features/projects/data/projectRepository";
import { validateWaitingFor } from "@/src/features/items/domain/item";

function projectDatabase() {
  return {
    getFirstAsync: vi.fn().mockResolvedValue({ id: "item-1", title: "preparar exposición", state: "INBOX", project_id: null, waiting_for: null, created_at: "2026-10-22", updated_at: "2026-10-22" }),
    getAllAsync: vi.fn().mockResolvedValue([]),
    runAsync: vi.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 0 }),
    withTransactionAsync: vi.fn(async (callback: () => Promise<void>) => callback())
  };
}

describe("Clarunio M3 proyectos y esperando", () => {
  it("crea el proyecto y vincula su primera acción dentro de una transacción", async () => {
    const database = projectDatabase();
    const result = await new SQLiteProjectRepository(database as never).clarifyInboxItemAsProject("item-1", "Exposición lista", "Redactar esquema");

    expect(database.withTransactionAsync).toHaveBeenCalledOnce();
    expect(database.runAsync).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO projects"), expect.any(String), "Exposición lista", "ACTIVE", expect.any(String), expect.any(String));
    expect(database.runAsync).toHaveBeenCalledWith(expect.stringContaining("project_id"), "Redactar esquema", "NEXT", result.project.id, expect.any(String), "item-1", "INBOX");
    expect(result.item).toMatchObject({ state: "NEXT", projectId: result.project.id, title: "Redactar esquema" });
  });

  it("exige una persona o respuesta para WAITING y permite solo conversiones explícitas", async () => {
    const database = projectDatabase();
    const repository = new SQLiteItemRepository({
      ...database,
      getFirstAsync: vi.fn().mockResolvedValue({ id: "item-1", title: "Confirmar presupuesto", state: "WAITING", project_id: null, waiting_for: "Ana", created_at: "2026-10-22", updated_at: "2026-10-22" })
    } as never);

    expect(() => validateWaitingFor("  ")).toThrow("respuesta o resultado");
    const result = await repository.transitionWaiting("item-1", "NEXT", "Revisar respuesta");
    expect(result).toMatchObject({ state: "NEXT", waitingFor: null, title: "Revisar respuesta" });
    expect(database.runAsync).toHaveBeenCalledWith(expect.stringContaining("state = ?"), "Revisar respuesta", "NEXT", null, expect.any(String), "item-1", "WAITING");
  });
});
