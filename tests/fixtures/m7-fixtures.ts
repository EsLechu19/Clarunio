import type { Item } from "@/src/features/items/domain/item";

export function createSyntheticItems(count: number): Item[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `fixture-item-${String(index + 1).padStart(5, "0")}`,
    title: `Elemento sintético ${index + 1}`,
    notes: index % 10 === 0 ? "texto de referencia sintético" : null,
    state: "NEXT",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  }));
}
