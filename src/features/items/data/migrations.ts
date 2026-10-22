import type { SQLiteDatabase } from "expo-sqlite";

const CURRENT_SCHEMA_VERSION = 4;

export async function initializeDatabase(database: SQLiteDatabase): Promise<void> {
  await database.execAsync("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  const version = await database.getFirstAsync<{ user_version: number }>("PRAGMA user_version");

  if (version === null) {
    throw new Error("No se pudo leer la versión de la base local.");
  }
  if (version.user_version > CURRENT_SCHEMA_VERSION) {
    throw new Error("La base local es más nueva que esta versión de Clarunio.");
  }
  await database.withTransactionAsync(async () => {
    if (version.user_version < 1) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, notes TEXT,
          state TEXT NOT NULL CHECK (state IN ('INBOX', 'NEXT', 'WAITING', 'SCHEDULED', 'SOMEDAY', 'REFERENCE', 'DONE', 'TRASH')),
          project_id TEXT, waiting_for TEXT, available_from TEXT, due_at TEXT, follow_up_at TEXT,
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL, completed_at TEXT, deleted_at TEXT,
          previous_state TEXT, sort_order INTEGER NOT NULL DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_items_state_updated_at ON items (state, updated_at);
        CREATE INDEX IF NOT EXISTS idx_items_available_state ON items (available_from, state);
      `);
      await database.execAsync("PRAGMA user_version = 1");
    }
    if (version.user_version < 2) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY NOT NULL,
          desired_outcome TEXT NOT NULL,
          notes TEXT,
          status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'SOMEDAY', 'COMPLETED', 'ARCHIVED')),
          blocked_reason TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          completed_at TEXT,
          sort_order INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE items_with_project_fk (
          id TEXT PRIMARY KEY NOT NULL, title TEXT NOT NULL, notes TEXT,
          state TEXT NOT NULL CHECK (state IN ('INBOX', 'NEXT', 'WAITING', 'SCHEDULED', 'SOMEDAY', 'REFERENCE', 'DONE', 'TRASH')),
          project_id TEXT REFERENCES projects(id) ON DELETE RESTRICT, waiting_for TEXT, available_from TEXT, due_at TEXT, follow_up_at TEXT,
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL, completed_at TEXT, deleted_at TEXT,
          previous_state TEXT, sort_order INTEGER NOT NULL DEFAULT 0
        );
        INSERT INTO items_with_project_fk SELECT * FROM items;
        DROP TABLE items;
        ALTER TABLE items_with_project_fk RENAME TO items;
        CREATE INDEX IF NOT EXISTS idx_projects_status_sort ON projects (status, sort_order, updated_at);
        CREATE INDEX IF NOT EXISTS idx_items_state_updated_at ON items (state, updated_at);
        CREATE INDEX IF NOT EXISTS idx_items_project_state ON items (project_id, state);
        CREATE INDEX IF NOT EXISTS idx_items_waiting_state ON items (waiting_for, state);
      `);
      await database.execAsync("PRAGMA user_version = 2");
    }
    if (version.user_version < 3) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS focus_selections (
          item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
          focus_date TEXT NOT NULL,
          created_at TEXT NOT NULL,
          PRIMARY KEY (item_id, focus_date)
        );
        CREATE INDEX IF NOT EXISTS idx_focus_selections_date ON focus_selections (focus_date);
        CREATE INDEX IF NOT EXISTS idx_items_due_at ON items (due_at);
        CREATE INDEX IF NOT EXISTS idx_items_follow_up_at_state ON items (follow_up_at, state);
      `);
      await database.execAsync("PRAGMA user_version = 3");
    }
    if (version.user_version < 4) {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS review_sessions (
          id TEXT PRIMARY KEY NOT NULL,
          kind TEXT NOT NULL CHECK (kind IN ('WEEKLY', 'RECOVERY')),
          state TEXT NOT NULL CHECK (state IN ('IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
          current_step TEXT NOT NULL,
          started_at TEXT NOT NULL,
          finished_at TEXT,
          summary_json TEXT NOT NULL DEFAULT '{}'
        );
        CREATE INDEX IF NOT EXISTS idx_review_sessions_kind_state ON review_sessions (kind, state);
      `);
      await database.execAsync("PRAGMA user_version = 4");
    }
  });
}
