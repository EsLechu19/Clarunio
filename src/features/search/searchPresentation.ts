import type { SearchResult } from "./data/searchRepository";
export { sortSearchResults } from "./data/searchRepository";

const itemStateLabels: Record<string, string> = {
  NEXT: "Siguiente acción",
  WAITING: "Esperando",
  SCHEDULED: "Programada",
  SOMEDAY: "Algún día",
  REFERENCE: "Referencia",
  DONE: "Completada",
  INBOX: "Bandeja"
};

const projectStatusLabels: Record<string, string> = {
  ACTIVE: "Activo",
  SOMEDAY: "Algún día",
  COMPLETED: "Completado",
  ARCHIVED: "Archivado"
};

export function translateSearchState(result: Pick<SearchResult, "kind" | "state">): string {
  if (!result.state) return result.kind === "project" ? "Proyecto" : "Acción";
  return (result.kind === "project" ? projectStatusLabels : itemStateLabels)[result.state] ?? result.state;
}

export function searchResultSubtitle(result: Pick<SearchResult, "subtitle">): string | null {
  const subtitle = result.subtitle.trim();
  return subtitle ? subtitle : null;
}
