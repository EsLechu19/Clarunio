import type { SQLiteDatabase } from "expo-sqlite";

const CURRENT_SCHEMA_VERSION = 1;

export async function initializeDatabase(database: SQLiteDatabase): Promise<void> {
  await database.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  const version = await database.getFirstAsync<{ user_version: number }>("PRAGMA user_version");

  if (version === null) {
    throw new Error("No se pudo leer la versión de la base local.");
  }
  if (version.user_version > CURRENT_SCHEMA_VERSION) {
    throw new Error("La base local es más nueva que esta versión de Clarunio.");
  }
  if (version.user_version === CURRENT_SCHEMA_VERSION) {
    return;
  }

  await database.withTransactionAsync(async () => {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        notes TEXT,
        state TEXT NOT NULL CHECK (state IN ('INBOX', 'NEXT', 'WAITING', 'SCHEDULED', 'SOMEDAY', 'REFERENCE', 'DONE', 'TRASH')),
        project_id TEXT,
        waiting_for TEXT,
        available_from TEXT,
        due_at TEXT,
        follow_up_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT,
        deleted_at TEXT,
        previous_state TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0
      );
      CREATE INDEX IF NOT EXISTS idx_items_state_updated_at ON items (state, updated_at);
      CREATE INDEX IF NOT EXISTS idx_items_project_state ON items (project_id, state);
      CREATE INDEX IF NOT EXISTS idx_items_available_state ON items (available_from, state);
    `);
    await database.execAsync(`PRAGMA user_version = ${CURRENT_SCHEMA_VERSION}`);
  });
}
