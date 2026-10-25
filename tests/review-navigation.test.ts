import { describe, expect, it } from "vitest";

import { getReviewItemRoute } from "@/src/features/review/reviewNavigation";

describe("navegación de elementos de revisión", () => {
  it("lleva las capturas de bandeja a aclaración", () => {
    expect(getReviewItemRoute("INBOX", "inbox-1")).toBe("/clarify/inbox-1");
  });

  it("lleva etapas de acciones a su detalle", () => {
    expect(getReviewItemRoute("NEXT", "item-1")).toBe("/item/item-1");
    expect(getReviewItemRoute("WAITING", "item-2")).toBe("/item/item-2");
    expect(getReviewItemRoute("SCHEDULED_SOMEDAY", "item-3")).toBe("/item/item-3");
  });

  it("lleva proyectos sin siguiente acción a su detalle", () => {
    expect(getReviewItemRoute("PROJECTS", "project-1")).toBe("/project/project-1");
  });
});
