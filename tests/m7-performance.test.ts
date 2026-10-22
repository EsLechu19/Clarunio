import { describe, expect, it } from "vitest";

import { createSyntheticItems } from "./fixtures/m7-fixtures";

describe("M7 fixture sintético de listado", () => {
  it("genera 5.000 elementos deterministas sin tocar datos de usuario", () => {
    const first = createSyntheticItems(5_000);
    const second = createSyntheticItems(5_000);

    expect(first).toHaveLength(5_000);
    expect(first).toEqual(second);
    expect(first[0]?.id).toBe("fixture-item-00001");
    expect(first.at(-1)?.id).toBe("fixture-item-05000");
  });

  it("mide el comportamiento local de búsqueda sin convertirlo en una promesa de rendimiento", () => {
    const items = createSyntheticItems(5_000);
    const startedAt = performance.now();
    const matches = items.filter((item) => item.title.toLocaleLowerCase().includes("elemento sintético 4999"));
    const elapsedMs = performance.now() - startedAt;

    expect(matches).toHaveLength(1);
    expect(Number.isFinite(elapsedMs)).toBe(true);
    console.info(`Fixture local de 5.000 elementos: búsqueda completada en ${elapsedMs.toFixed(2)} ms; medición orientativa, no criterio de rendimiento.`);
  });
});
