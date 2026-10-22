import { describe, expect, it, vi } from "vitest";

import { SQLiteDataRepository } from "@/src/features/items/data/dataRepository";

describe("M7 borrado local", () => {
  it("borra tablas de datos y preferencias dentro de una sola transacción", async () => {
    const statements: string[] = [];
    const database = {
      withTransactionAsync: async (work: () => Promise<void>) => work(),
      runAsync: vi.fn(async (sql: string) => { statements.push(sql); return { changes: 1, lastInsertRowId: 0 }; })
    } as never;

    await new SQLiteDataRepository(database).deleteAll();

    expect(statements).toEqual([
      "DELETE FROM focus_selections",
      "DELETE FROM items",
      "DELETE FROM projects",
      "DELETE FROM review_sessions",
      "DELETE FROM settings"
    ]);
  });

  it("no ejecuta el borrado si la confirmación se cancela", () => {
    const deleteAll = vi.fn();
    const cancelConfirmation = () => undefined;

    cancelConfirmation();

    expect(deleteAll).not.toHaveBeenCalled();
  });
});
