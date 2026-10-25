import type { SQLiteDatabase } from "expo-sqlite";

export type SearchResult = {
  id: string;
  kind: "item" | "project";
  title: string;
  subtitle: string;
  state?: string;
  updatedAt?: string;
};

export function searchPattern(value: string): string { return `%${value.trim().replaceAll("%", "\\%").replaceAll("_", "\\_")}%`; }

export function sortSearchResults(results: SearchResult[]): SearchResult[] {
  return [...results].sort((left, right) => {
    const updatedOrder = (right.updatedAt ?? "").localeCompare(left.updatedAt ?? "");
    return updatedOrder || `${left.kind}-${left.id}`.localeCompare(`${right.kind}-${right.id}`);
  });
}

export class SQLiteSearchRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async search(value: string): Promise<SearchResult[]> {
    const query = value.trim();
    if (!query) return [];
    const pattern = searchPattern(query);
    const items = await this.database.getAllAsync<{ id: string; title: string; notes: string | null; state: string; updated_at: string }>(
      "SELECT id, title, notes, state, updated_at FROM items WHERE (title LIKE ? ESCAPE '\\' OR COALESCE(notes, '') LIKE ? ESCAPE '\\') AND state != ? ORDER BY updated_at DESC",
      pattern,
      pattern,
      "TRASH"
    );
    const projects = await this.database.getAllAsync<{ id: string; desired_outcome: string; notes: string | null; status: string; updated_at: string }>(
      "SELECT id, desired_outcome, notes, status, updated_at FROM projects WHERE (desired_outcome LIKE ? ESCAPE '\\' OR COALESCE(notes, '') LIKE ? ESCAPE '\\') AND status != ? ORDER BY updated_at DESC",
      pattern,
      pattern,
      "ARCHIVED"
    );
    return sortSearchResults([
      ...items.map((item) => ({ id: item.id, kind: "item" as const, title: item.title, subtitle: item.notes ?? "", state: item.state, updatedAt: item.updated_at })),
      ...projects.map((project) => ({ id: project.id, kind: "project" as const, title: project.desired_outcome, subtitle: project.notes ?? "", state: project.status, updatedAt: project.updated_at }))
    ]);
  }
}
