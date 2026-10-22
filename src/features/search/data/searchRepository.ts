import type { SQLiteDatabase } from "expo-sqlite";

export type SearchResult = {
  id: string;
  kind: "item" | "project";
  title: string;
  subtitle: string;
  state?: string;
};

export function searchPattern(value: string): string { return `%${value.trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`; }

export class SQLiteSearchRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async search(value: string): Promise<SearchResult[]> {
    const query = value.trim();
    if (!query) return [];
    const pattern = searchPattern(query);
    const items = await this.database.getAllAsync<{ id: string; title: string; notes: string | null; state: string }>(
      "SELECT id, title, notes, state FROM items WHERE (title LIKE ? ESCAPE '\\' OR COALESCE(notes, '') LIKE ? ESCAPE '\\') AND state != ? ORDER BY updated_at DESC",
      pattern,
      pattern,
      "TRASH"
    );
    const projects = await this.database.getAllAsync<{ id: string; desired_outcome: string; notes: string | null; status: string }>(
      "SELECT id, desired_outcome, notes, status FROM projects WHERE (desired_outcome LIKE ? ESCAPE '\\' OR COALESCE(notes, '') LIKE ? ESCAPE '\\') AND status != ? ORDER BY updated_at DESC",
      pattern,
      pattern,
      "ARCHIVED"
    );
    return [
      ...items.map((item) => ({ id: item.id, kind: "item" as const, title: item.title, subtitle: item.notes ?? "Acción o referencia", state: item.state })),
      ...projects.map((project) => ({ id: project.id, kind: "project" as const, title: project.desired_outcome, subtitle: project.notes ?? "Proyecto", state: project.status }))
    ];
  }
}
