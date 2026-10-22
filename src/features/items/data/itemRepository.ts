import type { SQLiteDatabase } from "expo-sqlite";

import { clarifyInboxItem, validateCaptureText, validateWaitingFor, type InboxDecision, type Item } from "../domain/item";

type ItemRow = {
  id: string;
  title: string;
  state: Item["state"];
  created_at: string;
  updated_at: string;
  project_id?: string | null;
  waiting_for?: string | null;
};

export interface ItemRepository {
  createInboxItem(title: string): Promise<Item>;
  listInboxItems(): Promise<Item[]>;
  getItemById(id: string): Promise<Item | null>;
  clarifyInboxItem(id: string, decision: InboxDecision): Promise<Item>;
  transitionWaiting(id: string, destination: "NEXT" | "DONE", title?: string): Promise<Item>;
}

function createLocalId(): string {
  const randomUuid = globalThis.crypto?.randomUUID;
  if (randomUuid) return randomUuid.call(globalThis.crypto);
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 3) | 8;
    return value.toString(16);
  });
}

function mapItem(row: ItemRow): Item {
  return {
    id: row.id,
    title: row.title,
    state: row.state,
    createdAt: row.created_at,
    updatedAt: row.updated_at
    , projectId: row.project_id ?? null
    , waitingFor: row.waiting_for ?? null
  };
}

export class SQLiteItemRepository implements ItemRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async createInboxItem(value: string): Promise<Item> {
    const title = validateCaptureText(value);
    const now = new Date().toISOString();
    const item: Item = {
      id: createLocalId(),
      title,
      state: "INBOX",
      createdAt: now,
      updatedAt: now
    };

    await this.database.runAsync(
      `INSERT INTO items (id, title, state, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      item.id,
      item.title,
      item.state,
      item.createdAt,
      item.updatedAt
    );

    return item;
  }

  async listInboxItems(): Promise<Item[]> {
    const rows = await this.database.getAllAsync<ItemRow>(
      `SELECT id, title, state, project_id, waiting_for, created_at, updated_at
       FROM items
       WHERE state = ?
       ORDER BY created_at DESC`,
      "INBOX"
    );
    return rows.map(mapItem);
  }

  async getItemById(id: string): Promise<Item | null> {
    const row = await this.database.getFirstAsync<ItemRow>(
      `SELECT id, title, state, project_id, waiting_for, created_at, updated_at FROM items WHERE id = ?`,
      id
    );
    return row ? mapItem(row) : null;
  }

  async clarifyInboxItem(id: string, decision: InboxDecision): Promise<Item> {
    const current = await this.getItemById(id);
    if (!current) throw new Error("No se encontró la entrada.");
    const next = clarifyInboxItem(current, decision);
    if (decision.destination === "PROJECT") throw new Error("Usa el flujo de proyecto para crear su resultado y primera acción.");
    const now = next.updatedAt;
    const result = decision.destination === "TRASH"
      ? await this.database.runAsync(
          `UPDATE items SET title = ?, state = ?, updated_at = ?, previous_state = ?, deleted_at = ?
           WHERE id = ? AND state = ?`,
          next.title,
          next.state,
          now,
          "INBOX",
          now,
          id,
          "INBOX"
        )
      : decision.destination === "WAITING"
        ? await this.database.runAsync(
            `UPDATE items SET title = ?, state = ?, waiting_for = ?, updated_at = ? WHERE id = ? AND state = ?`,
            next.title, next.state, next.waitingFor ?? null, now, id, "INBOX"
          )
        : await this.database.runAsync(
            `UPDATE items SET title = ?, state = ?, updated_at = ? WHERE id = ? AND state = ?`,
            next.title, next.state, now, id, "INBOX"
          );

    if (result.changes !== 1) {
      throw new Error("La entrada ya no está en la bandeja o ya fue aclarada.");
    }
    return { ...next, updatedAt: now };
  }

  async transitionWaiting(id: string, destination: "NEXT" | "DONE", title?: string): Promise<Item> {
    const current = await this.getItemById(id);
    if (!current || current.state !== "WAITING") throw new Error("Solo puedes mover una acción que está en espera.");
    if (current.waitingFor === null || current.waitingFor === undefined) throw new Error("Una espera debe indicar qué respuesta o resultado espera.");
    validateWaitingFor(current.waitingFor);
    const nextTitle = destination === "NEXT" ? validateCaptureText(title ?? current.title) : current.title;
    const now = new Date().toISOString();
    const result = await this.database.runAsync("UPDATE items SET title = ?, state = ?, waiting_for = NULL, completed_at = ?, updated_at = ? WHERE id = ? AND state = ?", nextTitle, destination, destination === "DONE" ? now : null, now, id, "WAITING");
    if (result.changes !== 1) throw new Error("La acción ya no está en espera.");
    return { ...current, title: nextTitle, state: destination, waitingFor: null, updatedAt: now };
  }
}
