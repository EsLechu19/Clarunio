import type { SQLiteDatabase } from "expo-sqlite";

import { clarifyInboxItem, validateCaptureText, validateDueAt, validateLocalDate, validateWaitingFor, type InboxDecision, type Item } from "../domain/item";

type ItemRow = {
  id: string;
  title: string;
  state: Item["state"];
  created_at: string;
  updated_at: string;
  project_id?: string | null;
  waiting_for?: string | null;
  available_from?: string | null;
  due_at?: string | null;
  follow_up_at?: string | null;
  focus_date?: string | null;
};

export interface ItemRepository {
  createInboxItem(title: string): Promise<Item>;
  listInboxItems(): Promise<Item[]>;
  listWaitingItems(): Promise<Item[]>;
  getItemById(id: string): Promise<Item | null>;
  clarifyInboxItem(id: string, decision: InboxDecision): Promise<Item>;
  transitionWaiting(id: string, destination: "NEXT" | "DONE", title?: string): Promise<Item>;
  listNextActionsAvailableNow(localDate: string): Promise<Item[]>;
  listFocusedNextActions(focusDate: string): Promise<Item[]>;
  addFocus(id: string, focusDate: string): Promise<void>;
  removeFocus(id: string, focusDate: string): Promise<void>;
  scheduleNextAction(id: string, availableFrom: string): Promise<Item>;
  setDueAt(id: string, dueAt: string): Promise<Item>;
  clearDueAt(id: string): Promise<Item>;
  completeAction(id: string): Promise<Item>;
  undoCompletion(id: string): Promise<Item>;
  activateScheduledItems(localDate: string): Promise<number>;
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
    , availableFrom: row.available_from ?? null
    , dueAt: row.due_at ?? null
    , followUpAt: row.follow_up_at ?? null
    , focusDate: row.focus_date ?? null
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
      `SELECT id, title, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at
       FROM items
       WHERE state = ?
       ORDER BY created_at DESC`,
      "INBOX"
    );
    return rows.map(mapItem);
  }

  async listWaitingItems(): Promise<Item[]> {
    const rows = await this.database.getAllAsync<ItemRow>(
      `SELECT id, title, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at
       FROM items
       WHERE state = ?
       ORDER BY sort_order, created_at, id`,
      "WAITING"
    );
    return rows.map(mapItem);
  }

  async getItemById(id: string): Promise<Item | null> {
    const row = await this.database.getFirstAsync<ItemRow>(
      `SELECT id, title, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at FROM items WHERE id = ?`,
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

  async listNextActionsAvailableNow(localDate: string): Promise<Item[]> {
    const date = validateLocalDate(localDate);
    await this.activateScheduledItems(date);
    const rows = await this.database.getAllAsync<ItemRow>("SELECT id, title, state, project_id, waiting_for, available_from, due_at, follow_up_at, created_at, updated_at FROM items WHERE state = ? AND (available_from IS NULL OR available_from <= ?) ORDER BY sort_order, created_at", "NEXT", date);
    return rows.map(mapItem);
  }

  async listFocusedNextActions(focusDate: string): Promise<Item[]> {
    const date = validateLocalDate(focusDate);
    await this.activateScheduledItems(date);
    const rows = await this.database.getAllAsync<ItemRow>("SELECT i.id, i.title, i.state, i.project_id, i.waiting_for, i.available_from, i.due_at, i.follow_up_at, i.created_at, i.updated_at, f.focus_date FROM items i INNER JOIN focus_selections f ON f.item_id = i.id WHERE f.focus_date = ? AND i.state = ? AND (i.available_from IS NULL OR i.available_from <= ?) ORDER BY i.sort_order, i.created_at", date, "NEXT", date);
    return rows.map(mapItem);
  }

  async addFocus(id: string, focusDate: string): Promise<void> {
    const date = validateLocalDate(focusDate);
    const item = await this.database.getFirstAsync<{ state: Item["state"]; available_from: string | null }>("SELECT state, available_from FROM items WHERE id = ?", id);
    if (!item || item.state !== "NEXT" || (item.available_from !== null && item.available_from > date)) throw new Error("Solo puedes enfocar una acción NEXT disponible.");
    const result = await this.database.runAsync("INSERT OR IGNORE INTO focus_selections (item_id, focus_date, created_at) SELECT id, ?, ? FROM items WHERE id = ? AND state = 'NEXT' AND (available_from IS NULL OR available_from <= ?)", date, new Date().toISOString(), id, date);
    if (result.changes < 0) throw new Error("No se pudo actualizar el foco.");
  }

  async removeFocus(id: string, focusDate: string): Promise<void> {
    const date = validateLocalDate(focusDate);
    await this.database.runAsync("DELETE FROM focus_selections WHERE item_id = ? AND focus_date = ?", id, date);
  }

  async scheduleNextAction(id: string, availableFrom: string): Promise<Item> {
    const date = validateLocalDate(availableFrom);
    const today = new Date();
    const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (date <= localToday) throw new Error("Programa la acción para una fecha futura.");
    const now = new Date().toISOString();
    let result: { changes: number } = { changes: 0 };
    await this.database.withTransactionAsync(async () => {
      result = await this.database.runAsync("UPDATE items SET state = 'SCHEDULED', available_from = ?, updated_at = ? WHERE id = ? AND state = 'NEXT'", date, now, id);
      if (result.changes !== 1) throw new Error("Solo puedes programar una acción NEXT.");
      await this.database.runAsync("DELETE FROM focus_selections WHERE item_id = ?", id);
    });
    const item = await this.getItemById(id);
    if (!item) throw new Error("No se encontró la acción programada.");
    return item;
  }

  async setDueAt(id: string, dueAt: string): Promise<Item> {
    const value = validateDueAt(dueAt);
    const result = await this.database.runAsync("UPDATE items SET due_at = ?, updated_at = ? WHERE id = ? AND state NOT IN ('TRASH', 'DONE')", value, new Date().toISOString(), id);
    if (result.changes !== 1) throw new Error("No se pudo establecer el vencimiento.");
    const item = await this.getItemById(id);
    if (!item) throw new Error("No se encontró la acción.");
    return item;
  }

  async clearDueAt(id: string): Promise<Item> {
    const result = await this.database.runAsync("UPDATE items SET due_at = NULL, updated_at = ? WHERE id = ? AND state NOT IN ('TRASH', 'DONE')", new Date().toISOString(), id);
    if (result.changes !== 1) throw new Error("No se pudo quitar el vencimiento.");
    const item = await this.getItemById(id);
    if (!item) throw new Error("No se encontró la acción.");
    return item;
  }

  async completeAction(id: string): Promise<Item> {
    const now = new Date().toISOString();
    let item: Item | null = null;
    await this.database.withTransactionAsync(async () => {
      const result = await this.database.runAsync("UPDATE items SET state = 'DONE', completed_at = ?, updated_at = ? WHERE id = ? AND state = 'NEXT'", now, now, id);
      if (result.changes !== 1) throw new Error("Solo puedes completar una acción NEXT.");
      await this.database.runAsync("DELETE FROM focus_selections WHERE item_id = ?", id);
      item = await this.getItemById(id);
    });
    if (!item) throw new Error("No se encontró la acción completada.");
    return item;
  }

  async undoCompletion(id: string): Promise<Item> {
    const now = new Date().toISOString();
    const result = await this.database.runAsync("UPDATE items SET state = 'NEXT', completed_at = NULL, updated_at = ? WHERE id = ? AND state = 'DONE'", now, id);
    if (result.changes !== 1) throw new Error("Solo puedes deshacer una acción completada.");
    const item = await this.getItemById(id);
    if (!item) throw new Error("No se encontró la acción.");
    return item;
  }

  async activateScheduledItems(localDate: string): Promise<number> {
    const date = validateLocalDate(localDate);
    const result = await this.database.runAsync("UPDATE items SET state = 'NEXT', updated_at = ? WHERE state = 'SCHEDULED' AND available_from IS NOT NULL AND available_from <= ?", new Date().toISOString(), date);
    return result.changes;
  }
}
