import { describe, expect, it } from "vitest";

import { getReviewStepCopy, REVIEW_ENTRY_SUMMARY } from "@/src/features/review/reviewPresentation";

describe("presentación humana de la revisión", () => {
  it("presenta preguntas distintas para Programadas y Algún día", () => {
    expect(getReviewStepCopy("INBOX")).toMatchObject({ group: "Inbox", title: "Aclarar" });
    expect(getReviewStepCopy("NEXT").group).toBe("Poner al día");
    expect(getReviewStepCopy("WAITING").group).toBe("Poner al día");
    expect(getReviewStepCopy("PROJECTS").group).toBe("Poner al día");
    expect(getReviewStepCopy("SCHEDULED")).toMatchObject({ title: "Programadas", question: "¿Estas fechas siguen siendo realistas?" });
    expect(getReviewStepCopy("SOMEDAY")).toMatchObject({ title: "Algún día", question: "¿Esto todavía merece espacio en tu sistema?" });
    expect(getReviewStepCopy("SCHEDULED_SOMEDAY").group).toBe("Compatibilidad");
    expect(getReviewStepCopy("CLOSURE").group).toBe("Cierre");
  });

  it("expone solo los cuatro datos reales de la entrada", () => {
    expect(REVIEW_ENTRY_SUMMARY.map(({ key }) => key)).toEqual(["inbox", "next", "waiting", "projectsWithoutNext"]);
  });
});
