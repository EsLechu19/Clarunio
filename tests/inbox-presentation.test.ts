import { describe, expect, it } from "vitest";

import { formatRelativeCaptureDate } from "@/src/shared/ui/inboxPresentation";

describe("presentación temporal de Bandeja", () => {
  const now = new Date("2026-10-24T15:00:00-03:00");

  it("usa etiquetas relativas para capturas recientes", () => {
    expect(formatRelativeCaptureDate("2026-10-24T14:45:00-03:00", now)).toBe("Ahora");
    expect(formatRelativeCaptureDate("2026-10-24T13:00:00-03:00", now)).toBe("Hace 2 horas");
    expect(formatRelativeCaptureDate("2026-10-23T15:00:00-03:00", now)).toBe("Ayer");
  });

  it("usa una fecha localizada cuando la captura es más antigua", () => {
    expect(formatRelativeCaptureDate("2026-10-20T15:00:00-03:00", now)).toBe("20 oct");
  });
});
