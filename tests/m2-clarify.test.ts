import { describe, expect, it, vi } from "vitest";

import { SQLiteItemRepository } from "@/src/features/items/data/itemRepository";
import { clarifyInboxItem, type Item } from "@/src/features/items/domain/item";

const inboxItem: Item = {
  id: "item-1",
  title: "preparar exposición",
  state: "INBOX",
  createdAt: "2026-10-22T10:00:00.000Z",
  updatedAt: "2026-10-22T10:00:00.000Z"
};

function databaseFor(item: Item | null, changes = 1) {
  return {
    getFirstAsync: vi.fn().mockResolvedValue(item && {
      id: item.id,
      title: item.title,
      state: item.state,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    }),
    runAsync: vi.fn().mockResolvedValue({ changes, lastInsertRowId: 0 })
  };
}

describe("Clarunio M2 aclaración", () => {
  it("exige una entrada INBOX y conserva el título al moverla", () => {
    expect(clarifyInboxItem(inboxItem, { destination: "REFERENCE" })).toMatchObject({ state: "REFERENCE", title: inboxItem.title });
    expect(clarifyInboxItem(inboxItem, { destination: "SOMEDAY" })).toMatchObject({ state: "SOMEDAY", title: inboxItem.title });
    expect(() => clarifyInboxItem({ ...inboxItem, state: "NEXT" }, { destination: "REFERENCE" })).toThrow("siguen en la bandeja");
  });

  it("convierte una entrada en NEXT con el paso concreto validado", async () => {
    const database = databaseFor(inboxItem);
    const repository = new SQLiteItemRepository(database as never);

    const result = await repository.clarifyInboxItem("item-1", { destination: "NEXT", title: "  redactar esquema  " });

    expect(result).toMatchObject({ state: "NEXT", title: "redactar esquema" });
    expect(database.runAsync).toHaveBeenCalledWith(expect.stringContaining("WHERE id = ? AND state = ?"), "redactar esquema", "NEXT", expect.any(String), "item-1", "INBOX");
  });

  it("registra INBOX como estado previo al enviar a papelera", async () => {
    const database = databaseFor(inboxItem);
    const repository = new SQLiteItemRepository(database as never);

    await repository.clarifyInboxItem("item-1", { destination: "TRASH" });

    expect(database.runAsync).toHaveBeenCalledWith(expect.stringContaining("previous_state"), inboxItem.title, "TRASH", expect.any(String), "INBOX", expect.any(String), "item-1", "INBOX");
  });

  it("rechaza una actualización que ya no afecta una entrada INBOX", async () => {
    const database = databaseFor(inboxItem, 0);
    const repository = new SQLiteItemRepository(database as never);

    await expect(repository.clarifyInboxItem("item-1", { destination: "SOMEDAY" })).rejects.toThrow("ya no está en la bandeja");
  });

  it("no escribe si el siguiente paso está vacío", async () => {
    const database = databaseFor(inboxItem);
    const repository = new SQLiteItemRepository(database as never);

    await expect(repository.clarifyInboxItem("item-1", { destination: "NEXT", title: "  " })).rejects.toThrow("no puede estar vacía");
    expect(database.runAsync).not.toHaveBeenCalled();
  });
});
