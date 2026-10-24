import { describe, expect, it } from "vitest";

import { immediateWhenReduced, motionDurations } from "@/src/shared/motion/tokens";

describe("contrato de motion accesible", () => {
  it("mantiene duraciones breves y ordenadas", () => {
    expect(motionDurations.quick).toBeLessThan(motionDurations.standard);
    expect(motionDurations.standard).toBeLessThan(motionDurations.emphasis);
    expect(motionDurations.emphasis).toBeLessThanOrEqual(320);
  });

  it("devuelve el estado inmediato cuando se reduce el movimiento", () => {
    expect(immediateWhenReduced(true, "animado", "inmediato")).toBe("inmediato");
    expect(immediateWhenReduced(false, "animado", "inmediato")).toBe("animado");
  });
});
