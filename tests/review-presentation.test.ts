import { describe, expect, it } from "vitest";

import { getReviewStepCopy, REVIEW_ENTRY_SUMMARY } from "@/src/features/review/reviewPresentation";

describe("presentación humana de la revisión", () => {
  it("mantiene la agrupación visual sin cambiar los seis pasos", () => {
    expect(getReviewStepCopy("INBOX")).toMatchObject({ group: "Inbox", title: "Aclarar" });
    expect(getReviewStepCopy("NEXT").group).toBe("Poner al día");
    expect(getReviewStepCopy("WAITING").group).toBe("Poner al día");
    expect(getReviewStepCopy("PROJECTS").group).toBe("Poner al día");
    expect(getReviewStepCopy("SCHEDULED_SOMEDAY").group).toBe("Mirar adelante");
    expect(getReviewStepCopy("CLOSURE").group).toBe("Cierre");
  });

  it("expone solo los cuatro datos reales de la entrada", () => {
    expect(REVIEW_ENTRY_SUMMARY.map(({ key }) => key)).toEqual(["inbox", "next", "waiting", "projectsWithoutNext"]);
  });
});
