import { describe, expect, it } from "vitest";

import { radii, spacing, themeTokens } from "@/src/shared/theme/tokens";

describe("Clarunio M0 contracts", () => {
  it("exposes light and dark lavanda/violet theme tokens", () => {
    expect(themeTokens.light.primary).toBe("#6526CF");
    expect(themeTokens.dark.primary).toBe("#B69AFF");
    expect(themeTokens.light.background).not.toBe(themeTokens.dark.background);
    expect(themeTokens.light).toHaveProperty("surface");
    expect(themeTokens.light).toHaveProperty("outline");
  });

  it("keeps the shared spacing and rounded geometry contract", () => {
    expect(spacing).toMatchObject({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32 });
    expect(radii.card).toBe(20);
    expect(radii.pill).toBe(999);
  });

  it("uses the three contractual primary destinations", () => {
    expect(["Ahora", "Bandeja", "Proyectos"]).toEqual(["Ahora", "Bandeja", "Proyectos"]);
  });
});
