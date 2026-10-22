import { describe, expect, it, vi } from "vitest";

import { SQLiteItemRepository } from "@/src/features/items/data/itemRepository";
import { validateCaptureText } from "@/src/features/items/domain/item";

describe("Clarunio M1 dominio y repositorio", () => {
  it("recorta y rechaza una captura sin contenido", () => {
    expect(validateCaptureText("  preparar exposición  ")).toBe("preparar exposición");
    expect(() => validateCaptureText(" \n ")).toThrow("La captura no puede estar vacía.");
  });

  it("guarda una captura INBOX con parámetros y la devuelve en la consulta", async () => {
    const database = {
      runAsync: vi.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 0 }),
      getAllAsync: vi.fn().mockResolvedValue([
        {
          id: "item-1",
          title: "preparar exposición",
          state: "INBOX",
          created_at: "2026-10-22T10:00:00.000Z",
          updated_at: "2026-10-22T10:00:00.000Z"
        }
      ])
    };
    const repository = new SQLiteItemRepository(database as never);

    await repository.createInboxItem(" preparar exposición ");
    const items = await repository.listInboxItems();

    expect(database.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO items"),
      expect.any(String),
      "preparar exposición",
      "INBOX",
      expect.any(String),
      expect.any(String)
    );
    expect(database.getAllAsync).toHaveBeenCalledWith(expect.stringContaining("WHERE state = ?"), "INBOX");
    expect(items).toEqual([
      expect.objectContaining({ id: "item-1", title: "preparar exposición", state: "INBOX" })
    ]);
  });

  it("no escribe cuando la captura está vacía", async () => {
    const database = { runAsync: vi.fn() };
    const repository = new SQLiteItemRepository(database as never);

    await expect(repository.createInboxItem("   ")).rejects.toThrow("La captura no puede estar vacía.");
    expect(database.runAsync).not.toHaveBeenCalled();
  });
});
