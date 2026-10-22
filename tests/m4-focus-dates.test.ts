import { describe, expect, it, vi } from "vitest";

import { initializeDatabase } from "@/src/features/items/data/migrations";
import { SQLiteItemRepository } from "@/src/features/items/data/itemRepository";
import { validateLocalDate } from "@/src/features/items/domain/item";

function database() {
  return {
    execAsync: vi.fn().mockResolvedValue(undefined),
    getFirstAsync: vi.fn(async (query: string) => query.includes("user_version") ? { user_version: 2 } : { state: "NEXT", available_from: null }),
    getAllAsync: vi.fn().mockResolvedValue([]),
    runAsync: vi.fn().mockResolvedValue({ changes: 0, lastInsertRowId: 0 }),
    withTransactionAsync: vi.fn(async (callback: () => Promise<void>) => callback())
  };
}

describe("Clarunio M4 foco y fechas", () => {
  it("migra desde v2 sin perder items y crea foco e índices", async () => {
    const db = database();
    await initializeDatabase(db as never);
    expect(db.execAsync).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS focus_selections"));
    expect(db.execAsync).toHaveBeenCalledWith(expect.stringContaining("idx_items_due_at"));
    expect(db.execAsync).toHaveBeenCalledWith(expect.stringContaining("idx_items_follow_up_at_state"));
    expect(db.execAsync).toHaveBeenCalledWith("PRAGMA user_version = 3");
  });

  it("persiste el foco solo para NEXT disponible y acepta reintentos idempotentes", async () => {
    const db = database();
    const repository = new SQLiteItemRepository(db as never);
    await repository.addFocus("item-1", "2026-10-22");
    await repository.addFocus("item-1", "2026-10-22");
    expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining("INSERT OR IGNORE"), "2026-10-22", expect.any(String), "item-1", "2026-10-22");
  });

  it("activa programadas con UPDATE filtrado y no crea duplicados", async () => {
    const db = database();
    db.runAsync.mockResolvedValueOnce({ changes: 1, lastInsertRowId: 0 }).mockResolvedValueOnce({ changes: 0, lastInsertRowId: 0 });
    const repository = new SQLiteItemRepository(db as never);
    expect(await repository.activateScheduledItems("2026-10-22")).toBe(1);
    expect(await repository.activateScheduledItems("2026-10-22")).toBe(0);
    expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining("state = 'SCHEDULED'"), expect.any(String), "2026-10-22");
  });

  it("completa y elimina el foco dentro de la misma transacción, sin restaurarlo al deshacer", async () => {
    const db = database();
    db.runAsync.mockResolvedValue({ changes: 1, lastInsertRowId: 0 });
    db.getFirstAsync.mockImplementation(async (query: string): Promise<any> => query.includes("user_version") ? { user_version: 3 } : { id: "item-1", title: "Acción", state: "DONE", project_id: null, waiting_for: null, available_from: null, due_at: null, follow_up_at: null, created_at: "2026-10-22", updated_at: "2026-10-22" });
    const repository = new SQLiteItemRepository(db as never);
    await repository.completeAction("item-1");
    await repository.undoCompletion("item-1");
    expect(db.withTransactionAsync).toHaveBeenCalledOnce();
    expect(db.runAsync).toHaveBeenCalledWith("DELETE FROM focus_selections WHERE item_id = ?", "item-1");
    expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining("state = 'NEXT'"), expect.any(String), "item-1");
  });

  it("rechaza fechas locales que no tienen formato o calendario válido", () => {
    expect(() => validateLocalDate("2026-02-30")).toThrow("no es válida");
    expect(() => validateLocalDate("2026-10-2")).toThrow("AAAA-MM-DD");
  });
});
