import { describe, expect, it } from "vitest";

import { captureExitDecision } from "@/src/shared/ui/captureExitPolicy";

describe("política de salida de captura", () => {
  it("sale sin confirmar cuando el texto está vacío", () => {
    expect(captureExitDecision("  \n", "idle")).toBe("allow");
  });

  it("confirma cuando hay texto sin guardar", () => {
    expect(captureExitDecision("Una idea", "idle")).toBe("confirm");
  });

  it("bloquea la salida durante guardar o éxito", () => {
    expect(captureExitDecision("Una idea", "saving")).toBe("blocked");
    expect(captureExitDecision("Una idea", "success")).toBe("blocked");
  });
});
