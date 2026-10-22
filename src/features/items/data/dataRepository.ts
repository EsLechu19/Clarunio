import type { SQLiteDatabase } from "expo-sqlite";
import type { Item, ItemState } from "../domain/item";

type Row = { id: string; title: string; state: ItemState; previous_state: ItemState | null; updated_at: string };
function map(row: Row): Item { return { id: row.id, title: row.title, state: row.state, createdAt: row.updated_at, updatedAt: row.updated_at }; }

export class SQLiteDataRepository {
  constructor(private readonly database: SQLiteDatabase) {}
  async list(state: "DONE" | "TRASH"): Promise<Item[]> { const rows = await this.database.getAllAsync<Row>("SELECT id, title, state, previous_state, updated_at FROM items WHERE state = ? ORDER BY updated_at DESC", state); return rows.map(map); }
  async restore(id: string): Promise<void> { const result = await this.database.runAsync("UPDATE items SET state = COALESCE(previous_state, 'NEXT'), previous_state = NULL, deleted_at = NULL, completed_at = NULL, updated_at = ? WHERE id = ? AND state IN ('DONE', 'TRASH')", new Date().toISOString(), id); if (result.changes !== 1) throw new Error("No se pudo restaurar el elemento."); }
  async purge(id: string): Promise<void> { const result = await this.database.runAsync("DELETE FROM items WHERE id = ? AND state IN ('DONE', 'TRASH')", id); if (result.changes !== 1) throw new Error("No se pudo purgar el elemento."); }
  async deleteAll(): Promise<void> { await this.database.withTransactionAsync(async () => { await this.database.runAsync("DELETE FROM focus_selections"); await this.database.runAsync("DELETE FROM items"); await this.database.runAsync("DELETE FROM projects"); await this.database.runAsync("DELETE FROM review_sessions"); await this.database.runAsync("DELETE FROM settings"); }); }
}
