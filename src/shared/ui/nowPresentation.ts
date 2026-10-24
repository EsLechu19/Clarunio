import type { Item } from "@/src/features/items/domain/item";

export function excludeFocusedActions(focused: Item[], available: Item[]): Item[] {
  const focusedIds = new Set(focused.map((item) => item.id));
  return available.filter((item) => !focusedIds.has(item.id));
}
