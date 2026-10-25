import { describe, expect, it } from "vitest";

import { getProjectFilterCounts, getProjectHighlights, matchesProjectFilter, type ProjectWithItems } from "@/src/shared/ui/projectPresentation";

const project = (overrides: Partial<ProjectWithItems> = {}): ProjectWithItems => ({
  id: "project-1",
  desiredOutcome: "Exposición lista",
  status: "ACTIVE",
  createdAt: "2026-10-24",
  updatedAt: "2026-10-24",
  items: [],
  ...overrides
});

describe("presentación de proyectos", () => {
  it("prioriza la siguiente acción y conserva espera y bloqueo como metadata independiente", () => {
    const highlights = getProjectHighlights(project({
      blockedReason: "Falta una respuesta",
      items: [
        { id: "next", title: "Redactar esquema", state: "NEXT", createdAt: "", updatedAt: "" },
        { id: "waiting", title: "Confirmar fecha", state: "WAITING", waitingFor: "Ana", createdAt: "", updatedAt: "" }
      ]
    }));

    expect(highlights.map(({ text }) => text)).toEqual([
      "Siguiente acción: Redactar esquema",
      "Esperando: Ana",
      "Bloqueado: Falta una respuesta"
    ]);
  });

  it("cuenta estados reales y mantiene archivados dentro de Todos", () => {
    const projects = [project(), project({ id: "2", status: "SOMEDAY" }), project({ id: "3", status: "COMPLETED" }), project({ id: "4", status: "ARCHIVED" })];
    expect(getProjectFilterCounts(projects)).toEqual({ ALL: 4, ACTIVE: 1, SOMEDAY: 1, COMPLETED: 1 });
    expect(projects.filter((item) => matchesProjectFilter(item, "ALL"))).toHaveLength(4);
  });

  it("explica qué hacer cuando no existe una metadata accionable", () => {
    expect(getProjectHighlights(project({ items: [] }))).toEqual([{ kind: "empty", text: "Define una siguiente acción para avanzar." }]);
  });
});
