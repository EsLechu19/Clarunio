import { describe, expect, it } from "vitest";

import { excludeFocusedActions } from "@/src/shared/ui/nowPresentation";

describe("presentación de Ahora", () => {
  it("excluye de disponibles las acciones que ya están enfocadas", () => {
    const focused = [{ id: "focused", title: "En foco" }] as never[];
    const available = [{ id: "focused", title: "En foco" }, { id: "available", title: "Disponible" }] as never[];

    expect(excludeFocusedActions(focused, available).map((item) => item.id)).toEqual(["available"]);
  });
});
