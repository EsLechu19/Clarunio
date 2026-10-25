import { describe, expect, it, vi } from "vitest";

import { searchResultSubtitle, sortSearchResults, translateSearchState } from "@/src/features/search/searchPresentation";
import { SQLiteSearchRepository, type SearchResult } from "@/src/features/search/data/searchRepository";

const result = (partial: Partial<SearchResult>): SearchResult => ({ id: "1", kind: "item", title: "Buscar", subtitle: "", ...partial });

describe("presentación de búsqueda", () => {
  it.each([
    ["NEXT", "Siguiente acción"], ["WAITING", "Esperando"], ["SCHEDULED", "Programada"],
    ["SOMEDAY", "Algún día"], ["REFERENCE", "Referencia"], ["DONE", "Completada"]
  ])("traduce %s", (state, label) => expect(translateSearchState(result({ state }))).toBe(label));

  it("distingue estados de proyecto", () => expect(translateSearchState(result({ kind: "project", state: "ACTIVE" }))).toBe("Activo"));
  it("no muestra un subtítulo inventado", () => expect(searchResultSubtitle(result({ subtitle: "  " }))).toBeNull());
  it("ordena resultados combinados por actualización y desempata de forma estable", () => {
    const results = sortSearchResults([
      result({ id: "b", updatedAt: "2026-01-01T00:00:00.000Z" }),
      result({ id: "a", kind: "project", updatedAt: "2026-01-02T00:00:00.000Z" })
    ]);
    expect(results.map(({ id }) => id)).toEqual(["a", "b"]);
  });
  it("no consulta SQLite para una query vacía", async () => {
    const getAllAsync = vi.fn();
    await expect(new SQLiteSearchRepository({ getAllAsync } as never).search("   ")).resolves.toEqual([]);
    expect(getAllAsync).not.toHaveBeenCalled();
  });
});
